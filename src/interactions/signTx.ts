import { DeviceVersionUnsupported } from "../errors"
import { StakeCredentialType, Int64_str, ParsedAssetGroup, ParsedCertificate, ParsedInput, ParsedOutput, ParsedSigningRequest, ParsedTransaction, ParsedTxAuxiliaryData, ParsedWithdrawal, Uint64_str, ValidBIP32Path, Version } from "../types/internal"
import { CertificateType, ED25519_SIGNATURE_LENGTH, PoolOwnerType, TX_HASH_LENGTH } from "../types/internal"
import type { SignedTransactionData, TxAuxiliaryDataSupplement } from "../types/public"
import { PoolKeyType, TransactionSigningMode, TxAuxiliaryDataSupplementType, TxAuxiliaryDataType } from "../types/public"
import { assert } from "../utils/assert"
import { buf_to_hex, hex_to_buf, int64_to_buf, uint64_to_buf } from "../utils/serialize"
import { INS } from "./common/ins"
import type { Interaction, SendParams } from "./common/types"
import { ensureLedgerAppVersionCompatible, getCompatibility } from "./getVersion"
import { serializeCatalystRegistrationNonce, serializeCatalystRegistrationRewardsDestination, serializeCatalystRegistrationStakingPath, serializeCatalystRegistrationVotingKey } from "./serialization/catalystRegistration"
import { serializeFinancials, serializePoolInitialParams, serializePoolInitialParamsLegacy, serializePoolKey, serializePoolMetadata, serializePoolOwner, serializePoolRelay, serializePoolRewardAccount } from "./serialization/poolRegistrationCertificate"
import { serializeTxAuxiliaryData } from "./serialization/txAuxiliaryData"
import { serializeTxCertificate, serializeTxCertificatePreMultisig } from "./serialization/txCertificate"
import { serializeTxInit } from "./serialization/txInit"
import { serializeAssetGroup, serializeMintBasicParams, serializeToken, serializeTxFee, serializeTxInput, serializeTxTtl, serializeTxValidityStart, serializeTxWithdrawal, serializeTxWithdrawalPreMultisig, serializeTxWitnessRequest } from "./serialization/txOther"
import { serializeTxOutputBasicParams } from "./serialization/txOutput"

const enum P1 {
  STAGE_INIT = 0x01,
  STAGE_AUX_DATA = 0x08,
  STAGE_INPUTS = 0x02,
  STAGE_OUTPUTS = 0x03,
  STAGE_FEE = 0x04,
  STAGE_TTL = 0x05,
  STAGE_CERTIFICATES = 0x06,
  STAGE_WITHDRAWALS = 0x07,
  STAGE_VALIDITY_INTERVAL_START = 0x09,
  STAGE_CONFIRM = 0x0a,
  STAGE_MINT = 0x0b,
  STAGE_WITNESSES = 0x0f,
}

const send = (params: {
  p1: number,
  p2: number,
  data: Buffer,
  expectedResponseLength?: number
}): SendParams => ({ ins: INS.SIGN_TX, ...params })


function* signTx_init(
    tx: ParsedTransaction,
    signingMode: TransactionSigningMode,
    witnessPaths: ValidBIP32Path[],
    scriptWitnessPaths: ValidBIP32Path[],
): Interaction<void> {
  const enum P2 {
    UNUSED = 0x00,
  }

  const _response = yield send({
      p1: P1.STAGE_INIT,
      p2: P2.UNUSED,
      data: serializeTxInit(tx, signingMode,
        scriptWitnessPaths.length == 0 ? witnessPaths.length : scriptWitnessPaths.length),
      expectedResponseLength: 0,
  })
}

function* signTx_addInput(
    input: ParsedInput
): Interaction<void> {
  const enum P2 {
    UNUSED = 0x00,
  }

  yield send({
      p1: P1.STAGE_INPUTS,
      p2: P2.UNUSED,
      data: serializeTxInput(input),
      expectedResponseLength: 0,
  })
}

function* signTx_addOutput(
    output: ParsedOutput,
    version: Version,
): Interaction<void> {
  const enum P2 {
    BASIC_DATA = 0x30,
    CONFIRM = 0x33,
  }

  // Basic data
  yield send({
      p1: P1.STAGE_OUTPUTS,
      p2: P2.BASIC_DATA,
      data: serializeTxOutputBasicParams(output, version),
      expectedResponseLength: 0,
  })

  yield* signTx_addTokenBundle(output.tokenBundle, P1.STAGE_OUTPUTS, uint64_to_buf)

  yield send({
      p1: P1.STAGE_OUTPUTS,
      p2: P2.CONFIRM,
      data: Buffer.alloc(0),
      expectedResponseLength: 0,
  })
}

export type SerializeTokenAmountFn<T> = (val: T) => Buffer

function* signTx_addTokenBundle<T>(tokenBundle: ParsedAssetGroup<T>[], p1: number, serializeTokenAmountFn: SerializeTokenAmountFn<T>) {
    const enum P2 {
        ASSET_GROUP = 0x31,
        TOKEN = 0x32,
    }

    // Assets
    for (const assetGroup of tokenBundle) {
        yield send({
            p1: p1,
            p2: P2.ASSET_GROUP,
            data: serializeAssetGroup(assetGroup),
            expectedResponseLength: 0,
        })

        for (const token of assetGroup.tokens) {
            yield send({
                p1: p1,
                p2: P2.TOKEN,
                data: serializeToken(token, serializeTokenAmountFn),
                expectedResponseLength: 0,
            })
        }
    }
}

function* signTx_addCertificate(
    version: Version,
    certificate: ParsedCertificate,
): Interaction<void> {
  const enum P2 {
    UNUSED = 0x00,
  }
  if (getCompatibility(version).supportsMultisig) {
      yield send({
          p1: P1.STAGE_CERTIFICATES,
          p2: P2.UNUSED,
          data: serializeTxCertificate(certificate),
          expectedResponseLength: 0,
      })
  } else {
    yield send({
        p1: P1.STAGE_CERTIFICATES,
        p2: P2.UNUSED,
        data: serializeTxCertificatePreMultisig(certificate),
        expectedResponseLength: 0,
    })
}

  // additional data for pool certificate
  if (certificate.type === CertificateType.STAKE_POOL_REGISTRATION) {
      if (getCompatibility(version).supportsPoolRegistrationAsOperator) {
          yield* signTx_addStakePoolRegistrationCertificate(certificate)
      } else {
          yield* signTx_addStakePoolRegistrationCertificateLegacy(certificate)
      }
  }
}

function* signTx_addStakePoolRegistrationCertificate(
    certificate: ParsedCertificate
): Interaction<void> {
    assert(certificate.type === CertificateType.STAKE_POOL_REGISTRATION, "invalid certificate type")

  const enum P2 {
    INIT = 0x30,
    POOL_KEY = 0x31,
    VRF_KEY = 0x32,
    FINANCIALS = 0x33,
    REWARD_ACCOUNT = 0x34,
    OWNERS = 0x35,
    RELAYS = 0x36,
    METADATA = 0x37,
    CONFIRMATION = 0x38,
  }

  const pool = certificate.pool
  yield send({
      p1: P1.STAGE_CERTIFICATES,
      p2: P2.INIT,
      data: serializePoolInitialParams(pool),
      expectedResponseLength: 0,
  })

  yield send({
      p1: P1.STAGE_CERTIFICATES,
      p2: P2.POOL_KEY,
      data: serializePoolKey(pool.poolKey),
      expectedResponseLength: 0,
  })

  yield send({
      p1: P1.STAGE_CERTIFICATES,
      p2: P2.VRF_KEY,
      data: hex_to_buf(pool.vrfHashHex),
      expectedResponseLength: 0,
  })

  yield send({
      p1: P1.STAGE_CERTIFICATES,
      p2: P2.FINANCIALS,
      data: serializeFinancials(pool),
      expectedResponseLength: 0,
  })

  yield send({
      p1: P1.STAGE_CERTIFICATES,
      p2: P2.REWARD_ACCOUNT,
      data: serializePoolRewardAccount(pool.rewardAccount),
      expectedResponseLength: 0,
  })

  for (const owner of pool.owners) {
      yield send({
          p1: P1.STAGE_CERTIFICATES,
          p2: P2.OWNERS,
          data: serializePoolOwner(owner),
          expectedResponseLength: 0,
      })
  }

  for (const relay of pool.relays) {
      yield send({
          p1: P1.STAGE_CERTIFICATES,
          p2: P2.RELAYS,
          data: serializePoolRelay(relay),
          expectedResponseLength: 0,
      })
  }

  yield send({
      p1: P1.STAGE_CERTIFICATES,
      p2: P2.METADATA,
      data: serializePoolMetadata(pool.metadata),
      expectedResponseLength: 0,
  })

  yield send({
      p1: P1.STAGE_CERTIFICATES,
      p2: P2.CONFIRMATION,
      data: Buffer.alloc(0),
      expectedResponseLength: 0,
  })
}

function* signTx_addStakePoolRegistrationCertificateLegacy(
    certificate: ParsedCertificate
): Interaction<void> {
    assert(certificate.type === CertificateType.STAKE_POOL_REGISTRATION, "invalid certificate type")

  const enum P2 {
    POOL_PARAMS = 0x30,
    OWNERS = 0x31,
    RELAYS = 0x32,
    METADATA = 0x33,
    CONFIRMATION = 0x34,
  }

  const pool = certificate.pool
  yield send({
      p1: P1.STAGE_CERTIFICATES,
      p2: P2.POOL_PARAMS,
      data: serializePoolInitialParamsLegacy(pool),
      expectedResponseLength: 0,
  })

  for (const owner of pool.owners) {
      yield send({
          p1: P1.STAGE_CERTIFICATES,
          p2: P2.OWNERS,
          data: serializePoolOwner(owner),
          expectedResponseLength: 0,
      })
  }

  for (const relay of pool.relays) {
      yield send({
          p1: P1.STAGE_CERTIFICATES,
          p2: P2.RELAYS,
          data: serializePoolRelay(relay),
          expectedResponseLength: 0,
      })
  }

  yield send({
      p1: P1.STAGE_CERTIFICATES,
      p2: P2.METADATA,
      data: serializePoolMetadata(pool.metadata),
      expectedResponseLength: 0,
  })

  yield send({
      p1: P1.STAGE_CERTIFICATES,
      p2: P2.CONFIRMATION,
      data: Buffer.alloc(0),
      expectedResponseLength: 0,
  })
}

function* signTx_addWithdrawal(
    version: Version,
    withdrawal: ParsedWithdrawal,
): Interaction<void> {
  const enum P2 {
    UNUSED = 0x00,
  }
  if (getCompatibility(version).supportsMultisig) {
        yield send({
            p1: P1.STAGE_WITHDRAWALS,
            p2: P2.UNUSED,
            data: serializeTxWithdrawal(withdrawal),
            expectedResponseLength: 0,
        })
    } else {
        yield send({
            p1: P1.STAGE_WITHDRAWALS,
            p2: P2.UNUSED,
            data: serializeTxWithdrawalPreMultisig(withdrawal),
            expectedResponseLength: 0,
        })
    }
}

function* signTx_setFee(
    fee: Uint64_str
): Interaction<void> {
  const enum P2 {
    UNUSED = 0x00,
  }
  yield send({
      p1: P1.STAGE_FEE,
      p2: P2.UNUSED,
      data: serializeTxFee(fee),
      expectedResponseLength: 0,
  })
}

function* signTx_setTtl(
    ttl: Uint64_str
): Interaction<void> {
  const enum P2 {
    UNUSED = 0x00,
  }
  yield send({
      p1: P1.STAGE_TTL,
      p2: P2.UNUSED,
      data: serializeTxTtl(ttl),
      expectedResponseLength: 0,
  })
}

function* signTx_setAuxiliaryData(
    auxiliaryData: ParsedTxAuxiliaryData,
    version: Version,
): Interaction<TxAuxiliaryDataSupplement | null> {
  const enum P2 {
    UNUSED = 0x00,
  }

  const supportedAuxiliaryDataTypes = [
      TxAuxiliaryDataType.ARBITRARY_HASH,
      TxAuxiliaryDataType.CATALYST_REGISTRATION,
  ]

  assert(supportedAuxiliaryDataTypes.includes(auxiliaryData.type), 'Auxiliary data type not implemented')

  yield send({
      p1: P1.STAGE_AUX_DATA,
      p2: P2.UNUSED,
      data: serializeTxAuxiliaryData(auxiliaryData),
      expectedResponseLength: 0,
  })

  if (auxiliaryData.type === TxAuxiliaryDataType.CATALYST_REGISTRATION) {
      const params = auxiliaryData.params

    const enum P2 {
      VOTING_KEY = 0x30,
      STAKING_KEY = 0x31,
      VOTING_REWARDS_ADDRESS = 0x32,
      NONCE = 0x33,
      CONFIRM = 0x34,
    }

    yield send({
        p1: P1.STAGE_AUX_DATA,
        p2: P2.VOTING_KEY,
        data: serializeCatalystRegistrationVotingKey(params.votingPublicKey),
        expectedResponseLength: 0,
    })

    yield send({
        p1: P1.STAGE_AUX_DATA,
        p2: P2.STAKING_KEY,
        data: serializeCatalystRegistrationStakingPath(params.stakingPath),
        expectedResponseLength: 0,
    })

    yield send({
        p1: P1.STAGE_AUX_DATA,
        p2: P2.VOTING_REWARDS_ADDRESS,
        data: serializeCatalystRegistrationRewardsDestination(params.rewardsDestination, version),
        expectedResponseLength: 0,
    })

    yield send({
        p1: P1.STAGE_AUX_DATA,
        p2: P2.NONCE,
        data: serializeCatalystRegistrationNonce(params.nonce),
        expectedResponseLength: 0,
    })

    const response = yield send({
        p1: P1.STAGE_AUX_DATA,
        p2: P2.CONFIRM,
        data: Buffer.alloc(0),
        expectedResponseLength: 96,
    })

    return {
        type: TxAuxiliaryDataSupplementType.CATALYST_REGISTRATION,
        auxiliaryDataHashHex: response.slice(0, 32).toString('hex'),
        catalystRegistrationSignatureHex: response.slice(32, 96).toString('hex'),
    }
  }

  return null
}

function* signTx_setAuxiliaryData_before_v2_3(
    auxiliaryData: ParsedTxAuxiliaryData
): Interaction<null> {
  const enum P2 {
    UNUSED = 0x00,
  }

  assert(auxiliaryData.type === TxAuxiliaryDataType.ARBITRARY_HASH, 'Auxiliary data type not implemented')

  yield send({
      p1: P1.STAGE_AUX_DATA,
      p2: P2.UNUSED,
      data: hex_to_buf(auxiliaryData.hashHex),
      expectedResponseLength: 0,
  })

  return null
}

function* signTx_setValidityIntervalStart(
    validityIntervalStartStr: Uint64_str
): Interaction<void> {
  const enum P2 {
    UNUSED = 0x00,
  }
  yield send({
      p1: P1.STAGE_VALIDITY_INTERVAL_START,
      p2: P2.UNUSED,
      data: serializeTxValidityStart(validityIntervalStartStr),
  })
}

function* signTx_setMint(
    mint: Array<ParsedAssetGroup<Int64_str>>
): Interaction<void> {
    const enum P2 {
        BASIC_DATA = 0x30,
        CONFIRM = 0x33,
    }

    // Basic data
    yield send({
        p1: P1.STAGE_MINT,
        p2: P2.BASIC_DATA,
        data: serializeMintBasicParams(mint),
        expectedResponseLength: 0,
    })

    yield* signTx_addTokenBundle(mint, P1.STAGE_MINT, int64_to_buf)

    yield send({
        p1: P1.STAGE_MINT,
        p2: P2.CONFIRM,
        data: Buffer.alloc(0),
        expectedResponseLength: 0,
    })
}


function* signTx_awaitConfirm(
): Interaction<{ txHashHex: string; }> {
  const enum P2 {
    UNUSED = 0x00,
  }

  const response = yield send({
      p1: P1.STAGE_CONFIRM,
      p2: P2.UNUSED,
      data: Buffer.alloc(0),
      expectedResponseLength: TX_HASH_LENGTH,
  })
  return {
      txHashHex: response.toString("hex"),
  }
}

function* signTx_getWitness(
    path: ValidBIP32Path,
): Interaction<{
  path: ValidBIP32Path;
  witnessSignatureHex: string;
}> {
  const enum P2 {
    UNUSED = 0x00,
  }

  const response = yield send({
      p1: P1.STAGE_WITNESSES,
      p2: P2.UNUSED,
      data: serializeTxWitnessRequest(path),
      expectedResponseLength: ED25519_SIGNATURE_LENGTH,
  })
  return {
      path: path,
      witnessSignatureHex: buf_to_hex(response),
  }
}


function generateWitnessPaths(request: ParsedSigningRequest): ValidBIP32Path[] {
    const { tx } = request
  
    const witnessPaths: Record<string, ValidBIP32Path> = {}
    // eslint-disable-next-line no-inner-declarations
    function _insert(path: ValidBIP32Path) {
        const pathKey = JSON.stringify(path)
        witnessPaths[pathKey] = path
    }

    for (const input of tx.inputs) {
        if (input.path != null) {
            _insert(input.path)
        }
    }

    for (const cert of tx.certificates) {
        if (cert.type === CertificateType.STAKE_POOL_REGISTRATION) {
            const deviceOwnedPoolOwner = cert.pool.owners.find((owner) => owner.type === PoolOwnerType.DEVICE_OWNED)
            if (deviceOwnedPoolOwner != null) {
                assert(deviceOwnedPoolOwner.type === PoolOwnerType.DEVICE_OWNED, "bad witness owner type")
                _insert(deviceOwnedPoolOwner.path)
            }

            if (cert.pool.poolKey.type === PoolKeyType.DEVICE_OWNED) {
                _insert(cert.pool.poolKey.path)
            }
        } else if (cert.type === CertificateType.STAKE_POOL_RETIREMENT) {
            _insert(cert.path)
        } else {
            if (cert.stakeCredential.type == StakeCredentialType.KEY_PATH) {
                _insert(cert.stakeCredential.path)
            }
        }
    }
  
    for (const withdrawal of tx.withdrawals) {
        if (withdrawal.stakeCredential.type == StakeCredentialType.KEY_PATH) {
            _insert(withdrawal.stakeCredential.path)
        }
    }

    return Object.values(witnessPaths)
}

function ensureRequestSupportedByAppVersion(version: Version, request: ParsedSigningRequest): void {
    const auxiliaryData = request?.tx?.auxiliaryData
    const hasCatalystRegistration = auxiliaryData?.type == TxAuxiliaryDataType.CATALYST_REGISTRATION

    if (hasCatalystRegistration && !getCompatibility(version).supportsCatalystRegistration) {
        throw new DeviceVersionUnsupported(`Catalyst registration not supported by Ledger app version ${version}.`)
    }

    if (request?.tx?.ttl === "0" && !getCompatibility(version).supportsZeroTtl) {
        throw new DeviceVersionUnsupported(`Zero TTL not supported by Ledger app version ${version}.`)
    }

    if (request?.signingMode === TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR && !getCompatibility(version).supportsPoolRegistrationAsOperator) {
        throw new DeviceVersionUnsupported(`Pool registration as operator not supported by Ledger app version ${version}.`)
    }

    const certificates = request?.tx?.certificates
    const hasPoolRetirement = certificates && certificates.some(c => c.type === CertificateType.STAKE_POOL_RETIREMENT)
    const hasScripthashStakeCredentials = certificates && certificates.some(c =>
        (c.type === CertificateType.STAKE_DELEGATION ||
        c.type === CertificateType.STAKE_DEREGISTRATION ||
        c.type === CertificateType.STAKE_REGISTRATION) &&
        c.stakeCredential.type === StakeCredentialType.SCRIPT_HASH)

    if (hasPoolRetirement && !getCompatibility(version).supportsPoolRetirement) {
        throw new DeviceVersionUnsupported(`Pool retirement certificate not supported by Ledger app version ${version}.`)
    }
    
    if (!getCompatibility(version).supportsMultisig) {
        //TODO KoMa check multisig scripthashes in every new occurence
        if (hasScripthashStakeCredentials) {
            throw new DeviceVersionUnsupported(`Scripthash based certificate not supported by Ledger app version ${version}.`)
        }
    }
}

export function* signTransaction(version: Version, request: ParsedSigningRequest): Interaction<SignedTransactionData> {
    ensureLedgerAppVersionCompatible(version)
    ensureRequestSupportedByAppVersion(version, request)

    const isCatalystRegistrationSupported = getCompatibility(version).supportsCatalystRegistration

    const witnessPaths = generateWitnessPaths(request)
    const { tx, signingMode, scriptWitnessPaths } = request
    // init
    yield* signTx_init(
        tx, signingMode, witnessPaths, scriptWitnessPaths,
    )

    // auxiliary data
    let auxiliaryDataSupplement = null
    if (isCatalystRegistrationSupported && tx.auxiliaryData != null) {
        auxiliaryDataSupplement = yield* signTx_setAuxiliaryData(tx.auxiliaryData, version)
    }

    // inputs
    for (const input of tx.inputs) {
        yield* signTx_addInput(input)
    }

    // outputs
    for (const output of tx.outputs) {
        yield* signTx_addOutput(output, version)
    }

    // fee
    yield* signTx_setFee(tx.fee)

    // ttl
    if (tx.ttl != null) {
        yield* signTx_setTtl(tx.ttl)
    }

    // certificates
    for (const certificate of tx.certificates) {
        yield* signTx_addCertificate(version, certificate)
    }

    // withdrawals
    for (const withdrawal of tx.withdrawals) {
        yield* signTx_addWithdrawal(version, withdrawal)
    }

    // auxiliary data before Ledger app version 2.3.x
    if (!isCatalystRegistrationSupported && tx.auxiliaryData != null) {
        auxiliaryDataSupplement = yield* signTx_setAuxiliaryData_before_v2_3(tx.auxiliaryData)
    }

    // validity start
    if (tx.validityIntervalStart != null) {
        yield* signTx_setValidityIntervalStart(tx.validityIntervalStart)
    }

    // mint
    if (tx.mint != null) {
        yield* signTx_setMint(tx.mint)
    }

    // confirm
    const { txHashHex } = yield* signTx_awaitConfirm()

    // witnesses
    const witnesses = []
    if (scriptWitnessPaths.length == 0) {
        for (const path of witnessPaths) {
            const witness = yield* signTx_getWitness(path)
            witnesses.push(witness)
        }
    } else {
        for (const path of scriptWitnessPaths) {
            const witness = yield* signTx_getWitness(path)
            witnesses.push(witness)
        }
    }


    return {
        txHashHex,
        witnesses,
        auxiliaryDataSupplement,
    }
}

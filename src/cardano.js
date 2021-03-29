// @flow
import utils, { Precondition, Assert, hex_to_buf } from "./utils";
import {
  TxOutputTypeCodes,
} from './Ada';
import type {
  BIP32Path,
  InputTypeUTxO,
  StakingBlockchainPointer,
  TxOutput,
  Certificate,
  Withdrawal,
  PoolRegistrationParams,
  PoolOwnerParams,
  RelayParams,
  SingleHostIPRelay,
  SingleHostNameRelay,
  MultiHostNameRelay,
  PoolMetadataParams,
} from './Ada';


const HARDENED = 0x80000000;

export const AddressTypeNibbles = Object.freeze({
  BASE: 0b0000,
  POINTER: 0b0100,
  ENTERPRISE: 0b0110,
  BYRON: 0b1000,
  REWARD: 0b1110
});

export const CertificateTypes = Object.freeze({
  STAKE_REGISTRATION: 0,
  STAKE_DEREGISTRATION: 1,
  STAKE_DELEGATION: 2,
  STAKE_POOL_REGISTRATION : 3,
  STAKE_POOL_RETIREMENT: 4
});

export const SignTxIncluded = Object.freeze({
  SIGN_TX_INCLUDED_NO: 1,
  SIGN_TX_INCLUDED_YES: 2
});


const KEY_HASH_LENGTH = 28;
const TX_HASH_LENGTH = 32;
const ED25519_SIGNATURE_LENGTH = 64;
const ED25519_EXTENDED_PUBLIC_KEY_LENGTH = 64;

const TOKEN_POLICY_LENGTH = 28;
const TOKEN_NAME_LENGTH = 32;

const ASSET_GROUPS_MAX = 1000;
const TOKENS_IN_GROUP_MAX = 1000;

const POOL_REGISTRATION_OWNERS_MAX = 1000;
const POOL_REGISTRATION_RELAYS_MAX = 1000;

const KES_PUBLIC_KEY_LENGTH = 32;

export const GetKeyErrors = {
  INVALID_PATH: "invalid key path",
}

export const TxErrors = {
  INVALID_PROTOCOL_MAGIC: "invalid protocol magic",
  INVALID_NETWORK_ID: "invalid network id",

  INPUTS_NOT_ARRAY: "inputs not an array",
  INPUT_WITH_PATH: "stake pool registration: inputs should not contain the witness path",
  INPUT_INVALID_TX_HASH: "invalid tx hash in an input",

  OUTPUTS_NOT_ARRAY: "outputs not an array",
  OUTPUT_INVALID_AMOUNT: "invalid amount in an output",
  OUTPUT_INVALID_TOKEN_BUNDLE: "invalid multiasset token bundle in an output",  
  OUTPUT_INVALID_TOKEN_POLICY: "invalid multiasset token policy",
  OUTPUT_INVALID_ASSET_NAME: "invalid asset name in the token bundle in an output",
  OUTPUT_INVALID_ADDRESS: "invalid address in an output",
  OUTPUT_WITH_PATH: "outputs given by path are not allowed for stake pool registration transactions",
  OUTPUT_UNKNOWN_TYPE: "unknown output type",
  OUTPUT_INVALID_ADDRESS_TYPE_NIBBLE: "invalid address type nibble",
  OUTPUT_INVALID_SPENDING_PATH: "invalid spending path in an output",
  OUTPUT_INVALID_BLOCKCHAIN_POINTER: "invalid blockchain pointer in an output",
  OUTPUT_INVALID_STAKING_KEY_PATH: "invalid staking key path in an output",
  OUTPUT_INVALID_STAKING_KEY_HASH: "invalid staking key hash in an output",
  OUTPUT_INVALID_STAKING_INFO: "Invalid staking info in an output",

  FEE_INVALID: "invalid fee",

  TTL_INVALID: "invalid ttl",

  CERTIFICATES_NOT_ARRAY: "certificates not an array",
  CERTIFICATES_COMBINATION_FORBIDDEN: "pool registration must not be combined with other certificates",
  CERTIFICATES_MULTIPLE_POOL_REGISTRATIONS: "pool registrations must not be combined",
  CERTIFICATE_INVALID: "invalid certificate",
  CERTIFICATE_MISSING_PATH: "path is required for one of the certificates",
  CERTIFICATE_SUPERFLUOUS_PATH: "superfluous path in a certificate",
  CERTIFICATE_MISSING_POOL_KEY_HASH: "pool key hash missing in a certificate",
  CERTIFICATE_INVALID_POOL_KEY_HASH: "invalid pool key hash in a certificate",
  CERTIFICATE_SUPERFLUOUS_POOL_KEY_HASH: "superfluous pool key hash in a certificate",
  CERTIFICATE_SUPERFLUOUS_POOL_REGISTRATION_PARAMS: "superfluous pool registration params in a certificate",
  CERTIFICATE_SUPERFLUOUS_POOL_RETIREMENT_PARAMS: "superfluous pool retirement params in a certificate",
  CERTIFICATE_MISSING_POOL_RETIREMENT_PARAMS: "missing stake pool retirement params in a certificate",
  CERTIFICATE_INVALID_POOL_RETIREMENT_PARAMS: "invalid pool retirement params in a certificate",

  CERTIFICATE_POOL_MISSING_POOL_PARAMS: "missing stake pool params in a pool registration certificate",
  CERTIFICATE_POOL_INVALID_POOL_KEY: "invalid pool key in a pool registration certificate",
  CERTIFICATE_POOL_INVALID_VRF_KEY_HASH: "invalid vrf key hash in a pool registration certificate",
  CERTIFICATE_POOL_INVALID_PLEDGE: "invalid pledge in a pool registration certificate",
  CERTIFICATE_POOL_INVALID_COST: "invalid cost in a pool registration certificate",
  CERTIFICATE_POOL_INVALID_MARGIN: "invalid margin in a pool registration certificate",
  CERTIFICATE_POOL_INVALID_MARGIN_DENOMINATOR: "pool margin denominator must be a value between 1 and 10^15",
  CERTIFICATE_POOL_INVALID_REWARD_ACCOUNT: "invalid reward account in a pool registration certificate",
  CERTIFICATE_POOL_OWNERS_NOT_ARRAY: "owners not an array in a pool registration certificate",
  CERTIFICATE_POOL_OWNERS_TOO_MANY: "too many owners in a pool registration certificate",
  CERTIFICATE_POOL_OWNERS_SINGLE_PATH_OWNER: "there should be exactly one owner given by path in a pool registration certificate signed by owner",
  CERTIFICATE_POOL_OWNERS_SINGLE_PATH_OPERATOR: "there should be no owners given by path in a pool registration certificate signed by pool operator",
  CERTIFICATE_POOL_OWNER_INCOMPLETE: "incomplete owner params in a pool registration certificate",
  CERTIFICATE_POOL_OWNER_INVALID_PATH: "invalid owner path in a pool registration certificate",
  CERTIFICATE_POOL_OWNER_INVALID_KEY_HASH: "invalid owner key hash in a pool registration certificate",
  CERTIFICATE_POOL_RELAYS_NOT_ARRAY: "relays not an array in a pool registration certificate",
  CERTIFICATE_POOL_RELAYS_TOO_MANY: "too many pool relays in a pool registration certificate",
  CERTIFICATE_POOL_RELAY_INVALID_TYPE: "invalid type of a relay in a pool registration certificate",
  CERTIFICATE_POOL_RELAY_INVALID_PORT: "invalid port in a relay in a pool registration certificate",
  CERTIFICATE_POOL_RELAY_INVALID_IPV4: "invalid ipv4 in a relay in a pool registration certificate",
  CERTIFICATE_POOL_RELAY_INVALID_IPV6: "invalid ipv6 in a relay in a pool registration certificate",
  CERTIFICATE_POOL_RELAY_INVALID_DNS: "invalid dns record in a relay in a pool registration certificate",
  CERTIFICATE_POOL_RELAY_MISSING_DNS: "missing dns record in a relay in a pool registration certificate",
  CERTIFICATE_POOL_METADATA_INVALID_URL: "invalid metadata in a pool registration certificate: invalid url",
  CERTIFICATE_POOL_METADATA_INVALID_HASH: "invalid metadata in a pool registration certificate: invalid hash",

  WITHDRAWALS_NOT_ARRAY: "withdrawals not an array",
  WITHDRAWALS_FORBIDDEN: "no withdrawals allowed for transactions registering stake pools",

  METADATA_INVALID: "invalid metadata",

  VALIDITY_INTERVAL_START_INVALID: "invalid validity interval start",
}

export const OpCertErrors = {
  INVALID_KES_KEY: "invalid KES key",
  INVALID_KES_PERIOD: "invalid KES period",
  INVALID_ISSUE_COUNTER: "invalid issue counter",
  INVALID_COLD_KEY_PATH: "invalid cold key path",
}

export const SignTxUsecases = Object.freeze({
	SIGN_TX_USECASE_ORDINARY_TX: 3,
	SIGN_TX_USECASE_POOL_REGISTRATION_OWNER: 4,
	SIGN_TX_USECASE_POOL_REGISTRATION_OPERATOR: 5,
});

export const KeyReferenceType = Object.freeze({
	KEY_REFERENCE_PATH: 1,
	KEY_REFERENCE_HASH: 2,
});

function getFirstPoolRegistrationCertificate(certificates: Array<Certificate>): ?Certificate {
  return certificates.find(
    cert => cert.type === CertificateTypes.STAKE_POOL_REGISTRATION
  );
}

export function determineUsecase(certificates: Array<Certificate>) {
  const poolRegistrationCert = getFirstPoolRegistrationCertificate(certificates);

  // for owner/operator signatures, we determine usecase
  // from the first pool registration certificate
  // (there is supposed to be only one, validated elsewhere)
  if (poolRegistrationCert) {
    const poolParams = poolRegistrationCert.poolRegistrationParams;
    Precondition.check(poolParams != null, TxErrors.CERTIFICATE_POOL_MISSING_POOL_PARAMS);
    Precondition.check(poolParams.poolKey != null, TxErrors.CERTIFICATE_POOL_INVALID_POOL_KEY);

    // full validation of the components of the pool key is done elsewhere
    if (poolParams.poolKey.path) {
      return SignTxUsecases.SIGN_TX_USECASE_POOL_REGISTRATION_OPERATOR;
    } else if (poolParams.poolKey.keyHashHex) {
      return SignTxUsecases.SIGN_TX_USECASE_POOL_REGISTRATION_OWNER;
    } else {
      throw new Error(TxErrors.CERTIFICATE_POOL_INVALID_POOL_KEY);
    }
  }

  return SignTxUsecases.SIGN_TX_USECASE_ORDINARY_TX;
}

function validateCertificates(
  certificates: Array<Certificate>, usecase: $Values<typeof SignTxUsecases>
)
{
  Precondition.checkIsArray(certificates, TxErrors.CERTIFICATES_NOT_ARRAY);

  // this loop validates individual certificates
  // and makes sure that the included certificates correspond to the usecase
  for (const cert of certificates) {
    if (!cert) throw new Error(TxErrors.CERTIFICATE_INVALID);

    switch (cert.type) {
      case CertificateTypes.STAKE_REGISTRATION:
      case CertificateTypes.STAKE_DEREGISTRATION: {
        Precondition.check(usecase === SignTxUsecases.SIGN_TX_USECASE_ORDINARY_TX, TxErrors.CERTIFICATES_COMBINATION_FORBIDDEN);
        Precondition.checkIsValidPath(cert.path, TxErrors.CERTIFICATE_MISSING_PATH);
        Precondition.check(!cert.poolKeyHashHex, TxErrors.CERTIFICATE_SUPERFLUOUS_POOL_KEY_HASH);
        Precondition.check(!cert.poolRegistrationParams, TxErrors.CERTIFICATE_SUPERFLUOUS_POOL_REGISTRATION_PARAMS);
        Precondition.check(!cert.poolRetirementParams, TxErrors.CERTIFICATE_SUPERFLUOUS_POOL_RETIREMENT_PARAMS);
        break;
      }
      case CertificateTypes.STAKE_DELEGATION: {
        Precondition.check(usecase === SignTxUsecases.SIGN_TX_USECASE_ORDINARY_TX, TxErrors.CERTIFICATES_COMBINATION_FORBIDDEN);
        Precondition.checkIsValidPath(cert.path, TxErrors.CERTIFICATE_MISSING_PATH);
        Precondition.checkIsHexString(cert.poolKeyHashHex, TxErrors.CERTIFICATE_MISSING_POOL_KEY_HASH);
        Precondition.check(cert.poolKeyHashHex.length == KEY_HASH_LENGTH * 2, TxErrors.CERTIFICATE_INVALID_POOL_KEY_HASH);
        Precondition.check(!cert.poolRegistrationParams, TxErrors.CERTIFICATE_SUPERFLUOUS_POOL_REGISTRATION_PARAMS);
        Precondition.check(!cert.poolRetirementParams, TxErrors.CERTIFICATE_SUPERFLUOUS_POOL_RETIREMENT_PARAMS);
        break;
      }
      case CertificateTypes.STAKE_POOL_RETIREMENT: {
        Precondition.check(usecase === SignTxUsecases.SIGN_TX_USECASE_ORDINARY_TX, TxErrors.CERTIFICATES_COMBINATION_FORBIDDEN);
        Precondition.check(!cert.path, TxErrors.CERTIFICATE_SUPERFLUOUS_PATH);
        Precondition.check(!cert.poolKeyHashHex, TxErrors.CERTIFICATE_SUPERFLUOUS_POOL_KEY_HASH);
        Precondition.check(!cert.poolRegistrationParams, TxErrors.CERTIFICATE_SUPERFLUOUS_POOL_REGISTRATION_PARAMS);

        Precondition.check(cert.poolRetirementParams, TxErrors.CERTIFICATE_MISSING_POOL_RETIREMENT_PARAMS);
        Precondition.checkIsValidPath(cert.poolRetirementParams.poolKeyPath, TxErrors.CERTIFICATE_INVALID_POOL_RETIREMENT_PARAMS);
        Precondition.checkIsUint64Str(cert.poolRetirementParams.retirementEpochStr, TxErrors.CERTIFICATE_INVALID_POOL_RETIREMENT_PARAMS);
        break;
      }
      case CertificateTypes.STAKE_POOL_REGISTRATION: {
        Precondition.check(usecase !== SignTxUsecases.SIGN_TX_USECASE_ORDINARY_TX, TxErrors.CERTIFICATES_COMBINATION_FORBIDDEN);
        Precondition.check(!cert.path, TxErrors.CERTIFICATE_SUPERFLUOUS_PATH);
        Precondition.check(!cert.poolKeyHashHex, TxErrors.CERTIFICATE_SUPERFLUOUS_POOL_KEY_HASH);
        const poolParams = cert.poolRegistrationParams;
        Precondition.check(!!poolParams, TxErrors.CERTIFICATE_POOL_MISSING_POOL_PARAMS);

        // serialization succeeds if and only if the params are valid
        serializePoolParamsInit(poolParams);
        serializePoolParamsPoolKey(poolParams);
        serializePoolParamsVrfKey(poolParams);
        serializePoolParamsFinancials(poolParams);
        serializePoolParamsRewardAccount(poolParams);

        // owners
        Precondition.checkIsArray(poolParams.poolOwners, TxErrors.CERTIFICATE_POOL_OWNERS_NOT_ARRAY);
        let numPathOwners = 0;
        for (const owner of poolParams.poolOwners) {
          if (owner.stakingPath) {
            numPathOwners++;
            serializePoolParamsOwner(owner);
          }
        }
        switch (usecase) {
          case SignTxUsecases.SIGN_TX_USECASE_POOL_REGISTRATION_OWNER:
            Precondition.check(numPathOwners === 1, TxErrors.CERTIFICATE_POOL_OWNERS_SINGLE_PATH_OWNER);
            break;

          case SignTxUsecases.SIGN_TX_USECASE_POOL_REGISTRATION_OPERATOR:
            Precondition.check(numPathOwners === 0, TxErrors.CERTIFICATE_POOL_OWNERS_SINGLE_PATH_OPERATOR);
            break;
        }

        // relays
        Precondition.checkIsArray(poolParams.relays, TxErrors.CERTIFICATE_POOL_RELAYS_NOT_ARRAY);
        for (const relay of poolParams.relays) {
          serializePoolParamsRelay(relay);
        }

        // metadata
        serializePoolParamsMetadata(poolParams.metadata);

        break;
      }
      default:
        throw new Error(TxErrors.CERTIFICATE_INVALID);
    }
  }
}

export function validateTransaction(
  networkId: number,
  protocolMagic: number,
  inputs: Array<InputTypeUTxO>,
  outputs: Array<TxOutput>,
  feeStr: string,
  ttlStr: ?string,
  certificates: Array<Certificate>,
  withdrawals: Array<Withdrawal>,
  metadataHashHex: ?string,
  validityIntervalStartStr: ?string
) {
  Precondition.checkIsArray(certificates, TxErrors.CERTIFICATES_NOT_ARRAY);
  const usecase = determineUsecase(certificates);

  // inputs
  Precondition.checkIsArray(inputs, TxErrors.INPUTS_NOT_ARRAY);
  for (const input of inputs) {
    Precondition.checkIsHexString(input.txHashHex, TxErrors.INPUT_INVALID_TX_HASH);
    Precondition.check(input.txHashHex.length === TX_HASH_LENGTH * 2, TxErrors.INPUT_INVALID_TX_HASH);

    switch (usecase) {
      case SignTxUsecases.SIGN_TX_USECASE_POOL_REGISTRATION_OWNER:
        // input should not be given with a path
        // the path is not used, but we check just to avoid potential confusion of developers using this
        Precondition.check(!input.path, TxErrors.INPUT_WITH_PATH);
        break;
    }
  }

  // outputs
  Precondition.checkIsArray(outputs, TxErrors.OUTPUTS_NOT_ARRAY);
  for (const output of outputs) {
    // we try to serialize the data, an error is thrown if ada amount or address params are invalid
    serializeOutputBasicParams(output, protocolMagic, networkId);

    if (output.spendingPath) {
      // TODO perhaps use a switch?
      Precondition.check(usecase !== SignTxUsecases.SIGN_TX_USECASE_POOL_REGISTRATION_OWNER, TxErrors.OUTPUT_WITH_PATH);
    }

    if (output.tokenBundle) {
      Precondition.checkIsArray(output.tokenBundle, TxErrors.OUTPUT_INVALID_TOKEN_BUNDLE);
      Precondition.check(output.tokenBundle.length <= ASSET_GROUPS_MAX);

      for (const assetGroup of output.tokenBundle) {
        Precondition.checkIsHexString(assetGroup.policyIdHex, TxErrors.OUTPUT_INVALID_TOKEN_POLICY);
        Precondition.check(assetGroup.policyIdHex.length === TOKEN_POLICY_LENGTH * 2, TxErrors.OUTPUT_INVALID_TOKEN_POLICY);

        Precondition.checkIsArray(assetGroup.tokens);
        Precondition.check(assetGroup.tokens.length <= TOKENS_IN_GROUP_MAX);

        for (const token of assetGroup.tokens) {
          Precondition.checkIsHexString(token.assetNameHex, TxErrors.OUTPUT_INVALID_ASSET_NAME);
          Precondition.check(token.assetNameHex.length <= TOKEN_NAME_LENGTH * 2, TxErrors.OUTPUT_INVALID_ASSET_NAME);
          Precondition.checkIsUint64Str(token.amountStr);
        }
      }
    }
  }

  // fee
  Precondition.checkIsValidAdaAmount(feeStr, TxErrors.FEE_INVALID);

  //  ttl
  if (ttlStr != null) {
    Precondition.checkIsPositiveUint64Str(ttlStr, TxErrors.TTL_INVALID);
  }

  // certificates
  validateCertificates(certificates, usecase);

  // withdrawals
  Precondition.checkIsArray(withdrawals, TxErrors.WITHDRAWALS_NOT_ARRAY);
  switch (usecase) {
    case SignTxUsecases.SIGN_TX_USECASE_POOL_REGISTRATION_OPERATOR:
    case SignTxUsecases.SIGN_TX_USECASE_POOL_REGISTRATION_OWNER:
      Precondition.check(withdrawals.length === 0, TxErrors.WITHDRAWALS_FORBIDDEN);
      break;
  }
  for (const withdrawal of withdrawals) {
    Precondition.checkIsValidAdaAmount(withdrawal.amountStr);
    Precondition.checkIsValidPath(withdrawal.path);
  }

  // metadata could be null
  if (metadataHashHex != null) {
    Precondition.checkIsHexString(metadataHashHex, TxErrors.METADATA_INVALID);
    Precondition.check(metadataHashHex.length == 32 * 2, TxErrors.METADATA_INVALID);
  }

  //  validity interval start
  if (validityIntervalStartStr != null) {
    Precondition.checkIsPositiveUint64Str(validityIntervalStartStr, TxErrors.VALIDITY_INTERVAL_START_INVALID);
  }

  // additional validation, dependent on usecase,
  // is included in the witness calculation logic
  collectWitnessPaths(inputs, certificates, withdrawals);
}

export function collectWitnessPaths(
  inputs: Array<InputTypeUTxO>,
  certificates: Array<Certificate>,
  withdrawals: Array<Withdrawal>
): Array<BIP32Path> {
  const usecase = determineUsecase(certificates);

  let numPoolRegistrationCerts = 0;
  const ordinaryWitnesses = [];
  const poolOwnerWitnesses = [];
  const poolOperatorWitnesses = [];

  for (const {path} of [...inputs, ...withdrawals]) {
    if (path)
      ordinaryWitnesses.push(path);
  }

  for (const cert of certificates) {
    switch (cert.type) {

      case CertificateTypes.STAKE_REGISTRATION:
      case CertificateTypes.STAKE_DEREGISTRATION:
      case CertificateTypes.STAKE_DELEGATION:
        ordinaryWitnesses.push(cert.path);
        break;

      case CertificateTypes.STAKE_POOL_RETIREMENT:
        ordinaryWitnesses.push(cert.poolRetirementParams.poolKeyPath);
        break;

      case CertificateTypes.STAKE_POOL_REGISTRATION:
        numPoolRegistrationCerts++;

        const poolKeyPath = cert.poolRegistrationParams.poolKey.path;
        if (poolKeyPath)
          poolOperatorWitnesses.push(poolKeyPath);

        for (const owner of cert.poolRegistrationParams.poolOwners) {
          if (owner.stakingPath)
            poolOwnerWitnesses.push(owner.stakingPath)
        }
        break;

      default:
        throw new Error(TxErrors.CERTIFICATE_INVALID);
    }
  }

  switch (usecase) {
    case SignTxUsecases.SIGN_TX_USECASE_ORDINARY_TX:
      Assert.assert(numPoolRegistrationCerts === 0);
      Assert.assert(ordinaryWitnesses.length <= inputs.length + withdrawals.length + certificates.length);
      Assert.assert(poolOwnerWitnesses.length === 0);
      Assert.assert(poolOperatorWitnesses.length === 0);
      break;

    case SignTxUsecases.SIGN_TX_USECASE_POOL_REGISTRATION_OWNER:
      Precondition.check(numPoolRegistrationCerts === 1, TxErrors.CERTIFICATES_MULTIPLE_POOL_REGISTRATIONS);
      Precondition.check(ordinaryWitnesses.length === 0); // inputs should be given without witnesses
      Assert.assert(poolOwnerWitnesses.length === 1);
      Assert.assert(poolOperatorWitnesses.length === 0);
      break;

    case SignTxUsecases.SIGN_TX_USECASE_POOL_REGISTRATION_OPERATOR:
      Precondition.check(numPoolRegistrationCerts === 1, TxErrors.CERTIFICATES_MULTIPLE_POOL_REGISTRATIONS);
      Assert.assert(ordinaryWitnesses.length <= inputs.length);
      Assert.assert(poolOwnerWitnesses.length === 0);
      Assert.assert(poolOperatorWitnesses.length === 1);
      break;
  }

  // each path is included only once
  const witnessPaths = [];
  const witnessPathsSet = new Set();
  for (const path of [...ordinaryWitnesses, ...poolOwnerWitnesses, ...poolOperatorWitnesses]) {
    const pathKey = JSON.stringify(path);
    if (!witnessPathsSet.has(pathKey)) {
      witnessPathsSet.add(pathKey);
      witnessPaths.push(path);
    }
  }

  return witnessPaths;
}

export function validateOperationalCertificate(
  kesPublicKeyHex: string,
  kesPeriodStr: string,
  issueCounterStr: string,
  coldKeyPath: BIP32Path
) {
  Precondition.checkIsHexString(kesPublicKeyHex, OpCertErrors.INVALID_KES_KEY);
  Precondition.check(kesPublicKeyHex.length === KES_PUBLIC_KEY_LENGTH * 2, OpCertErrors.INVALID_KES_KEY);

  Precondition.checkIsPositiveUint64Str(kesPeriodStr, OpCertErrors.INVALID_KES_PERIOD);

  Precondition.checkIsPositiveUint64Str(issueCounterStr, OpCertErrors.INVALID_ISSUE_COUNTER);

  Precondition.checkIsValidPath(coldKeyPath, OpCertErrors.INVALID_COLD_KEY_PATH);
}

export function serializeAddressParams(
    addressTypeNibble: $Values<typeof AddressTypeNibbles>,
    networkIdOrProtocolMagic: number,
    spendingPath: BIP32Path,
    stakingPath: ?BIP32Path = null,
    stakingKeyHashHex: ?string = null,
    stakingBlockchainPointer: ?StakingBlockchainPointer = null
): Buffer {
  Precondition.checkIsUint8(addressTypeNibble << 4, TxErrors.OUTPUT_INVALID_ADDRESS_TYPE_NIBBLE);
  const addressTypeNibbleBuf = utils.uint8_to_buf(addressTypeNibble);

  let networkIdOrProtocolMagicBuf;

  if (addressTypeNibble === AddressTypeNibbles.BYRON) {
    Precondition.checkIsUint32(networkIdOrProtocolMagic, TxErrors.INVALID_PROTOCOL_MAGIC);
    networkIdOrProtocolMagicBuf = utils.uint32_to_buf(networkIdOrProtocolMagic);
  } else {
    Precondition.checkIsUint8(networkIdOrProtocolMagic, TxErrors.INVALID_NETWORK_ID);
    networkIdOrProtocolMagicBuf = utils.uint8_to_buf(networkIdOrProtocolMagic);
  }

  Precondition.checkIsValidPath(spendingPath, TxErrors.OUTPUT_INVALID_SPENDING_PATH);
  const spendingPathBuf = utils.path_to_buf(spendingPath);

  const stakingChoices = {
    NO_STAKING: 0x11,
    STAKING_KEY_PATH: 0x22,
    STAKING_KEY_HASH: 0x33,
    BLOCKCHAIN_POINTER: 0x44
  };
  type StakingChoice = $Values<typeof stakingChoices>;

  // serialize staking info
  let stakingChoice: StakingChoice;
  let stakingInfoBuf: Buffer;
  if (!stakingPath && !stakingKeyHashHex && !stakingBlockchainPointer) {
    stakingChoice = stakingChoices.NO_STAKING;
    stakingInfoBuf = Buffer.alloc(0);
  } else if ( stakingPath && !stakingKeyHashHex && !stakingBlockchainPointer) {
    stakingChoice = stakingChoices.STAKING_KEY_PATH;
    Precondition.checkIsValidPath(stakingPath, TxErrors.OUTPUT_INVALID_STAKING_KEY_PATH);
    stakingInfoBuf = utils.path_to_buf(stakingPath);
  } else if (!stakingPath &&  stakingKeyHashHex && !stakingBlockchainPointer) {
    const stakingKeyHash = utils.hex_to_buf(stakingKeyHashHex);
    stakingChoice = stakingChoices.STAKING_KEY_HASH;
    Precondition.check(stakingKeyHash.length === KEY_HASH_LENGTH, TxErrors.OUTPUT_INVALID_STAKING_KEY_HASH);
    stakingInfoBuf = stakingKeyHash;
  } else if (!stakingPath && !stakingKeyHashHex &&  stakingBlockchainPointer) {
    stakingChoice = stakingChoices.BLOCKCHAIN_POINTER;
    stakingInfoBuf = Buffer.alloc(3 * 4); // 3 x uint32

    Precondition.checkIsUint32(stakingBlockchainPointer.blockIndex, TxErrors.OUTPUT_INVALID_BLOCKCHAIN_POINTER);
    stakingInfoBuf.writeUInt32BE(stakingBlockchainPointer.blockIndex, 0);
    Precondition.checkIsUint32(stakingBlockchainPointer.txIndex, TxErrors.OUTPUT_INVALID_BLOCKCHAIN_POINTER);
    stakingInfoBuf.writeUInt32BE(stakingBlockchainPointer.txIndex, 4);
    Precondition.checkIsUint32(stakingBlockchainPointer.certificateIndex, TxErrors.OUTPUT_INVALID_BLOCKCHAIN_POINTER);
    stakingInfoBuf.writeUInt32BE(stakingBlockchainPointer.certificateIndex, 8);
  } else {
    throw new Error(TxErrors.OUTPUT_INVALID_STAKING_INFO);
  }
  const stakingChoiceBuf = Buffer.from([stakingChoice]);

  return Buffer.concat([
    addressTypeNibbleBuf,
    networkIdOrProtocolMagicBuf,
    spendingPathBuf,
    stakingChoiceBuf,
    stakingInfoBuf
  ]);
}

export function serializeOutputBasicParams(
  output: TxOutput,
  protocolMagic: number,
  networkId: number
): Buffer {
  Precondition.checkIsValidAdaAmount(output.amountStr);

  let outputType;
  let addressBuf;

  if (output.addressHex) {
    outputType = TxOutputTypeCodes.SIGN_TX_OUTPUT_TYPE_ADDRESS_BYTES;

    Precondition.checkIsHexString(output.addressHex, TxErrors.OUTPUT_INVALID_ADDRESS);
    Precondition.check(output.addressHex.length <= 128 * 2, TxErrors.OUTPUT_INVALID_ADDRESS);
    addressBuf = Buffer.concat([
      utils.uint32_to_buf(output.addressHex.length / 2),
      utils.hex_to_buf(output.addressHex)
    ]);

  } else if (output.spendingPath) {
    outputType = TxOutputTypeCodes.SIGN_TX_OUTPUT_TYPE_ADDRESS_PARAMS;

    addressBuf = serializeAddressParams(
      output.addressTypeNibble,
      output.addressTypeNibble === AddressTypeNibbles.BYRON ? protocolMagic : networkId,
      output.spendingPath,
      output.stakingPath,
      output.stakingKeyHashHex,
      output.stakingBlockchainPointer
    );

  } else {
    throw new Error(TxErrors.OUTPUT_UNKNOWN_TYPE);
  }

  const numAssetGroups =
      (output.tokenBundle) ?
      output.tokenBundle.length :
      0;

  return Buffer.concat([
    utils.uint8_to_buf(outputType),
    addressBuf,
    utils.ada_amount_to_buf(output.amountStr),
    utils.uint32_to_buf(numAssetGroups)
  ]);
}

// TODO remove after ledger app 2.2 is widespread
export function serializeOutputBasicParamsBefore_2_2(
  output: TxOutput,
  protocolMagic: number,
  networkId: number
): Buffer {
  Precondition.checkIsValidAdaAmount(output.amountStr);

  if (output.addressHex) {
    Precondition.checkIsHexString(output.addressHex, TxErrors.OUTPUT_INVALID_ADDRESS);
    Precondition.check(output.addressHex.length <= 128 * 2, TxErrors.OUTPUT_INVALID_ADDRESS);

    return Buffer.concat([	
      utils.ada_amount_to_buf(output.amountStr),	
      utils.uint8_to_buf(TxOutputTypeCodes.SIGN_TX_OUTPUT_TYPE_ADDRESS_BYTES),
      utils.hex_to_buf(output.addressHex)	
    ]);	

  } else if (output.spendingPath) {
    return Buffer.concat([
      utils.ada_amount_to_buf(output.amountStr),
      utils.uint8_to_buf(TxOutputTypeCodes.SIGN_TX_OUTPUT_TYPE_ADDRESS_PARAMS),	
      serializeAddressParams(	
        output.addressTypeNibble,	
        output.addressTypeNibble === AddressTypeNibbles.BYRON ? protocolMagic : networkId,	
        output.spendingPath,	
        output.stakingPath,	
        output.stakingKeyHashHex,	
        output.stakingBlockchainPointer	
      )
    ]);
  } else {
    throw new Error(TxErrors.OUTPUT_UNKNOWN_TYPE);
  }
}

export function serializePoolParamsInit(
  params: PoolRegistrationParams
): Buffer {
  Precondition.check(params.poolOwners.length <= POOL_REGISTRATION_OWNERS_MAX, TxErrors.CERTIFICATE_POOL_OWNERS_TOO_MANY);
  Precondition.check(params.relays.length <= POOL_REGISTRATION_RELAYS_MAX, TxErrors.CERTIFICATE_POOL_RELAYS_TOO_MANY);

  return Buffer.concat([
    utils.uint32_to_buf(params.poolOwners.length),
    utils.uint32_to_buf(params.relays.length)
  ]);
}

export function serializePoolParamsPoolKey(
  params: PoolRegistrationParams
): Buffer {
  const poolKey = params.poolKey;
  Precondition.check(!!poolKey, TxErrors.CERTIFICATE_POOL_INVALID_POOL_KEY);

  if (poolKey.path) {
    Precondition.check(!poolKey.keyHashHex); // only one of the two should be given
    Precondition.checkIsValidPath(poolKey.path);
    return Buffer.concat([
      utils.uint8_to_buf(KeyReferenceType.KEY_REFERENCE_PATH),
      utils.path_to_buf(poolKey.path)
    ]);
  } else if (poolKey.keyHashHex) {
    Precondition.checkIsHexString(poolKey.keyHashHex, TxErrors.CERTIFICATE_POOL_INVALID_POOL_KEY);
    Precondition.check(poolKey.keyHashHex.length === KEY_HASH_LENGTH * 2, TxErrors.CERTIFICATE_POOL_INVALID_POOL_KEY);
    return Buffer.concat([
      utils.uint8_to_buf(KeyReferenceType.KEY_REFERENCE_HASH),
      utils.hex_to_buf(poolKey.keyHashHex)
    ]);
  } else {
    throw new Error(TxErrors.CERTIFICATE_POOL_INVALID_POOL_KEY);
  }
}

export function serializePoolParamsVrfKey(
  params: PoolRegistrationParams
): Buffer {
  Precondition.checkIsHexString(params.vrfKeyHashHex, TxErrors.CERTIFICATE_POOL_INVALID_VRF_KEY_HASH);
  Precondition.check(params.vrfKeyHashHex.length === 32 * 2, TxErrors.CERTIFICATE_POOL_INVALID_VRF_KEY_HASH);

  return utils.hex_to_buf(params.vrfKeyHashHex);
}

export function serializePoolParamsFinancials(
  params: PoolRegistrationParams
): Buffer {
  Precondition.checkIsValidAdaAmount(params.pledgeStr, TxErrors.CERTIFICATE_POOL_INVALID_PLEDGE);
  Precondition.checkIsValidAdaAmount(params.costStr, TxErrors.CERTIFICATE_POOL_INVALID_COST);

  const marginNumeratorStr = params.margin.numeratorStr;
  const marginDenominatorStr = params.margin.denominatorStr;
  Precondition.checkIsUint64Str(marginNumeratorStr, TxErrors.CERTIFICATE_POOL_INVALID_MARGIN);
  Precondition.checkIsValidPoolMarginDenominator(marginDenominatorStr, TxErrors.CERTIFICATE_POOL_INVALID_MARGIN_DENOMINATOR);
  // given both are valid uint strings, the check below is equivalent to "marginNumerator <= marginDenominator"
  Precondition.checkIsValidUintStr(marginNumeratorStr, marginDenominatorStr, TxErrors.CERTIFICATE_POOL_INVALID_MARGIN);

  return Buffer.concat([
    utils.ada_amount_to_buf(params.pledgeStr),
    utils.ada_amount_to_buf(params.costStr),
    utils.uint64_to_buf(params.margin.numeratorStr),
    utils.uint64_to_buf(params.margin.denominatorStr),
  ]);
}

export function serializePoolParamsRewardAccount(
  params: PoolRegistrationParams
): Buffer {
  if (params.rewardAccount.path) {
    Precondition.checkIsValidPath(params.rewardAccount.path);

    return Buffer.concat([
      utils.uint8_to_buf(KeyReferenceType.KEY_REFERENCE_PATH),
      utils.path_to_buf(params.rewardAccount.path)
    ]);
  } else {
    Precondition.checkIsHexString(params.rewardAccount.rewardAccountHex, TxErrors.CERTIFICATE_POOL_INVALID_REWARD_ACCOUNT);
    Precondition.check(params.rewardAccount.rewardAccountHex.length === 29 * 2, TxErrors.CERTIFICATE_POOL_INVALID_REWARD_ACCOUNT);

    return Buffer.concat([
      utils.uint8_to_buf(KeyReferenceType.KEY_REFERENCE_HASH),
      utils.hex_to_buf(params.rewardAccount.rewardAccountHex)
    ]);
  }
}

export function serializePoolParamsOwner(
  params: PoolOwnerParams
): Buffer {
  const path = params.stakingPath;
  const hashHex = params.stakingKeyHashHex;

  if (path) {
    Precondition.checkIsValidPath(path, TxErrors.CERTIFICATE_POOL_OWNER_INVALID_PATH);

    return Buffer.concat([
      utils.uint8_to_buf(KeyReferenceType.KEY_REFERENCE_PATH),
      utils.path_to_buf(path)
    ]);
  }

  if (hashHex) {
    Precondition.checkIsHexString(hashHex, TxErrors.CERTIFICATE_POOL_OWNER_INVALID_KEY_HASH);
    Precondition.check(hashHex.length === KEY_HASH_LENGTH * 2, TxErrors.CERTIFICATE_POOL_OWNER_INVALID_KEY_HASH);

    return Buffer.concat([
      utils.uint8_to_buf(KeyReferenceType.KEY_REFERENCE_HASH),
      utils.hex_to_buf(hashHex)
    ]);
  }

  throw new Error(TxErrors.CERTIFICATE_POOL_OWNER_INCOMPLETE);
}

export function serializePoolParamsRelay(
  relayParams: RelayParams
): Buffer {
  const type = relayParams.type;
  const params = relayParams.params;

  const RELAY_NO = 1;
  const RELAY_YES = 2;

  const noBuf = utils.uint8_to_buf(RELAY_NO);
  const yesBuf = utils.uint8_to_buf(RELAY_YES);

  let portBuf: Buffer;
  if (params.portNumber) {
    Precondition.checkIsUint32(params.portNumber, TxErrors.CERTIFICATE_POOL_RELAY_INVALID_PORT);
    Precondition.check(params.portNumber <= 65535, TxErrors.CERTIFICATE_POOL_RELAY_INVALID_PORT);
    portBuf = Buffer.concat([yesBuf, utils.uint16_to_buf(params.portNumber)]);
  } else {
    portBuf = noBuf;
  }

  let ipv4Buf: Buffer;
  if (params.ipv4) {
    Precondition.checkIsString(params.ipv4, TxErrors.CERTIFICATE_POOL_RELAY_INVALID_IPV4);
    let ipParts = params.ipv4.split('.');
    Precondition.check(ipParts.length === 4, TxErrors.CERTIFICATE_POOL_RELAY_INVALID_IPV4);
    let ipBytes = Buffer.alloc(4);
    for (let i = 0; i < 4; i++) {
      let ipPart = utils.safe_parseInt(ipParts[i]);
      Precondition.checkIsUint8(ipPart, TxErrors.CERTIFICATE_POOL_RELAY_INVALID_IPV4);
      ipBytes.writeUInt8(ipPart, i);
    }
    ipv4Buf = Buffer.concat([yesBuf, ipBytes]);
  } else {
    ipv4Buf = noBuf;
  }

  let ipv6Buf: Buffer;
  if (params.ipv6) {
    Precondition.checkIsString(params.ipv6, TxErrors.CERTIFICATE_POOL_RELAY_INVALID_IPV6);
    let ipHex = params.ipv6.split(':').join('');
    Precondition.checkIsHexString(ipHex, TxErrors.CERTIFICATE_POOL_RELAY_INVALID_IPV6);
    Precondition.check(ipHex.length === 16 * 2, TxErrors.CERTIFICATE_POOL_RELAY_INVALID_IPV6);
    ipv6Buf = Buffer.concat([yesBuf, hex_to_buf(ipHex)]);
  } else {
    ipv6Buf = noBuf;
  }

  let dnsBuf: Buffer;
  if (params.dnsName) {
    Precondition.checkIsString(params.dnsName);
    Precondition.check(params.dnsName.length <= 64, TxErrors.CERTIFICATE_POOL_RELAY_INVALID_DNS);
    Precondition.check(/^[\x00-\x7F]*$/.test(params.dnsName), TxErrors.CERTIFICATE_POOL_RELAY_INVALID_DNS);
    Precondition.check(
      params.dnsName.split('').every(c => (c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126)),
      TxErrors.CERTIFICATE_POOL_RELAY_INVALID_DNS
    );
    dnsBuf = Buffer.from(params.dnsName, "ascii");
  }

  Precondition.checkIsUint8(type);

  let typeBuf = Buffer.alloc(1);
  typeBuf.writeUInt8(type, 0);

  switch(type) {
    case 0:
      return Buffer.concat([typeBuf, portBuf, ipv4Buf, ipv6Buf]);

    case 1:
      Precondition.check(dnsBuf != null, TxErrors.CERTIFICATE_POOL_RELAY_MISSING_DNS);
      return Buffer.concat([typeBuf, portBuf, dnsBuf]);

    case 2:
      Precondition.check(dnsBuf != null, TxErrors.CERTIFICATE_POOL_RELAY_MISSING_DNS);
      return Buffer.concat([typeBuf, dnsBuf]);
  }
  throw new Error(TxErrors.CERTIFICATE_POOL_RELAY_INVALID_TYPE);
}

export function serializePoolParamsMetadata(
  params: PoolMetadataParams
): Buffer {

  const includeMetadataBuffer = Buffer.alloc(1);
  if (params != null) {
    includeMetadataBuffer.writeUInt8(SignTxIncluded.SIGN_TX_INCLUDED_YES, 0);
  } else {
    includeMetadataBuffer.writeUInt8(SignTxIncluded.SIGN_TX_INCLUDED_NO, 0);
    return includeMetadataBuffer;
  }

  const url = params.metadataUrl;
  Precondition.checkIsString(url, TxErrors.CERTIFICATE_POOL_METADATA_INVALID_URL);
  Precondition.check(url.length <= 64, TxErrors.CERTIFICATE_POOL_METADATA_INVALID_URL);
  Precondition.check(
    url.split('').every(c => (c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126)),
    TxErrors.CERTIFICATE_POOL_METADATA_INVALID_URL
  );

  const hashHex = params.metadataHashHex;
  Precondition.checkIsHexString(hashHex, TxErrors.CERTIFICATE_POOL_METADATA_INVALID_HASH);
  Precondition.check(hashHex.length === 32 * 2, TxErrors.CERTIFICATE_POOL_METADATA_INVALID_HASH);

  return Buffer.concat([
    includeMetadataBuffer,
    utils.hex_to_buf(hashHex),
    Buffer.from(url)
  ]);
}

export function serializePoolInitialParams_before_2_3(
  params: PoolRegistrationParams
): Buffer {
  Precondition.checkIsHexString(params.poolKey.keyHashHex, TxErrors.CERTIFICATE_POOL_POOL_KEY_FORMAT_NOT_SUPPORTED);
  // $FlowFixMe
  Precondition.check(params.poolKey.keyHashHex.length === KEY_HASH_LENGTH * 2, TxErrors.CERTIFICATE_POOL_INVALID_POOL_KEY);

  Precondition.checkIsHexString(params.vrfKeyHashHex, TxErrors.CERTIFICATE_POOL_INVALID_VRF_KEY_HASH);
  Precondition.check(params.vrfKeyHashHex.length === 32 * 2, TxErrors.CERTIFICATE_POOL_INVALID_VRF_KEY_HASH);

  Precondition.checkIsValidAdaAmount(params.pledgeStr, TxErrors.CERTIFICATE_POOL_INVALID_PLEDGE);
  Precondition.checkIsValidAdaAmount(params.costStr, TxErrors.CERTIFICATE_POOL_INVALID_COST);

  const marginNumeratorStr = params.margin.numeratorStr;
  const marginDenominatorStr = params.margin.denominatorStr;
  Precondition.checkIsUint64Str(marginNumeratorStr, TxErrors.CERTIFICATE_POOL_INVALID_MARGIN);
  Precondition.checkIsValidPoolMarginDenominator(marginDenominatorStr, TxErrors.CERTIFICATE_POOL_INVALID_MARGIN_DENOMINATOR);
  // given both are valid uint strings, the check below is equivalent to "marginNumerator <= marginDenominator"
  Precondition.checkIsValidUintStr(marginNumeratorStr, marginDenominatorStr, TxErrors.CERTIFICATE_POOL_INVALID_MARGIN);

  Precondition.checkIsHexString(params.rewardAccount.rewardAccountHex, TxErrors.CERTIFICATE_POOL_REWARD_ACCOUNT_FORMAT_NOT_SUPPORTED);
  // $FlowFixMe
  Precondition.check(params.rewardAccount.rewardAccountHex.length === 29 * 2, TxErrors.CERTIFICATE_POOL_INVALID_REWARD_ACCOUNT);

  Precondition.check(params.poolOwners.length <= POOL_REGISTRATION_OWNERS_MAX, TxErrors.CERTIFICATE_POOL_OWNERS_TOO_MANY);
  Precondition.check(params.relays.length <= POOL_REGISTRATION_RELAYS_MAX, TxErrors.CERTIFICATE_POOL_RELAYS_TOO_MANY);

  return Buffer.concat([
    // $FlowFixMe
    utils.hex_to_buf(params.poolKey.keyHashHex),
    utils.hex_to_buf(params.vrfKeyHashHex),
    utils.ada_amount_to_buf(params.pledgeStr),
    utils.ada_amount_to_buf(params.costStr),
    utils.uint64_to_buf(params.margin.numeratorStr),
    utils.uint64_to_buf(params.margin.denominatorStr),
    // $FlowFixMe
    utils.hex_to_buf(params.rewardAccount.rewardAccountHex),
    utils.uint32_to_buf(params.poolOwners.length),
    utils.uint32_to_buf(params.relays.length)
  ]);
}

export function serializeGetExtendedPublicKeyParams(
  path: BIP32Path
): Buffer {
  Precondition.check(!!path, GetKeyErrors.INVALID_PATH);

  return utils.path_to_buf(path);
}



export default {
  HARDENED,
  AddressTypeNibbles,
  CertificateTypes,
  KEY_HASH_LENGTH,
  TX_HASH_LENGTH,
  ED25519_SIGNATURE_LENGTH,
  ED25519_EXTENDED_PUBLIC_KEY_LENGTH,

  serializeGetExtendedPublicKeyParams,

  determineUsecase,
  collectWitnessPaths,
  validateTransaction,

  validateOperationalCertificate,

  serializeAddressParams,
  serializeOutputBasicParams,
  serializeOutputBasicParamsBefore_2_2,

  serializePoolParamsInit,
  serializePoolParamsPoolKey,
  serializePoolParamsVrfKey,
  serializePoolParamsFinancials,
  serializePoolParamsRewardAccount,
  serializePoolParamsOwner,
  serializePoolParamsRelay,
  serializePoolParamsMetadata,
  serializePoolInitialParams_before_2_3,
};

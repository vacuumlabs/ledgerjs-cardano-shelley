import type {ErrorBase, Transaction} from '../../../src/Ada'
import {
  CertificateType,
  DeviceStatusCodes,
  DeviceStatusError,
  DeviceStatusMessages,
  InvalidDataReason,
  Networks,
  AddressType,
  TxOutputDestinationType,
  TxRequiredSignerType,
} from '../../../src/Ada'
import type {
  BIP32Path,
  Network,
  PoolRegistrationParams,
  PoolRetirementParams,
  StakeDelegationParams,
  StakeDeregistrationParams,
  StakeRegistrationParams,
} from '../../../src/types/public'
import {
  PoolKeyType,
  PoolOwnerType,
  PoolRewardAccountType,
  StakeCredentialParamsType,
  TransactionSigningMode,
} from '../../../src/types/public'
import {str_to_path} from '../../../src/utils/address'
import {bech32_to_hex} from '../../test_utils'
import {
  destinations,
  inputs,
  mainnetFeeTtl,
  mints,
  outputs,
  shelleyBase,
} from './txElements'

export type TestCaseRejectShelley = {
  testName: string
  tx: Transaction
  signingMode: TransactionSigningMode
  additionalWitnessPaths?: BIP32Path[]
  errCls: new (...args: any[]) => ErrorBase
  errMsg: string
  rejectReason: InvalidDataReason
  unsupportedInAppXS?: boolean
}

const poolRegParamOwner: PoolRegistrationParams = {
  poolKey: {
    type: PoolKeyType.THIRD_PARTY,
    params: {
      keyHashHex: '01234567890123456789012345678901234567890123456789012345',
    },
  },
  vrfKeyHashHex:
    '0123456789012345678901234567890123456789012345678901234567890123',
  pledge: 0,
  cost: 0,
  margin: {
    numerator: 0,
    denominator: 1,
  },
  rewardAccount: {
    type: PoolRewardAccountType.THIRD_PARTY,
    params: {
      rewardAccountHex:
        'f123456789012345678901234567890123456789012345678901234567',
    },
  },
  poolOwners: [
    {
      type: PoolOwnerType.DEVICE_OWNED,
      params: {
        stakingPath: str_to_path("1852'/1815'/0'/2/0"),
      },
    },
  ],
  relays: [],
}

const poolRegParamOperator: PoolRegistrationParams = {
  poolKey: {
    type: PoolKeyType.DEVICE_OWNED,
    params: {
      path: str_to_path("1852'/1815'/0'/0/0"),
    },
  },
  vrfKeyHashHex:
    '0123456789012345678901234567890123456789012345678901234567890123',
  pledge: 0,
  cost: 0,
  margin: {
    numerator: 0,
    denominator: 1,
  },
  rewardAccount: {
    type: PoolRewardAccountType.THIRD_PARTY,
    params: {
      rewardAccountHex:
        'f123456789012345678901234567890123456789012345678901234567',
    },
  },
  poolOwners: [],
  relays: [],
}

const poolRetirementParam: PoolRetirementParams = {
  poolKeyPath: str_to_path("1853'/1815'/0'/1'"),
  retirementEpoch: 42,
}

const stakeRegistrationPathParam: StakeRegistrationParams = {
  stakeCredential: {
    type: StakeCredentialParamsType.KEY_PATH,
    keyPath: str_to_path("1852'/1815'/0'/2/0"),
  },
}

const stakeRegistrationScriptHashParam: StakeRegistrationParams = {
  stakeCredential: {
    type: StakeCredentialParamsType.SCRIPT_HASH,
    scriptHashHex: '29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd',
  },
}

const stakeDeregistrationParam: StakeDeregistrationParams = {
  stakeCredential: {
    type: StakeCredentialParamsType.KEY_PATH,
    keyPath: str_to_path("1852'/1815'/0'/2/0"),
  },
}

const stakeDelegationParam: StakeDelegationParams = {
  stakeCredential: {
    type: StakeCredentialParamsType.KEY_PATH,
    keyPath: str_to_path("1852'/1815'/0'/2/0"),
  },
  poolKeyHashHex: '',
}

export const transactionInitRejectTestCases: TestCaseRejectShelley[] = [
  {
    testName: 'Non-mainnet protocol magic',
    tx: {
      ...shelleyBase,
      network: {
        networkId: 0x01,
        protocolMagic: 764824072,
      } as Network,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Invalid network id',
    tx: {
      ...shelleyBase,
      network: {
        networkId: 0x10,
        protocolMagic: 764824073,
      } as Network,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_INVALID_DATA],
    rejectReason: InvalidDataReason.NETWORK_INVALID_NETWORK_ID,
  },
  {
    testName: 'Pool registration (operator) - too few certificates',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OPERATOR__SINGLE_POOL_REG_CERTIFICATE_REQUIRED,
  },
  {
    testName: 'Pool registration (owner) - too few certificates',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__SINGLE_POOL_REG_CERTIFICATE_REQUIRED,
  },
  {
    testName: 'Pool registration (operator) - too many certificates',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OPERATOR__SINGLE_POOL_REG_CERTIFICATE_REQUIRED,
  },
  {
    testName: 'Pool registration (owner) - too many certificates',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__SINGLE_POOL_REG_CERTIFICATE_REQUIRED,
  },
  {
    testName: 'Pool registration (operator) - too many withdrawals',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
      withdrawals: [
        {
          stakeCredential: {
            type: StakeCredentialParamsType.SCRIPT_HASH,
            scriptHashHex:
              '29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd',
          },
          amount: 1000,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OPERATOR__WITHDRAWALS_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (owner) - too many withdrawals',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
      withdrawals: [
        {
          stakeCredential: {
            type: StakeCredentialParamsType.SCRIPT_HASH,
            scriptHashHex:
              '29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd',
          },
          amount: 1000,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__WITHDRAWALS_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (operator) - mint included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
      mint: [
        {
          policyIdHex:
            '0d63e8d2c5a00cbcffbdf9112487c443466e1ea7d8c834df5ac5c425',
          tokens: [
            {
              assetNameHex: '75657374436f696e',
              amount: -7878754,
            },
          ],
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.SIGN_MODE_POOL_OPERATOR__MINT_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (owner) - mint included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
      mint: [
        {
          policyIdHex:
            '0d63e8d2c5a00cbcffbdf9112487c443466e1ea7d8c834df5ac5c425',
          tokens: [
            {
              assetNameHex: '75657374436f696e',
              amount: -7878754,
            },
          ],
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.SIGN_MODE_POOL_OWNER__MINT_NOT_ALLOWED,
  },
  // collateral inputs
  {
    testName: 'Ordinary tx - collateral inputs included',
    tx: {
      ...shelleyBase,
      collateralInputs: [inputs.utxoShelley],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_ORDINARY__COLLATERAL_INPUTS_NOT_ALLOWED,
  },
  {
    testName: 'Multisig tx - collateral inputs included',
    tx: {
      ...shelleyBase,
      collateralInputs: [inputs.utxoShelley],
    },
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_MULTISIG__COLLATERAL_INPUTS_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (operator) - collateral inputs included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
      collateralInputs: [inputs.utxoShelley],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OPERATOR__COLLATERAL_INPUTS_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (owner) - collateral inputs included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
      collateralInputs: [inputs.utxoShelley],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__COLLATERAL_INPUTS_NOT_ALLOWED,
  },
  // required signers
  {
    testName: 'Pool registration (operator) - required signers included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
      requiredSigners: [
        {
          type: TxRequiredSignerType.PATH,
          path: str_to_path("1852'/1815'/0'/0/0"),
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OPERATOR__REQUIRED_SIGNERS_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (owner) - required signers included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
      requiredSigners: [
        {
          type: TxRequiredSignerType.PATH,
          path: str_to_path("1852'/1815'/0'/0/0"),
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__REQUIRED_SIGNERS_NOT_ALLOWED,
  },
  // collateral return output included
  {
    testName: 'Ordinary tx - collateral output included',
    tx: {
      ...shelleyBase,
      collateralOutput: outputs.externalShelleyBaseKeyhashKeyhash,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_ORDINARY__COLLATERAL_OUTPUT_NOT_ALLOWED,
  },
  {
    testName: 'Multisig tx - collateral output included',
    tx: {
      ...shelleyBase,
      collateralOutput: outputs.externalShelleyBaseKeyhashKeyhash,
    },
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_MULTISIG__COLLATERAL_OUTPUT_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (operator) - collateral output included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
      collateralOutput: outputs.externalShelleyBaseKeyhashKeyhash,
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OPERATOR__COLLATERAL_OUTPUT_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (owner) - collateral output included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
      collateralOutput: outputs.externalShelleyBaseKeyhashKeyhash,
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__COLLATERAL_OUTPUT_NOT_ALLOWED,
  },
  // total collateral included
  {
    testName: 'Ordinary tx - total collateral included',
    tx: {
      ...shelleyBase,
      totalCollateral: 8,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_ORDINARY__TOTAL_COLLATERAL_NOT_ALLOWED,
  },
  {
    testName: 'Multisig tx - total collateral included',
    tx: {
      ...shelleyBase,
      totalCollateral: 8,
    },
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_MULTISIG__TOTAL_COLLATERAL_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (operator) - total collateral included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
      totalCollateral: 8,
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OPERATOR__TOTAL_COLLATERAL_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (owner) - total collateral included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
      totalCollateral: 8,
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__TOTAL_COLLATERAL_NOT_ALLOWED,
  },
  // reference inputs included
  {
    testName: 'Ordinary tx - reference inputs included',
    tx: {
      ...shelleyBase,
      referenceInputs: [inputs.utxoShelley],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_ORDINARY__REFERENCE_INPUTS_NOT_ALLOWED,
  },
  {
    testName: 'Multisig tx - reference inputs included',
    tx: {
      ...shelleyBase,
      referenceInputs: [inputs.utxoShelley],
    },
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_MULTISIG__REFERENCE_INPUTS_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (operator) - reference inputs included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
      referenceInputs: [inputs.utxoShelley],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OPERATOR__REFERENCE_INPUTS_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration (owner) - reference inputs included',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
      referenceInputs: [inputs.utxoShelley],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__REFERENCE_INPUTS_NOT_ALLOWED,
  },
]

export const addressParamsRejectTestCases: TestCaseRejectShelley[] = [
  {
    testName: 'Reward address - key',
    tx: {
      ...shelleyBase,
      outputs: [
        {
          amount: 10,
          destination: destinations.paymentKeyPath,
        },
      ],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.OUTPUT_INVALID_ADDRESS_PARAMS,
  },
  {
    testName: 'Reward address - script',
    tx: {
      ...shelleyBase,
      outputs: [
        {
          amount: 10,
          destination: destinations.paymentScriptHash,
        },
      ],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.OUTPUT_INVALID_ADDRESS_PARAMS,
  },
  {
    testName: 'No spending path - Ordinary Tx 1',
    tx: {
      ...shelleyBase,
      outputs: [
        {
          amount: 3003112,
          destination: {
            type: TxOutputDestinationType.DEVICE_OWNED,
            params: {
              type: AddressType.BASE_PAYMENT_SCRIPT_STAKE_KEY,
              params: {
                spendingScriptHashHex:
                  '29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd',
                stakingKeyHashHex:
                  '122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277',
              },
            },
          },
        },
      ],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.OUTPUT_INVALID_ADDRESS_PARAMS,
  },
  {
    testName: 'No spending path - Ordinary Tx 2',
    tx: {
      ...shelleyBase,
      outputs: [
        {
          amount: 3003112,
          destination: {
            type: TxOutputDestinationType.DEVICE_OWNED,
            params: {
              type: AddressType.BASE_PAYMENT_SCRIPT_STAKE_SCRIPT,
              params: {
                spendingScriptHashHex:
                  '29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd',
                stakingScriptHashHex:
                  '122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277',
              },
            },
          },
        },
      ],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.OUTPUT_INVALID_ADDRESS_PARAMS,
  },
  {
    testName: 'Pool operator - spending choice not path',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      outputs: [
        {
          amount: 10,
          destination: {
            type: TxOutputDestinationType.DEVICE_OWNED,
            params: {
              type: AddressType.BASE_PAYMENT_SCRIPT_STAKE_KEY,
              params: {
                spendingScriptHashHex:
                  '122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277',
                stakingPath: str_to_path("1852'/1815'/456'/2/0"),
              },
            },
          },
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.OUTPUT_INVALID_ADDRESS_PARAMS,
  },
  {
    testName: 'Multisig - unconditionally',
    tx: {
      ...shelleyBase,
      outputs: [outputs.internalBaseWithStakingPath],
    },
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_MULTISIG__DEVICE_OWNED_ADDRESS_NOT_ALLOWED,
  },
  {
    testName: 'Pool owner - unconditionally',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      outputs: [outputs.internalBaseWithStakingPath],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__DEVICE_OWNED_ADDRESS_NOT_ALLOWED,
  },
]

export const certificateRejectTestCases: TestCaseRejectShelley[] = [
  {
    testName: 'Pool registration in Ordinary Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_ORDINARY__POOL_REGISTRATION_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration in Multisig Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
    },
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_MULTISIG__POOL_REGISTRATION_NOT_ALLOWED,
  },
  {
    testName: 'Pool registration in Plutus Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
    },
    signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_PLUTUS__POOL_REGISTRATION_NOT_ALLOWED,
  },
  {
    testName: 'Pool retirement in Multisig Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_RETIREMENT,
          params: poolRetirementParam,
        },
      ],
    },
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_MULTISIG__POOL_RETIREMENT_NOT_ALLOWED,
  },
  // after this we can't really test the ledger policies from LedgerJS,
  // since we can't serialize the wrong type of certificate
  {
    testName: 'Stake registration in Pool Registration Operator',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_REGISTRATION,
          params: stakeRegistrationPathParam,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: TypeError,
    errMsg: "Cannot read properties of undefined (reading 'poolKey')",
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OPERATOR__SINGLE_POOL_REG_CERTIFICATE_REQUIRED,
  },
  {
    testName: 'Stake registration in Pool Registration Owner',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [],
      certificates: [
        {
          type: CertificateType.STAKE_REGISTRATION,
          params: stakeRegistrationPathParam,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: TypeError,
    errMsg: "Cannot read properties of undefined (reading 'poolKey')",
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__SINGLE_POOL_REG_CERTIFICATE_REQUIRED,
  },
  {
    testName: 'Stake deregistration in Pool Registration Operator',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_DEREGISTRATION,
          params: stakeDeregistrationParam,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: TypeError,
    errMsg: "Cannot read properties of undefined (reading 'poolKey')",
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OPERATOR__SINGLE_POOL_REG_CERTIFICATE_REQUIRED,
  },
  {
    testName: 'Stake deregistration in Pool Registration Owner',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [],
      certificates: [
        {
          type: CertificateType.STAKE_DEREGISTRATION,
          params: stakeDeregistrationParam,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: TypeError,
    errMsg: "Cannot read properties of undefined (reading 'poolKey')",
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__SINGLE_POOL_REG_CERTIFICATE_REQUIRED,
  },
  {
    testName: 'Stake delegation in Pool Registration Operator',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_DELEGATION,
          params: stakeDelegationParam,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: TypeError,
    errMsg: "Cannot read properties of undefined (reading 'poolKey')",
    rejectReason: InvalidDataReason.CERTIFICATE_INVALID_POOL_KEY_HASH,
  },
  {
    testName: 'Stake delegation in Pool Registration Owner',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [],
      certificates: [
        {
          type: CertificateType.STAKE_DELEGATION,
          params: stakeDelegationParam,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: TypeError,
    errMsg: "Cannot read properties of undefined (reading 'poolKey')",
    rejectReason: InvalidDataReason.CERTIFICATE_INVALID_POOL_KEY_HASH,
  },
  {
    testName: 'Pool retirement in Pool Registration Operator',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_RETIREMENT,
          params: poolRetirementParam,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: TypeError,
    errMsg: "Cannot read properties of undefined (reading 'poolKey')",
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OPERATOR__SINGLE_POOL_REG_CERTIFICATE_REQUIRED,
  },
  {
    testName: 'Pool retirement in Pool Registration Owner',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_RETIREMENT,
          params: poolRetirementParam,
        },
      ],
    },
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: TypeError,
    errMsg: "Cannot read properties of undefined (reading 'poolKey')",
    rejectReason:
      InvalidDataReason.SIGN_MODE_POOL_OWNER__SINGLE_POOL_REG_CERTIFICATE_REQUIRED,
  },
]

export const certificateStakingRejectTestCases: TestCaseRejectShelley[] = [
  {
    testName: 'Script hash in Ordinary Tx',
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_REGISTRATION,
          params: stakeRegistrationScriptHashParam,
        },
      ],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_ORDINARY__CERTIFICATE_STAKE_CREDENTIAL_ONLY_AS_PATH,
  },
  {
    testName: 'Non-staking path in Ordinary Tx',
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_REGISTRATION,
          params: {
            stakeCredential: {
              type: StakeCredentialParamsType.KEY_PATH,
              keyPath: str_to_path("1852'/1815'/0'/0/0"),
            },
          },
        },
      ],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Path in Multisig Tx',
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_REGISTRATION,
          params: stakeRegistrationPathParam,
        },
      ],
    },
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_MULTISIG__CERTIFICATE_STAKE_CREDENTIAL_ONLY_AS_SCRIPT,
  },
]

export const certificateStakePoolRetirementRejectTestCases: TestCaseRejectShelley[] =
  [
    {
      testName: 'Non-pool cold key in Ordinary Tx',
      unsupportedInAppXS: true,
      tx: {
        ...shelleyBase,
        certificates: [
          {
            type: CertificateType.STAKE_POOL_RETIREMENT,
            params: {
              poolKeyPath: str_to_path("1853'/1815'/0'/0"),
              retirementEpoch: 42,
            },
          },
        ],
      },
      signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
      errCls: DeviceStatusError,
      errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
      rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
    // can't test the rest of the signing modes, because a previous checks catches them
  ]

export const withdrawalRejectTestCases: TestCaseRejectShelley[] = [
  {
    testName: 'Script hash as stake credential in Ordinary Tx',
    tx: {
      ...shelleyBase,
      withdrawals: [
        {
          stakeCredential: {
            type: StakeCredentialParamsType.SCRIPT_HASH,
            scriptHashHex:
              '29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd',
          },
          amount: 1000,
        },
      ],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.SIGN_MODE_ORDINARY__WITHDRAWAL_ONLY_AS_PATH,
  },
  {
    testName: 'Non-staking path as stake credential in Ordinary Tx',
    tx: {
      ...shelleyBase,
      withdrawals: [
        {
          stakeCredential: {
            type: StakeCredentialParamsType.KEY_PATH,
            keyPath: str_to_path("1852'/1815'/0'/0/0"),
          },
          amount: 1000,
        },
      ],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Staking path as stake credential in Multisig Tx',
    tx: {
      ...shelleyBase,
      withdrawals: [
        {
          stakeCredential: {
            type: StakeCredentialParamsType.KEY_PATH,
            keyPath: str_to_path("1852'/1815'/0'/2/0"),
          },
          amount: 1000,
        },
      ],
    },
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason:
      InvalidDataReason.SIGN_MODE_MULTISIG__WITHDRAWAL_ONLY_AS_SCRIPT,
  },
  {
    testName: 'Non-staking path as stake credential in Plutus Tx',
    tx: {
      ...shelleyBase,
      withdrawals: [
        {
          stakeCredential: {
            type: StakeCredentialParamsType.KEY_PATH,
            keyPath: str_to_path("1852'/1815'/0'/0/0"),
          },
          amount: 1000,
        },
      ],
    },
    signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
]

export const witnessRejectTestCases: TestCaseRejectShelley[] = [
  {
    testName: 'Ordinary account path in Ordinary Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1852'/1815'/0'")],
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Multisig account path in Ordinary Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1854'/1815'/0'")],
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Multisig spending path in Ordinary Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1854'/1815'/0'/0/0")],
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Multisig staking path in Ordinary Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1854'/1815'/0'/2/0")],
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Mint path in Ordinary Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1855'/1815'/0'")],
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Ordinary account path in Multisig Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1852'/1815'/0'")],
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Multisig account path in Multisig Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1854'/1815'/0'")],
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Ordinary spending path in Multisig Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1852'/1815'/0'/0/0")],
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Ordinary staking path in Multisig Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1852'/1815'/0'/2/0")],
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Mint path in Multisig Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1855'/1815'/0'")],
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Pool cold path in Multisig Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1853'/1815'/0'/0'")],
    signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Ordinary account path in Plutus Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1852'/1815'/0'")],
    signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Multisig account path in Plutus Tx',
    tx: {
      ...shelleyBase,
    },
    additionalWitnessPaths: [str_to_path("1854'/1815'/0'")],
    signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Multisig account path in Pool Registration (Owner) Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
    },
    additionalWitnessPaths: [str_to_path("1854'/1815'/0'")],
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Ordinary spending path in Pool Registration (Owner) Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
    },
    additionalWitnessPaths: [str_to_path("1852'/1815'/0'/0/0")],
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Multisig spending path in Pool Registration (Owner) Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
    },
    additionalWitnessPaths: [str_to_path("1854'/1815'/0'/0/0")],
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Multisig staking path in Pool Registration (Owner) Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
    },
    additionalWitnessPaths: [str_to_path("1854'/1815'/0'/2/0")],
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Mint path in Pool Registration (Owner) Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
    },
    additionalWitnessPaths: [str_to_path("1855'/1815'/0'")],
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Pool cold path in Pool Registration (Owner) Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      inputs: [inputs.utxoMultisig],
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOwner,
        },
      ],
    },
    additionalWitnessPaths: [str_to_path("1853'/1815'/0'/0'")],
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Multisig account path in Pool Registration (Operator) Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
    },
    additionalWitnessPaths: [str_to_path("1854'/1815'/0'")],
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Multisig spending path in Pool Registration (Operator) Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
    },
    additionalWitnessPaths: [str_to_path("1854'/1815'/0'/0/0")],
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Ordinary staking path in Pool Registration (Operator) Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
    },
    additionalWitnessPaths: [str_to_path("1852'/1815'/0'/2/0")],
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Multisig staking path in Pool Registration (Operator) Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
    },
    additionalWitnessPaths: [str_to_path("1854'/1815'/0'/2/0")],
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Mint path in Pool Registration (Operator) Tx',
    unsupportedInAppXS: true,
    tx: {
      ...shelleyBase,
      certificates: [
        {
          type: CertificateType.STAKE_POOL_REGISTRATION,
          params: poolRegParamOperator,
        },
      ],
    },
    additionalWitnessPaths: [str_to_path("1855'/1815'/0'")],
    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
]

export const testsInvalidTokenBundleOrdering: TestCaseRejectShelley[] = [
  {
    testName: 'Reject tx where asset groups are not ordered',
    tx: {
      ...mainnetFeeTtl,
      inputs: [inputs.utxoShelley],
      outputs: [outputs.multiassetInvalidAssetGroupOrdering],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_INVALID_DATA],
    rejectReason: InvalidDataReason.MULTIASSET_INVALID_TOKEN_BUNDLE_ORDERING,
  },
  {
    testName: 'Reject tx where asset groups are not unique',
    tx: {
      ...mainnetFeeTtl,
      inputs: [inputs.utxoShelley],
      outputs: [outputs.multiassetAssetGroupsNotUnique],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_INVALID_DATA],
    rejectReason: InvalidDataReason.MULTIASSET_INVALID_TOKEN_BUNDLE_NOT_UNIQUE,
  },
  {
    testName:
      'Reject tx where tokens within an asset group are not ordered - alphabetical',
    tx: {
      ...mainnetFeeTtl,
      inputs: [inputs.utxoShelley],
      outputs: [outputs.multiassetInvalidTokenOrderingSameLength],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_INVALID_DATA],
    rejectReason: InvalidDataReason.MULTIASSET_INVALID_ASSET_GROUP_ORDERING,
  },
  {
    testName:
      'Reject tx where tokens within an asset group are not ordered - length',
    tx: {
      ...mainnetFeeTtl,
      inputs: [inputs.utxoShelley],
      outputs: [outputs.multiassetInvalidTokenOrderingDifferentLengths],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_INVALID_DATA],
    rejectReason: InvalidDataReason.MULTIASSET_INVALID_ASSET_GROUP_ORDERING,
  },
  {
    testName: 'Reject tx where tokens within an asset group are not unique',
    tx: {
      ...mainnetFeeTtl,
      inputs: [inputs.utxoShelley],
      outputs: [outputs.multiassetTokensNotUnique],
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_INVALID_DATA],
    rejectReason: InvalidDataReason.MULTIASSET_INVALID_ASSET_GROUP_NOT_UNIQUE,
  },
  {
    testName:
      'Reject tx with mint fields with invalid canonical ordering of policies',
    unsupportedInAppXS: true,
    tx: {
      ...mainnetFeeTtl,
      inputs: [inputs.utxoShelley],
      outputs: [],
      mint: mints.mintInvalidCanonicalOrderingPolicy,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_INVALID_DATA],
    rejectReason: InvalidDataReason.MULTIASSET_INVALID_TOKEN_BUNDLE_ORDERING,
  },
  {
    testName:
      'Reject tx with mint fields with invalid canonical ordering of asset names',
    unsupportedInAppXS: true,
    tx: {
      ...mainnetFeeTtl,
      inputs: [inputs.utxoShelley],
      outputs: [],
      mint: mints.mintInvalidCanonicalOrderingAssetName,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_INVALID_DATA],
    rejectReason: InvalidDataReason.MULTIASSET_INVALID_ASSET_GROUP_ORDERING,
  },
]

export const singleAccountRejectTestCases: TestCaseRejectShelley[] = [
  {
    testName: 'Input and change output account mismatch',
    tx: {
      network: Networks.Mainnet,
      inputs: [inputs.utxoShelley],
      outputs: [
        {
          amount: 1,
          destination: {
            type: TxOutputDestinationType.THIRD_PARTY,
            params: {
              addressHex: bech32_to_hex(
                'addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r',
              ),
            },
          },
        },
        {
          amount: 7120787,
          destination: {
            type: TxOutputDestinationType.DEVICE_OWNED,
            params: {
              type: AddressType.BASE_PAYMENT_KEY_STAKE_KEY,
              params: {
                spendingPath: str_to_path("1852'/1815'/1'/0/0"),
                stakingPath: str_to_path("1852'/1815'/0'/2/0"),
              },
            },
          },
        },
      ],
      fee: 42,
      ttl: 10,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Input and stake deregistration certificate account mismatch',
    tx: {
      network: Networks.Mainnet,
      inputs: [inputs.utxoShelley],
      outputs: [
        {
          amount: 1,
          destination: {
            type: TxOutputDestinationType.THIRD_PARTY,
            params: {
              addressHex: bech32_to_hex(
                'addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r',
              ),
            },
          },
        },
      ],
      certificates: [
        {
          type: CertificateType.STAKE_DEREGISTRATION,
          params: {
            stakeCredential: {
              type: StakeCredentialParamsType.KEY_PATH,
              keyPath: str_to_path("1852'/1815'/1'/2/0"),
            },
          },
        },
      ],
      fee: 42,
      ttl: 10,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Input and withdrawal account mismatch',
    tx: {
      network: Networks.Mainnet,
      inputs: [inputs.utxoShelley],
      outputs: [
        {
          amount: 1,
          destination: {
            type: TxOutputDestinationType.THIRD_PARTY,
            params: {
              addressHex: bech32_to_hex(
                'addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r',
              ),
            },
          },
        },
      ],
      withdrawals: [
        {
          amount: 1000,
          stakeCredential: {
            type: StakeCredentialParamsType.KEY_PATH,
            keyPath: str_to_path("1852'/1815'/1'/2/0"),
          },
        },
      ],
      fee: 42,
      ttl: 10,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Change output and stake deregistration account mismatch',
    tx: {
      network: Networks.Mainnet,
      inputs: [inputs.utxoShelley],
      outputs: [
        {
          amount: 1,
          destination: {
            type: TxOutputDestinationType.THIRD_PARTY,
            params: {
              addressHex: bech32_to_hex(
                'addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r',
              ),
            },
          },
        },
        outputs.internalBaseWithStakingPath,
      ],
      certificates: [
        {
          type: CertificateType.STAKE_DEREGISTRATION,
          params: {
            stakeCredential: {
              type: StakeCredentialParamsType.KEY_PATH,
              keyPath: str_to_path("1852'/1815'/1'/2/0"),
            },
          },
        },
      ],
      fee: 42,
      ttl: 10,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Change output and withdrawal account mismatch',
    tx: {
      network: Networks.Mainnet,
      inputs: [inputs.utxoShelley],
      outputs: [
        {
          amount: 1,
          destination: {
            type: TxOutputDestinationType.THIRD_PARTY,
            params: {
              addressHex: bech32_to_hex(
                'addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r',
              ),
            },
          },
        },
        outputs.internalBaseWithStakingPath,
      ],
      withdrawals: [
        {
          amount: 1000,
          stakeCredential: {
            type: StakeCredentialParamsType.KEY_PATH,
            keyPath: str_to_path("1852'/1815'/1'/2/0"),
          },
        },
      ],
      fee: 42,
      ttl: 10,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName:
      'Stake deregistration certificate and withdrawal account mismatch',
    tx: {
      network: Networks.Mainnet,
      inputs: [inputs.utxoShelley],
      outputs: [
        {
          amount: 1,
          destination: {
            type: TxOutputDestinationType.THIRD_PARTY,
            params: {
              addressHex: bech32_to_hex(
                'addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r',
              ),
            },
          },
        },
      ],
      certificates: [
        {
          type: CertificateType.STAKE_DEREGISTRATION,
          params: {
            stakeCredential: {
              type: StakeCredentialParamsType.KEY_PATH,
              keyPath: str_to_path("1852'/1815'/0'/2/0"),
            },
          },
        },
      ],
      withdrawals: [
        {
          amount: 1000,
          stakeCredential: {
            type: StakeCredentialParamsType.KEY_PATH,
            keyPath: str_to_path("1852'/1815'/1'/2/0"),
          },
        },
      ],
      fee: 42,
      ttl: 10,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Byron to Shelley transfer input account mismatch',
    tx: {
      network: Networks.Mainnet,
      inputs: [
        {
          ...inputs.utxoByron,
          txHashHex:
            '3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7',
          path: str_to_path("44'/1815'/1'/0/0"),
        },
        {
          ...inputs.utxoShelley,
          path: str_to_path("1852'/1815'/1'/0/0"),
        },
      ],
      outputs: [
        {
          amount: 1,
          destination: {
            type: TxOutputDestinationType.THIRD_PARTY,
            params: {
              addressHex: bech32_to_hex(
                'addr1z90z7zqwhya6mpk5q929ur897g3pp9kkgalpreny8y304r2dcrtx0sf3dluyu4erzr3xtmdnzvcyfzekkuteu2xagx0qeva0pr',
              ),
            },
          },
        },
      ],
      fee: 42,
      ttl: 10,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
  {
    testName: 'Byron to Shelley transfer output account mismatch',
    tx: {
      network: Networks.Mainnet,
      inputs: [
        {
          ...inputs.utxoByron,
          txHashHex:
            '3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7',
          path: str_to_path("44'/1815'/1'/0/0"),
        },
      ],
      outputs: [
        {
          amount: 7120787,
          destination: {
            type: TxOutputDestinationType.DEVICE_OWNED,
            params: {
              type: AddressType.BASE_PAYMENT_KEY_STAKE_KEY,
              params: {
                spendingPath: str_to_path("1852'/1815'/1'/0/0"),
                stakingPath: str_to_path("1852'/1815'/1'/2/0"),
              },
            },
          },
        },
      ],
      fee: 42,
      ttl: 10,
    },
    signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.LEDGER_POLICY,
  },
]

export const collateralOutputRejectTestCases: TestCaseRejectShelley[] = [
  {
    testName: 'Collateral output with datum hash',
    tx: {
      ...shelleyBase,
      collateralOutput: outputs.datumHashExternal,
    },
    signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.COLLATERAL_INPUT_CONTAINS_DATUM,
  },
  {
    testName: 'Collateral output with inline datum',
    tx: {
      ...shelleyBase,
      collateralOutput: outputs.inlineDatum480Map,
    },
    signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.COLLATERAL_INPUT_CONTAINS_DATUM,
  },
  {
    testName: 'Collateral output with reference script',
    tx: {
      ...shelleyBase,
      collateralOutput: outputs.refScriptExternalMap,
    },
    signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
    errCls: DeviceStatusError,
    errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_REJECTED_BY_POLICY],
    rejectReason: InvalidDataReason.COLLATERAL_INPUT_CONTAINS_REFERENCE_SCRIPT,
  },
]

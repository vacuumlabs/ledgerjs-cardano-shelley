import type { AssetGroup, DeviceOwnedAddress, ErrorBase, Transaction, TxInput, TxOutput, TxOutputDestination } from "../../../src/Ada"
import {DeviceStatusError, InvalidDataReason, TxAuxiliaryDataSupplementType} from "../../../src/Ada"
import { AddressType, CertificateType, Networks, TxAuxiliaryDataType, TxOutputDestinationType, TxRequiredSignerType,utils } from "../../../src/Ada"
import type { BIP32Path} from '../../../src/types/public'
import { StakeCredentialParamsType, TransactionSigningMode } from '../../../src/types/public'
import { str_to_path } from "../../../src/utils/address"
import type { NetworkIdlessTestResult } from "../../test_utils"

export const inputs: Record<
  | 'utxoByron'
  | 'utxoShelley'
  | 'utxoNonReasonable'
  | 'utxoMultisig'
  , TxInput
> = {
    utxoByron: {
        txHashHex:
      "1af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc",
        outputIndex: 0,
        path: str_to_path("44'/1815'/0'/0/0"),
    },
    utxoShelley: {
        txHashHex:
      "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
        outputIndex: 0,
        path: str_to_path("1852'/1815'/0'/0/0"),
    },
    utxoNonReasonable: {
        txHashHex:
      "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
        outputIndex: 0,
        path: str_to_path("1852'/1815'/456'/0/0"),
    },
    utxoMultisig: {
        txHashHex:
      "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
        outputIndex: 0,
        path: null,
    },
}

const base58_to_hex = (str: string): string => utils.buf_to_hex(utils.base58_decode(str))
const bech32_to_hex = (str: string): string => utils.buf_to_hex(utils.bech32_decodeAddress(str))

const destinations: Record<
  | 'externalByronMainnet'
  | 'externalByronDaedalusMainnet'
  | 'externalByronTestnet'
  | 'externalShelley'
  | 'externalShelleyScripthash'
  | 'internalBaseWithStakingKeyHash'
  | 'internalBaseWithStakingPath'
  | 'internalBaseWithStakingScript'
  | 'internalBaseWithStakingPathNonReasonable'
  | 'internalEnterprise'
  | 'internalPointer'
  | 'multiassetThirdParty'
  | 'rewardsInternal'
  , TxOutputDestination
> = {
    externalByronMainnet: {
        type: TxOutputDestinationType.THIRD_PARTY,
        params: {
            addressHex: base58_to_hex(
                "Ae2tdPwUPEZCanmBz5g2GEwFqKTKpNJcGYPKfDxoNeKZ8bRHr8366kseiK2"
            ),
        },
    },
    externalByronDaedalusMainnet: {
        type: TxOutputDestinationType.THIRD_PARTY,
        params: {
            addressHex: base58_to_hex(
                "DdzFFzCqrht7HGoJ87gznLktJGywK1LbAJT2sbd4txmgS7FcYLMQFhawb18ojS9Hx55mrbsHPr7PTraKh14TSQbGBPJHbDZ9QVh6Z6Di"
            ),
        },
    },
    externalByronTestnet: {
        type: TxOutputDestinationType.THIRD_PARTY,
        params: {
            addressHex: base58_to_hex(
                "2657WMsDfac6Cmfg4Varph2qyLKGi2K9E8jrtvjHVzfSjmbTMGy5sY3HpxCKsmtDA"
            ),
        },
    },
    externalShelley: {
        type: TxOutputDestinationType.THIRD_PARTY,
        params: {
            addressHex: bech32_to_hex(
                "addr1q97tqh7wzy8mnx0sr2a57c4ug40zzl222877jz06nt49g4zr43fuq3k0dfpqjh3uvqcsl2qzwuwsvuhclck3scgn3vya5cw5yhe5vyg5x20akz"
            ),
        },
    },
    externalShelleyScripthash: {
        type: TxOutputDestinationType.THIRD_PARTY,
        params: {
            addressHex: bech32_to_hex(
                "addr_test1zp0z7zqwhya6mpk5q929ur897g3pp9kkgalpreny8y304rfw6j2jxnwq6enuzvt0lp89wgcsufj7mvcnxpzgkd4hz70z3h2pnc8lhq8r"
            ),
        },
    },
    internalBaseWithStakingKeyHash: {
        type: TxOutputDestinationType.DEVICE_OWNED,
        params: {
            type: AddressType.BASE_PAYMENT_KEY_STAKE_KEY,
            params: {
                spendingPath: str_to_path("1852'/1815'/0'/0/0"),
                stakingKeyHashHex:
          "122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277",
            },
        },
    },
    internalBaseWithStakingPath: {
        type: TxOutputDestinationType.DEVICE_OWNED,
        params: {
            type: AddressType.BASE_PAYMENT_KEY_STAKE_KEY,
            params: {
                spendingPath: str_to_path("1852'/1815'/0'/0/0"),
                stakingPath: str_to_path("1852'/1815'/0'/2/0"),
            },
        },
    },
    internalBaseWithStakingScript: {
        type: TxOutputDestinationType.DEVICE_OWNED,
        params: {
            type: AddressType.BASE_PAYMENT_KEY_STAKE_SCRIPT,
            params: {
                spendingPath: str_to_path("1852'/1815'/0'/0/0"),
                stakingScriptHash: "122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277",
            },
        },
    },
    internalBaseWithStakingPathNonReasonable: {
        type: TxOutputDestinationType.DEVICE_OWNED,
        params: {
            type: AddressType.BASE_PAYMENT_KEY_STAKE_KEY,
            params: {
                spendingPath: str_to_path("1852'/1815'/456'/0/5000000"),
                stakingPath: str_to_path("1852'/1815'/456'/2/0"),
            },
        },
    },
    internalEnterprise: {
        type: TxOutputDestinationType.DEVICE_OWNED,
        params: {
            type: AddressType.ENTERPRISE_KEY,
            params: {
                spendingPath: str_to_path("1852'/1815'/0'/0/0"),
            },
        },
    },
    internalPointer: {
        type: TxOutputDestinationType.DEVICE_OWNED,
        params: {
            type: AddressType.POINTER_KEY,
            params: {
                spendingPath: str_to_path("1852'/1815'/0'/0/0"),
                stakingBlockchainPointer: {
                    blockIndex: 1,
                    txIndex: 2,
                    certificateIndex: 3,
                },
            },
        },
    },
    multiassetThirdParty: {
        type: TxOutputDestinationType.THIRD_PARTY,
        params: {
            addressHex: bech32_to_hex(
                "addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r"
            ),
        },
    },
    rewardsInternal: {
        type: TxOutputDestinationType.DEVICE_OWNED,
        params: {
            type: AddressType.REWARD_KEY,
            params: {
                stakingPath: str_to_path("1852'/1815'/0'/2/0"),
            },
        },
    },
}

export const mints: Record<
    | 'mintAmountVariety'
    | 'mintInvalidCanonicalOrderingPolicy'
    | 'mintInvalidCanonicalOrderingAssetName'
  , Array<AssetGroup>
> = {
    mintAmountVariety: [
        {
            // fingerprints taken from CIP 14 draft
            policyIdHex: "7eae28af2208be856f7a119668ae52a49b73725e326dc16579dcc373",
            tokens: [
                {
                    // fingerprint: asset1rjklcrnsdzqp65wjgrg55sy9723kw09mlgvlc3
                    assetNameHex: "",
                    amount: "0",
                },
                {
                    // fingerprint: asset17jd78wukhtrnmjh3fngzasxm8rck0l2r4hhyyt
                    assetNameHex: "1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df209",
                    amount: "-1",
                },
                {
                    // fingerprint: asset17jd78wukhtrnmjh3fngzasxm8rck0l2r4hhyyt (and incremented)
                    assetNameHex: "1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df20a",
                    amount: "9223372036854775807",
                },
                {
                    // fingerprint: asset17jd78wukhtrnmjh3fngzasxm8rck0l2r4hhyyt (and incremented)
                    assetNameHex: "1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df20b",
                    amount: "-9223372036854775808",
                },
            ],
        },
    ],
    mintInvalidCanonicalOrderingPolicy: [
        {
            // fingerprints taken from CIP 14 draft (and incremented)
            policyIdHex: "7eae28af2208be856f7a119668ae52a49b73725e326dc16579dcc374",
            tokens: [
                {
                    // fingerprint: asset1rjklcrnsdzqp65wjgrg55sy9723kw09mlgvlc3
                    assetNameHex: "",
                    amount: "0",
                },
                {
                    // fingerprint: asset17jd78wukhtrnmjh3fngzasxm8rck0l2r4hhyyt
                    assetNameHex: "1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df209",
                    amount: "-1",
                },
            ],
        },
        {
            // fingerprints taken from CIP 14 draft
            policyIdHex: "7eae28af2208be856f7a119668ae52a49b73725e326dc16579dcc373",
            tokens: [
                {
                    // fingerprint: asset1rjklcrnsdzqp65wjgrg55sy9723kw09mlgvlc3
                    assetNameHex: "",
                    amount: "0",
                },
            ],
        },
    ],
    mintInvalidCanonicalOrderingAssetName: [
        {
            // fingerprints taken from CIP 14 draft (and incremented)
            policyIdHex: "7eae28af2208be856f7a119668ae52a49b73725e326dc16579dcc374",
            tokens: [
                {
                    // fingerprint: asset17jd78wukhtrnmjh3fngzasxm8rck0l2r4hhyyt
                    assetNameHex: "1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df209",
                    amount: "-1",
                },
                {
                    // fingerprint: asset1rjklcrnsdzqp65wjgrg55sy9723kw09mlgvlc3
                    assetNameHex: "",
                    amount: "0",
                },
            ],
        },
    ],
}

export const outputs: Record<
  | 'externalByronMainnet'
  | 'externalByronDaedalusMainnet'
  | 'externalByronTestnet'
  | 'externalShelley'
  | 'externalShelleyScripthash'
  | 'internalBaseWithStakingKeyHash'
  | 'internalBaseWithStakingPath'
  | 'internalBaseWithStakingPathNonReasonable'
  | 'internalEnterprise'
  | 'internalPointer'
  | 'multiassetOneToken'
  | 'multiassetManyTokens'
  | 'multiassetChange'
  | 'multiassetBigNumber'
  | 'multiassetInvalidAssetGroupOrdering'
  | 'multiassetAssetGroupsNotUnique'
  | 'multiassetInvalidTokenOrderingSameLength'
  | 'multiassetInvalidTokenOrderingDifferentLengths'
  | 'multiassetTokensNotUnique'
  | 'trezorParity'
  | 'trezorParityDatumHash'
  | 'datumHash'
  | 'datumHashExternal'
  | 'datumHashWithTokens'
  | 'datumHashStakePath'
  | 'datumHashStakePathExternal'
  , TxOutput
> = {
    externalByronMainnet: {
        amount: 3003112,
        destination: destinations.externalByronMainnet,
    },
    externalByronDaedalusMainnet: {
        amount: 3003112,
        destination: destinations.externalByronDaedalusMainnet,
    },
    externalByronTestnet: {
        amount: 3003112,
        destination: destinations.externalByronTestnet,
    },
    externalShelley: {
        amount: 1,
        destination: destinations.externalShelley,
    },
    externalShelleyScripthash: {
        amount: 1,
        destination: destinations.externalShelleyScripthash,
    },
    internalBaseWithStakingKeyHash: {
        amount: 7120787,
        destination: destinations.internalBaseWithStakingKeyHash,
    },
    internalBaseWithStakingPath: {
        destination: destinations.internalBaseWithStakingPath,
        amount: 7120787,
    },
    internalBaseWithStakingPathNonReasonable: {
        destination: destinations.internalBaseWithStakingPathNonReasonable,
        amount: 7120787,
    },
    internalEnterprise: {
        destination: destinations.internalEnterprise,
        amount: 7120787,
    },
    internalPointer: {
        destination: destinations.internalPointer,
        amount: 7120787,
    },
    multiassetOneToken: {
        destination: destinations.multiassetThirdParty,
        amount: 1234,
        tokenBundle: [
            {
                policyIdHex: "95a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "74652474436f696e",
                        amount: "7878754",
                    },
                ],
            },
        ],
    },
    multiassetManyTokens: {
        destination: destinations.multiassetThirdParty,
        amount: "1234",
        tokenBundle: [
            {
                // fingerprints taken from CIP 14 draft
                policyIdHex: "7eae28af2208be856f7a119668ae52a49b73725e326dc16579dcc373",
                tokens: [
                    {
                        // fingerprint: asset1rjklcrnsdzqp65wjgrg55sy9723kw09mlgvlc3
                        assetNameHex: "",
                        amount: "3",
                    },
                    {
                        // fingerprint: asset17jd78wukhtrnmjh3fngzasxm8rck0l2r4hhyyt
                        assetNameHex: "1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df209",
                        amount: "1",
                    },
                    {
                        // fingerprint: asset1pkpwyknlvul7az0xx8czhl60pyel45rpje4z8w
                        assetNameHex: "0000000000000000000000000000000000000000000000000000000000000000",
                        amount: "2",
                    },
                ],
            },
            {
                policyIdHex: "95a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "456c204e69c3b16f",
                        amount: "1234",
                    },
                    {
                        assetNameHex: "74652474436f696e",
                        amount: "7878754",
                    },
                ],
            },
        ],
    },
    multiassetChange: {
        destination: destinations.internalBaseWithStakingPath,
        amount: "1234",
        tokenBundle: [
            {
                policyIdHex: "95a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "74652474436f696e",
                        amount: "7878754",
                    },
                ],
            },
        ],
    },
    multiassetBigNumber: {
        destination: destinations.multiassetThirdParty,
        amount: "24103998870869519",
        tokenBundle: [
            {
                policyIdHex: "95a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "74652474436f696e",
                        amount: "24103998870869519",
                    },
                ],
            },
        ],
    },
    multiassetInvalidAssetGroupOrdering: {
        destination: destinations.multiassetThirdParty,
        amount: "1234",
        tokenBundle: [
            {
                policyIdHex: "75a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "7564247542686911",
                        amount: "47",
                    },
                ],
            },
            {
                policyIdHex: "71a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "7564247542686911",
                        amount: "47",
                    },
                ],
            },
        ],
    },
    multiassetAssetGroupsNotUnique: {
        destination: destinations.multiassetThirdParty,
        amount: "1234",
        tokenBundle: [
            {
                policyIdHex: "75a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "7564247542686911",
                        amount: "47",
                    },
                ],
            },
            {
                policyIdHex: "75a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "7564247542686911",
                        amount: "47",
                    },
                ],
            },
        ],
    },
    multiassetInvalidTokenOrderingSameLength: {
        destination: destinations.multiassetThirdParty,
        amount: "1234",
        tokenBundle: [
            {
                policyIdHex: "75a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "7564247542686911",
                        amount: "47",
                    },
                    {
                        assetNameHex: "74652474436f696e",
                        amount: "7878754",
                    },
                ],
            },
        ],
    },
    multiassetInvalidTokenOrderingDifferentLengths: {
        destination: destinations.multiassetThirdParty,
        amount: "1234",
        tokenBundle: [
            {
                policyIdHex: "75a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "7564247542686911",
                        amount: "47",
                    },
                    {
                        assetNameHex: "756424754268",
                        amount: "7878754",
                    },
                ],
            },
        ],
    },
    multiassetTokensNotUnique: {
        destination: destinations.multiassetThirdParty,
        amount: "1234",
        tokenBundle: [
            {
                policyIdHex: "75a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "7564247542686911",
                        amount: "47",
                    },
                    {
                        assetNameHex: "7564247542686911",
                        amount: "7878754",
                    },
                ],
            },
        ],
    },
    trezorParity: {
        destination: destinations.multiassetThirdParty,
        amount: 2000000,
        tokenBundle: [
            {
                policyIdHex: "0d63e8d2c5a00cbcffbdf9112487c443466e1ea7d8c834df5ac5c425",
                tokens: [
                    {
                        assetNameHex: "74657374436f696e",
                        amount: "7878754",
                    },
                ],
            },
        ],
    },
    trezorParityDatumHash: {
        destination: {
            type: TxOutputDestinationType.THIRD_PARTY,
            params: {
                addressHex: bech32_to_hex(
                    "addr1w9rhu54nz94k9l5v6d9rzfs47h7dv7xffcwkekuxcx3evnqpvuxu0"
                ),
            },
        },
        amount: 1,
        datumHashHex: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
    },
    datumHash: {
        destination: destinations.internalBaseWithStakingScript,
        amount: 7120787,
        datumHashHex: "ffd4d009f554ba4fd8ed1f1d703244819861a9d34fd4753bcf3ff32f043ce188",
    },
    datumHashExternal: {
        destination: destinations.externalShelleyScripthash,
        amount: 7120787,
        datumHashHex: "ffd4d009f554ba4fd8ed1f1d703244819861a9d34fd4753bcf3ff32f043ce188",
    },
    datumHashWithTokens: {
        destination: destinations.internalBaseWithStakingScript,
        amount: 7120787,
        tokenBundle: [
            {
                policyIdHex: "75a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39",
                tokens: [
                    {
                        assetNameHex: "7564247542686911",
                        amount: "47",
                    },
                    {
                        assetNameHex: "7564247542686912",
                        amount: "7878754",
                    },
                ],
            },
        ],
        datumHashHex: "ffd4d009f554ba4fd8ed1f1d703244819861a9d34fd4753bcf3ff32f043ce188",
    },
    datumHashStakePath: {
        destination: destinations.internalBaseWithStakingPath,
        amount: 7120787,
        datumHashHex: "ffd4d009f554ba4fd8ed1f1d703244819861a9d34fd4753bcf3ff32f043ce188",
    },
    datumHashStakePathExternal: {
        destination: destinations.externalShelley,
        amount: 7120787,
        datumHashHex: "ffd4d009f554ba4fd8ed1f1d703244819861a9d34fd4753bcf3ff32f043ce188",
    },
}

const byronBase = {
    inputs: [inputs.utxoByron],
    fee: 42,
    ttl: 10,
}

export type TestcaseByron = {
  testname: string
  tx: Transaction
  signingMode: TransactionSigningMode
  txBody?: string
  result: NetworkIdlessTestResult
}

export const testsByron: TestcaseByron[] = [
    {
        testname: "Sign tx without change address with Byron mainnet output",
        tx: {
            ...byronBase,
            network: Networks.Mainnet,
            outputs: [outputs.externalByronMainnet],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a500818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc00018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a0f01",
        result: {
            txHashHex:
        "4fcd4532bb0a9dfff2368e60be80d46819a92a9acfb2c64a7bf5975040789bac",
            witnesses: [
                {
                    path: str_to_path("44'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "db287b72ad0a5605ff47e20fabeec6906dbe8304f07eda88fd96f20966d40d7524c1f967e148544f4bc632b1bf4820f60e9a5ffc835b3ce9401d4c3606fbe604",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx without change address with Byron Daedalus mainnet output",
        tx: {
            ...byronBase,
            network: Networks.Mainnet,
            outputs: [outputs.externalByronDaedalusMainnet],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a500818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc00018182584c82d818584283581cd2348b8ef7b8a6d1c922efa499c669b151eeef99e4ce3521e88223f8a101581e581cf281e648a89015a9861bd9e992414d1145ddaf80690be53235b0e2e5001a199834651a002dd2e802182a030a0f01",
        result: {
            txHashHex:
        "8bee57a02eafcba790605862cc5eb5f5bf1f025f8de2a2a3723bc45594a88941",
            witnesses: [
                {
                    path: str_to_path("44'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "800aece99b76aa4d5c1ab185bc50fa39d3878f9618644d0293b2b4e61e2ef576b6dd38e9e34b3a026d3f741c17e946d147506ad3d2e5575b7dcf8629361e950c",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx without change address with Byron testnet output",
        tx: {
            ...byronBase,
            network: Networks.Testnet,
            outputs: [outputs.externalByronTestnet],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a500818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc00018182582f82d818582583581c709bfb5d9733cbdd72f520cd2c8b9f8f942da5e6cd0b6994e1803b0aa10242182a001aef14e76d1a002dd2e802182a030a0f00",
        result: {
            txHashHex:
        "fce5bd757b725862d5657d7cc4d14e5a19c5bbd66c933c828cae5994004573f2",
            witnesses: [
                {
                    path: str_to_path("44'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "2547e080fc05e588f2a1104f21817dcf913df93d5501a5dadca7600cbc5032dd9c9676b1736f09521493fdfbbc29a9891df5892896e4ac30d289bfe606d75f0a",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
]


const shelleyBase = {
    network: Networks.Mainnet,
    inputs: [inputs.utxoShelley],
    outputs: [outputs.externalByronMainnet],
    fee: 42,
    ttl: 10,
}

export type TestcaseShelley = {
  testname: string
  tx: Transaction
  signingMode: TransactionSigningMode
  additionalWitnessPaths: BIP32Path[]
  txBody?: string
  txAuxiliaryData?: string,
  result: NetworkIdlessTestResult
}

export const testsShelleyNoCertificates: TestcaseShelley[] = [
    {
        testname: "Sign tx without outputs",
        tx: {
            ...shelleyBase,
            outputs: [],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018002182a030a0f01",
        result: {
            txHashHex:
        "8380ee9efe92ae1555f209b88612f30ce17f492f43c89ef1e6972ba99be2fd55",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "fea6646c67fb467f8a5425e9c752e1e262b0420ba4b638f39514049a54ca53304ac1641a26e3ff14a08e35f5bc64fe548fc6a9513346be55f493e814ce9c4d0e",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx without change address",
        tx: {
            ...shelleyBase,
            outputs: [outputs.externalShelley],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825841017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b09da61d425f34611140102182a030a0f01",
        result: {
            txHashHex:
        "165008fe23393fe340779a73ec710b3d0ac4545a7a9c1ceafc8eb2eabf0a9352",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "f5b47973042063a4b24d8be8ba9263e5203637ce909793eaa5b5624f386a15eeb5290db55cf5414a0aa1db12dc213db8aaf829d578fa38ff7f5e626060cbe50d",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    ///////////////////////////
    // multisig
    //  possibly with certificate (for the keyhash) ?
    {
        testname: "Sign tx without change address with Shelley scripthash output",
        tx: {
            ...shelleyBase,
            network: Networks.Testnet,
            outputs: [outputs.externalShelleyScripthash],
        },
        signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
        additionalWitnessPaths: [str_to_path("1854'/1815'/0'/0/0")],
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182583d105e2f080eb93bad86d401545e0ce5f2221096d6477e11e6643922fa8d2ed495234dc0d667c1316ff84e572310e265edb31330448b36b7179e28dd419e0102182a030a0f00",
        result: {
            txHashHex:
        "d2c7763e9610c3440a8000cb6abfcf3f48d4ef713505066cea901a4ef576db16",
            witnesses: [
                {
                    path: str_to_path("1854'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "f8136857864a27d8ad38a09776b2bdf11556871b2ec378105bc4cafd9f0d042d94804cdc0f8f9d15ea9c06d817272cbad8ecd8b1e5bcab735f188980e49f1e07",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with change base address with staking path",
        tx: {
            ...shelleyBase,
            inputs: [
                {
                    ...inputs.utxoByron,
                    txHashHex: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
                    path: str_to_path("44'/1815'/0'/0/0"),
                },
            ],
            outputs: [outputs.externalByronMainnet, outputs.internalBaseWithStakingPath],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018282582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e88258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a0f01",
        result: {
            txHashHex:
        "e33f227432aa0ea2a2dc6ead33e6a7753fcd3a8b49a07992e64ff3f1f85a347a",
            witnesses: [
                {
                    path: str_to_path("44'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "cdfb8dc6336ed2a1e2e53fde611f4aafe55109445a28ef6e58284cff55bc289fa462e769406e8d0b5eb7ed8d00f107bbb16d1fa06666810eaf9b1d5e2b3a850d",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with change base address with staking key hash",
        tx: {
            ...shelleyBase,
            outputs: [outputs.externalByronMainnet, outputs.internalBaseWithStakingKeyHash],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018282582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e88258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f1124122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b42771a006ca79302182a030a0f01",
        result: {
            txHashHex:
        "221fc8be6180fb710f9ddb182272c4393e490819147fe615906d486c660cecfb",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "44738b34623758136543463e63856f4aa08aa01ea320afa3c0a6d9c01a4e4dd39f7d8070ff0c34c9e208e37181a19d3fa8f615362f8ba90a645e2466521eed06",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with enterprise change address",
        tx: {
            ...shelleyBase,
            outputs: [outputs.externalByronMainnet, outputs.internalEnterprise],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018282582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e882581d6114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241a006ca79302182a030a0f01",
        result: {
            txHashHex:
        "fbc145771159e952293a1fcb1a46387f8fe5625073241b24f20aaa9cd0bb6b32",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "b5bba776b131db12dd2afca16f7b6c58fa28d070c5f76f05a9a3bbfea45ecad777f89cd3bd45acd566358e819a4a719ea555465145aee5fc83bb7b19da0bb600",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with pointer change address",
        tx: {
            ...shelleyBase,
            outputs: [outputs.externalByronMainnet, outputs.internalPointer],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018282582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e88258204114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11240102031a006ca79302182a030a0f01",
        result: {
            txHashHex:
        "ff055d21446ad7b8566e2682572aab556d85a4323bcd643164be914b383daf48",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "98c8a22ed58e8f670a050c001835606c13e5a751fc3f56b503ab4d2175348f2cf1c8152b388b06a943fed6967ca80255c4268e62f8ec5a7748018a78b90f480b",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with non-reasonable account and address",
        tx: {
            ...shelleyBase,
            inputs: [inputs.utxoNonReasonable],
            outputs: [outputs.internalBaseWithStakingPathNonReasonable],
            auxiliaryData: {
                type: TxAuxiliaryDataType.ARBITRARY_HASH,
                params: {
                    hashHex: "deadbeef".repeat(8),
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182583901f90b0dfcace47bf03e88f7469a2f4fb3a7918461aa4765bfaf55f0dae260546c20562e598fb761f419dad27edcd49f4ee4f0540b8e40d4d51a006ca79302182a030a075820deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef0f01",
        result: {
            txHashHex:
        "63325834f6aee6da0eb25aa871790f414cbe4577491865dc08d46ebf00a84287",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/456'/0/0"),
                    witnessSignatureHex:
            "c96f08a7dbdd11265cddd74d256183a1254ddf0a28fedd358d3dab52f59fdd12d31db5ca851f74454e50210b1ee4957685b35558e65d6b2e6eab89dbb5eb0e0c",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with path based withdrawal",
        tx: {
            ...shelleyBase,
            withdrawals: [
                {
                    stakeCredential: {
                        type: StakeCredentialParamsType.KEY_PATH,
                        keyPath: str_to_path("1852'/1815'/0'/2/0"),
                    },
                    amount: 111,
                },
            ],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a05a1581de11d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c186f0f01",
        result: {
            txHashHex:
        "68d2de48b9e87d304fd2ec25579c44c58c3e9515ea02ca6ccc75d9432253ea70",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "3186de64d5895c5d9283f3479ab64f6133f6e74c2d3df957ac1a234669474379ae83bca716a235b23e6d679e530cd4979f64dd33d0376ef6ed8c1d2a2ca30d0e",
                },
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "b2a916392ff14ada1661b27ce769683c05bfbb8d706c12384ca7e5c4bf5a11a5990698877ec6769bbeee8d84d48f5397855e9a0c327d971e4a43f2af7c8c9204",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with script based withdrawal",
        tx: {
            ...shelleyBase,
            withdrawals: [
                {
                    stakeCredential: {
                        type: StakeCredentialParamsType.SCRIPT_HASH,
                        scriptHash: "122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277",
                    },
                    amount: 111,
                },
            ],
        },
        signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
        additionalWitnessPaths: [str_to_path("1854'/1815'/0'/2/0")],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a05a1581df1122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277186f0f01",
        result: {
            txHashHex:
        "2ea5bd20d33a2e0db121addb218c10ec811a0f4cea11b9b175d71c05ca74498b",
            witnesses: [
                {
                    path: str_to_path("1854'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "7a557941f36f482f7599eadb5819b20f304bece1334fb009eada4d6411aa1fa3aadfd4a8c98937e414d7316fc4c92677276bb92d8278f791716dc0bcc3f5c501",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with nonempty auxiliary data",
        tx: {
            ...shelleyBase,
            auxiliaryData: {
                type: TxAuxiliaryDataType.ARBITRARY_HASH,
                params: {
                    hashHex: "deadbeef".repeat(8),
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a075820deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef0f01",
        result: {
            txHashHex:
        "6dd4dbe38380331737d5d4934dab18be9fd7b9f10a300910c851c87cc9b656a9",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "0d6b8cde705b5ff772fbe861039ca27111b6b9a7ffeeddde5937b38664fa6f17329555b7b4fa5252c9f5a476bd77e3e6f40f57988406eb4661bdd78684616702",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with only script data hash",
        tx: {
            ...shelleyBase,
            outputs: [],
            scriptDataHashHex: "ffd4d009f554ba4fd8ed1f1d703244819861a9d34fd4753bcf3ff32f043ce188",
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018002182a030a0b5820ffd4d009f554ba4fd8ed1f1d703244819861a9d34fd4753bcf3ff32f043ce1880f01",
        result: {
            txHashHex:
        "7c5aac719dd3e0888deef0c59d6daba9e578d0dc27f82ff4978fc2893cdc2202",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "5c66a4f75359a62b4b32751fe30a1adbf7ed2839fd4cb762e9a4d2b086de82fca2310bcf07efc2b03086211faa19941dbe059bbfb747e128863f339720e71304",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with datum hash in output - internal address",
        tx: {
            ...shelleyBase,
            outputs: [outputs.datumHash],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818358392114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f1124122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b42771a006ca7935820ffd4d009f554ba4fd8ed1f1d703244819861a9d34fd4753bcf3ff32f043ce18802182a030a0f01",
        result: {
            txHashHex:
        "135b8b94af310e3ea23988840f5f1124ec75f4f0ff2739e0211b360d3abfc9e1",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "7718b4f9bb9ee6870dba480da3d5675ee5a3a88ad759d703c57446220bb181ede4f820afc93833113b2eef6095b153803407adcf06f7fc5787a98e96860b2209",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with datum hash in output - external address",
        tx: {
            ...shelleyBase,
            network: Networks.Testnet,
            outputs: [outputs.datumHashExternal],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018183583d105e2f080eb93bad86d401545e0ce5f2221096d6477e11e6643922fa8d2ed495234dc0d667c1316ff84e572310e265edb31330448b36b7179e28dd419e1a006ca7935820ffd4d009f554ba4fd8ed1f1d703244819861a9d34fd4753bcf3ff32f043ce18802182a030a0f00",
        result: {
            txHashHex:
        "b3a20534d53101c40d2011811e6dbf7644aa3d9baebba1e72161bf94b4a2db2b",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "3051ab97dcaab66c31be3ab1255db7176e1aaa38193e4f233694797afaa40bce48c7c0557dcc537117dc1c851ee0f132714fe9167f57c12e9fd124ae9629bb0f",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with datum hash in output with tokens",
        tx: {
            ...shelleyBase,
            outputs: [outputs.datumHashWithTokens],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818358390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c821a006ca793a1581c75a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39a2487564247542686911182f4875642475426869121a007838625820ffd4d009f554ba4fd8ed1f1d703244819861a9d34fd4753bcf3ff32f043ce18802182a030a0f01",
        result: {
            txHashHex:
        "bbe0459205842ce25aa115a4d3de7e90837cffd62082ad4fc669f1a6439ba37e",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "054834b1e47ea22011748f4eb92aa283f26859135650af09be4ff3b59aba87199cf7a0c2a9f9475055c5aed5942b7d4502b608f9bc63c945701cb0ef829df107",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with collaterals",
        tx: {
            ...shelleyBase,
            outputs: [],
            collaterals: [inputs.utxoShelley],
        },
        signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018002182a030a0d818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000f01",
        result: {
            txHashHex:
        "4e94b319a7e5a28f333932b0e2337b7c16da22f5eacae684edf2b2fbca2bf2f7",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "8c1cbf88de350d9817aab84f878005342c677319d6c16210db28477eff9355a689a210ea14c449b455f7e77165055f4de4314efbab9a3c7aceae5288f8a73f0d",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with required signers - path",
        tx: {
            ...shelleyBase,
            outputs: [],
            requiredSigners: [
                {
                    type: TxRequiredSignerType.PATH,
                    path: str_to_path("1852'/1815'/0'/0/0"),
                },
                {
                    type: TxRequiredSignerType.PATH,
                    path: str_to_path("1852'/1815'/0'/0/1"),
                },
            ],
        },
        signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018002182a030a0e82581c14c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f1124581c5a53103829a7382c2ab76111fb69f13e69d616824c62058e44f1a8b30f01",
        result: {
            txHashHex:
        "8fa4962e71a46b322be966d790b77dbdedd0046630811ccfdb3a31db95be45ef",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "0520e0a2b184511a271700ed86cd16e3d6482a2b36da8f5901b166d6327224919baae26497cd55fdc61cb1c2d018c3b4d9f97d5702625525676a98f14e63be0a",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with required signers - mixed",
        tx: {
            ...shelleyBase,
            outputs: [],
            requiredSigners: [
                {
                    type: TxRequiredSignerType.HASH,
                    hash: "fea6646c67fb467f8a5425e9c752e1e262b0420ba4b638f39514049a",
                },
                {
                    type: TxRequiredSignerType.PATH,
                    path: str_to_path("1852'/1815'/0'/0/0"),
                },
            ],
        },
        signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018002182a030a0e82581cfea6646c67fb467f8a5425e9c752e1e262b0420ba4b638f39514049a581c14c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11240f01",
        result: {
            txHashHex:
        "9e41ce0d7bcc1bbef0d96fd025054a54d1435e7a1e1e66595f2ed594dabb5faf",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "f5b2eb79b74678d3237b757dfcb8a623a8f7f5a10c5925b256da7723935bc98bbfc91ebc001d0e18c2929c611c99d43352ab33ee2dda45b6c115689ddaeeb502",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with required signers - hash",
        tx: {
            ...shelleyBase,
            outputs: [],
            requiredSigners: [
                {
                    type: TxRequiredSignerType.HASH,
                    hash: "fea6646c67fb467f8a5425e9c752e1e262b0420ba4b638f39514049a",
                },
                {
                    type: TxRequiredSignerType.HASH,
                    hash: "eea6646c67fb467f8a5425e9c752e1e262b0420ba4b638f39514049a",
                },
            ],
        },
        signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018002182a030a0e82581cfea6646c67fb467f8a5425e9c752e1e262b0420ba4b638f39514049a581ceea6646c67fb467f8a5425e9c752e1e262b0420ba4b638f39514049a0f01",
        result: {
            txHashHex:
        "4b4f95e418c5be9ffa0c1e819b8edc0a05396a8d77f75554c82727d423a49daa",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "d1f0aad96945c18f2620accc95b8f86831fb85ccc59f9f80478931435fbacae9d8c016879ed5d9274847dc882ee1b4da8abba0575b7ce613c4f2c3b59ab17808",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
]

export const testsShelleyWithCertificates: TestcaseShelley[] = [
    {
        testname: "Sign tx with a stake registration script certificate",
        tx: {
            ...shelleyBase,
            certificates: [
                {
                    type: CertificateType.STAKE_REGISTRATION,
                    params: {
                        stakeCredential: {
                            type: StakeCredentialParamsType.SCRIPT_HASH,
                            scriptHash: "122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277",
                        },
                    },
                },
            ],
        },
        signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
        additionalWitnessPaths: [str_to_path("1854'/1815'/0'/2/0")],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048182008201581c122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b42770f01",
        result: {
            txHashHex:
        "5018a1bb6eb6b020ae07409743bef6bb1e5b206db0efe11a817b43b5d9f706d2",
            witnesses: [
                {
                    path: str_to_path("1854'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "0b81fd092e5ea1768d5a4744393604f7f675c9a78d1954110af1ddebc778528240115581d8454d528a6bf965b8f2fe9344cf337c8e421c4b5d82c988e4c99d0f",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with a stake registration path certificate",
        tx: {
            ...shelleyBase,
            certificates: [
                {
                    type: CertificateType.STAKE_REGISTRATION,
                    params: {
                        stakeCredential: {
                            type: StakeCredentialParamsType.KEY_PATH,
                            keyPath: str_to_path("1852'/1815'/0'/2/0"),
                        },
                    },
                },
            ],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048182008200581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c0f01",
        result: {
            txHashHex:
        "0403d3392ff17dbacda44656291ecc0b944a473f013bd2a06bf1c5fab5bb9da1",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "99afa15f933d32063adc0bd090d65abe90cd3c4e4b1961e8783035f8c7e91496f6ed23aa75ff63d4813cf5fd3981731b0acdda30bd9e47eb82eaa6902b806300",
                },
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "cb2eb58468fa404bfa980261bb942621d7e1f92e57b7a97d5f844b40348cda29a9e93b0853364fe6732bd54aec3c7deccbe67d2b60cc78b88ffdc774c6ea160a",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with a stake delegation script certificate",
        tx: {
            ...shelleyBase,
            certificates: [
                {
                    type: CertificateType.STAKE_DELEGATION,
                    params: {
                        stakeCredential: {
                            type: StakeCredentialParamsType.SCRIPT_HASH,
                            scriptHash: "122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277",
                        },
                        poolKeyHashHex: "f61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973",
                    },
                },
            ],
        },
        signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
        additionalWitnessPaths: [str_to_path("1854'/1815'/0'/2/0")],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048183028201581c122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277581cf61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb49730f01",
        result: {
            txHashHex:
        "7effcb4880ce9f20ec6665e6616e8164b82451b31cfda6c0cb5a2e404b84525e",
            witnesses: [
                {
                    path: str_to_path("1854'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "0168102c73cde86ad48f23403efc80821b043ed3a596b39b387ebffe3c59356c371ce1def5b5c7f9c94195a3256ab03af0651e8545157cddd8cb2ef752ac3f08",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with a stake delegation path certificate",
        tx: {
            ...shelleyBase,
            certificates: [
                {
                    type: CertificateType.STAKE_DELEGATION,
                    params: {
                        stakeCredential: {
                            type: StakeCredentialParamsType.KEY_PATH,
                            keyPath: str_to_path("1852'/1815'/0'/2/0"),
                        },
                        poolKeyHashHex: "f61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973",
                    },
                },
            ],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048183028200581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c581cf61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb49730f01",
        result: {
            txHashHex:
        "4fcc342010ca1c781daafdd92c1bf5e02416743993344b95ed3b75598261e207",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "67747f72fee7a4d234519ef5a0d2bc37c1a725064830ad146542213312a4c35b405b97468bb0976e448e7df3fa41afda20c496639cb2f38ccdb52a82a9f7c501",
                },
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "957397ce80ac9e3e81496692800e4115afbd693e6f905cb9a2720b834701d4dbd87664675155eb667a7d088bc0a30eb94eb319a7723e41ca1732dcf6b51a4a08",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with a stake deregistration script certificate",
        tx: {
            ...shelleyBase,
            certificates: [
                {
                    type: CertificateType.STAKE_DEREGISTRATION,
                    params: {
                        stakeCredential: {
                            type: StakeCredentialParamsType.SCRIPT_HASH,
                            scriptHash: "122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277",
                        },
                    },
                },
            ],
        },
        signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
        additionalWitnessPaths: [str_to_path("1854'/1815'/0'/2/0")],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048182018201581c122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b42770f01",
        result: {
            txHashHex:
        "63531775cc408aed21e82f055b12949210d563413d079cc59858f5f9b5bc2ee5",
            witnesses: [
                {
                    path: str_to_path("1854'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "381f39d307eb548efe77ee6b128ec2ae363e47b9ea7370763573eb5ad5f9ebc13423e12e1bee3df3737dde0bd78666bb056995d807adfba803f6e00928b1760e",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with a stake deregistration path certificate",
        tx: {
            ...shelleyBase,
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
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048182018200581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c0f01",
        result: {
            txHashHex:
        "4e583bb4ce781fd48d9bd40dc7a4f7874c5688c16060e13a991ce99665bbc9bb",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "ffb41368026cb1c093da18058c0a2a23b06c6c4840747e814443fbe03b6990fd072f1832bc2587f504992581f03853f2db157849d7ae966ad1f9f8724910850e",
                },
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "e9943e5111a0538eb45dde4f11a960e010d5740f6b97a4585b704f1b46e36864e8373cee8cadff42999ce5df601d959da18b4ca6787806353979393305fd480f",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx and filter out witnesses with duplicate paths",
        tx: {
            ...shelleyBase,
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
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048282018200581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c82018200581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c0f01",
        result: {
            txHashHex:
        "63ef2992b6c169d1a114dccd789fb0a9a47384f0655798968667769a028432c4",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "9e83a2476927ad621e9572149f33236076b91de8e6b1472e728d8a03f3dd113c00f3811feb187ed6f428bac09d6f99972773b46a65a1f22bf573d1aad0b9e609",
                },
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "0e1cb7ded10455e317a36c366cd09248240ed5dab0d73881e954f582f14459d4c4bcfe38505f17eb09bb2a9f22283d6e3cfa30fdac843f1d7236a3edec32d807",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with pool retirement combined with another certificate",
        tx: {
            ...shelleyBase,
            inputs: [
                {
                    txHashHex: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
                    outputIndex: 0,
                    path: str_to_path("1852'/1815'/0'/0/0"),
                },
            ],
            certificates: [
                {
                    type: CertificateType.STAKE_POOL_RETIREMENT,
                    params: {
                        poolKeyPath: str_to_path("1853'/1815'/0'/0'"),
                        retirementEpoch: "10",
                    },
                },
                {
                    type: CertificateType.STAKE_REGISTRATION,
                    params: {
                        stakeCredential: {
                            type: StakeCredentialParamsType.KEY_PATH,
                            keyPath: str_to_path("1852'/1815'/0'/2/0"),
                        },
                    },
                },
            ],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a04828304581cdbfee4665e58c8f8e9b9ff02b17f32e08a42c855476a5d867c2737b70a82008200581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c0f01",
        result: {
            txHashHex: "7effac2accbe5cb16312872c63b9b1055fd2941af2f0e42221c20142c7ab5965",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "7497566e90197f44ceb30250152a9e21b66ea6cb785bad8ce0df14b4cbc80914c2777f9c40e7fe63e17dc2c6d6a44847dfe3dd02239a0dd93e661edec04d8903",
                },
                {
                    path: str_to_path("1853'/1815'/0'/0'"),
                    witnessSignatureHex:
            "b32da053d4a2682b826c37ab0273ac688f066a0768f12e18b98499c5dbad5b6a23481682c52b08949a2630073bad45c3456c469419ee1d6ad8e2a28714e7e105",
                },
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "8bc70de2e411f7d1d179096ed4e9293c49c85dd8ffc57ac531b97fe861e7233847db8a5e52e9d3dae785e42790be18bdec2b37103eecd2b2e74c720a4c584b0d",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Full test for trezor feature parity",
        tx: {
            // "protocol_magic": 764824073,
            // "network_id": 1,
            // if Networks.Mainnet differs, the test should just explicitly give these
            network: Networks.Mainnet,
            inputs: [inputs.utxoMultisig],
            outputs: [outputs.trezorParity, outputs.trezorParityDatumHash],
            fee: 42,
            ttl: 10,
            validityIntervalStart: 47,
            certificates: [
                {
                    type: CertificateType.STAKE_REGISTRATION,
                    params: {
                        stakeCredential: {
                            type: StakeCredentialParamsType.SCRIPT_HASH,
                            scriptHash: "29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd",
                        },
                    },
                },
                {
                    type: CertificateType.STAKE_DEREGISTRATION,
                    params: {
                        stakeCredential: {
                            type: StakeCredentialParamsType.SCRIPT_HASH,
                            scriptHash: "29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd",
                        },
                    },
                },
                {
                    type: CertificateType.STAKE_DELEGATION,
                    params: {
                        stakeCredential: {
                            type: StakeCredentialParamsType.SCRIPT_HASH,
                            scriptHash: "29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd",
                        },
                        poolKeyHashHex: "f61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973",
                    },
                },
            ],
            withdrawals: [
                {
                    stakeCredential: {
                        type: StakeCredentialParamsType.SCRIPT_HASH,
                        scriptHash: "29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd",
                    },
                    amount: 1000,
                },
            ],
            mint: [
                {
                    policyIdHex: "0d63e8d2c5a00cbcffbdf9112487c443466e1ea7d8c834df5ac5c425",
                    tokens: [
                        {
                            assetNameHex: "74657374436f696e",
                            amount: 7878754,
                        },
                        {
                            assetNameHex: "75657374436f696e",
                            amount: -7878754,
                        },
                    ],
                },
            ],
            auxiliaryData: {
                type: TxAuxiliaryDataType.ARBITRARY_HASH,
                params: {
                    hashHex: "58ec01578fcdfdc376f09631a7b2adc608eaf57e3720484c7ff37c13cff90fdf",
                },
            },
            scriptDataHashHex: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
        },
        signingMode: TransactionSigningMode.MULTISIG_TRANSACTION,
        additionalWitnessPaths: [str_to_path("1854'/1815'/0'/0/0"), str_to_path("1854'/1815'/0'/2/0")],
        txBody: "ab00818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018282583901eb0baa5e570cffbe2934db29df0b6a3d7c0430ee65d4c3a7ab2fefb91bc428e4720702ebd5dab4fb175324c192dc9bb76cc5da956e3c8dff821a001e8480a1581c0d63e8d2c5a00cbcffbdf9112487c443466e1ea7d8c834df5ac5c425a14874657374436f696e1a0078386283581d71477e52b3116b62fe8cd34a312615f5fcd678c94e1d6cdb86c1a3964c0158203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b702182a030a048382008201581c29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd82018201581c29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd83028201581c29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd581cf61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb497305a1581df129fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd1903e807582058ec01578fcdfdc376f09631a7b2adc608eaf57e3720484c7ff37c13cff90fdf08182f09a1581c0d63e8d2c5a00cbcffbdf9112487c443466e1ea7d8c834df5ac5c425a24874657374436f696e1a007838624875657374436f696e3a007838610b58203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70f01",
        result: {
            txHashHex: "c3637e34529fae17dbbb90c58307df0cf3b818f4c034860fff362d1ea864cca4",
            witnesses: [
                {
                    path: str_to_path("1854'/1815'/0'/0/0"),
                    witnessSignatureHex: "0d35e3f273db757d6137ff897dcfe5abf44054185a428197933a61bb0c7ad960c2090ba808ab86404fe2b407abba12041f5e9306a6f1ae0ad5b6cd4fc7b36904",
                },
                {
                    path: str_to_path("1854'/1815'/0'/2/0"),
                    witnessSignatureHex: "a164b873fa4678dc7a986ad9e4db62b638faff7f45c81af835155bc74dd3ad4b2f696734bf1e536de2baa237f92e158624920eb10269f9ee1d9910993b194a0b",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with key hash in stake credential",
        tx: {
            ...shelleyBase,
            outputs: [],
            certificates: [
                {
                    type: CertificateType.STAKE_DELEGATION,
                    params: {
                        stakeCredential: {
                            type: StakeCredentialParamsType.KEY_HASH,
                            keyHash: "29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd",
                        },
                        poolKeyHashHex: "f61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973",
                    },
                },
            ],
            withdrawals: [
                {
                    stakeCredential: {
                        type: StakeCredentialParamsType.KEY_HASH,
                        keyHash: "29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd",
                    },
                    amount: 1000,
                },
            ],
        },
        signingMode: TransactionSigningMode.PLUTUS_TRANSACTION,
        additionalWitnessPaths: [],
        txBody: "a700818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018002182a030a048183028200581c29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd581cf61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb497305a1581de129fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd1903e80f01",
        result: {
            txHashHex:
        "7ae1c854aad0469a08cd678786ed9a70791808afd6dd1a7deaae72df12430baa",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "c986cf978bb08f49f0c50032c8eafa7fddce2a748d3bb0edc0245b5a205a60c55a5ad389d17b897cb83cfe34567c446afed4fd9d64a8304d02c55b9579685d0a",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
]

export type TestcaseRejectShelley = {
    testname: string
    tx: Transaction
    signingMode: TransactionSigningMode
    additionalWitnessPaths?: BIP32Path[],
    errCls: new (...args: any[]) => ErrorBase,
    errMsg: string,
    rejectReason: InvalidDataReason,
}

export const testsShelleyRejects: TestcaseRejectShelley[] = [
    {
        testname: "Reject tx for collaterals in Ordinary transaction",
        tx: {
            ...shelleyBase,
            outputs: [],
            collaterals: [inputs.utxoShelley],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        additionalWitnessPaths: [],
        errCls: DeviceStatusError,
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
    {
        testname: "Reject tx for invalid address params: reward address",
        tx: {
            ...shelleyBase,
            outputs: [
                {
                    amount: 3003112,
                    destination: destinations.rewardsInternal,
                },
            ],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.OUTPUT_INVALID_ADDRESS_PARAMS,
    },
    {
        testname: "Reject tx for invalid address params: base address 1",
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
                                spendingScriptHash: "29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd",
                                stakingKeyHashHex:
                          "122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277",
                            },
                        },
                    },
                },
            ],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.OUTPUT_INVALID_ADDRESS_PARAMS,
    },
    {
        testname: "Reject tx for invalid address params: base address 2",
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
                                spendingScriptHash: "29fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd",
                                stakingScriptHash:  "122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277",
                            },
                        },
                    },
                },
            ],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.OUTPUT_INVALID_ADDRESS_PARAMS,
    },
    {
        testname: "Reject tx for invalid address params: enterprise",
        tx: {
            ...shelleyBase,
            outputs: [
                {
                    amount: 3003112,
                    destination: {
                        type: TxOutputDestinationType.DEVICE_OWNED,
                        params: {
                            type: AddressType.ENTERPRISE_SCRIPT,
                            params: {
                                spendingScriptHash: "122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277",
                            },
                        },
                    },
                },
            ],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.OUTPUT_INVALID_ADDRESS_PARAMS,
    },
    {
        testname: "Reject tx for invalid address params: pointer",
        tx: {
            ...shelleyBase,
            outputs: [
                {
                    amount: 3003112,
                    destination: {
                        type: TxOutputDestinationType.DEVICE_OWNED,
                        params: {
                            type: AddressType.POINTER_SCRIPT,
                            params: {
                                spendingScriptHash: "122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277",
                                stakingBlockchainPointer: {
                                    blockIndex: 1,
                                    txIndex: 2,
                                    certificateIndex: 3,
                                },
                            },
                        },
                    },
                },
            ],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.OUTPUT_INVALID_ADDRESS_PARAMS,
    },
    {
        testname: "Reject tx for datum hash without script hash part - internal address",
        tx: {
            ...shelleyBase,
            outputs: [outputs.datumHashStakePath],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
    {
        testname: "Reject tx for datum hash without script hash part - external address",
        tx: {
            ...shelleyBase,
            outputs: [outputs.datumHashStakePathExternal],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
    {
        testname: "Input and change output account mismatch",
        tx: {
            network: Networks.Mainnet,
            inputs: [inputs.utxoShelley],
            outputs: [
                {
                    amount: 1,
                    destination: {
                        type: TxOutputDestinationType.THIRD_PARTY,
                        params: {
                            addressHex: bech32_to_hex("addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r"),
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
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
    {
        testname: "Input and stake deregistration certificate account mismatch",
        tx: {
            network: Networks.Mainnet,
            inputs: [inputs.utxoShelley],
            outputs: [
                {
                    amount: 1,
                    destination: {
                        type: TxOutputDestinationType.THIRD_PARTY,
                        params: {
                            addressHex: bech32_to_hex("addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r"),
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
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
    {
        testname: "Input and withdrawal account mismatch",
        tx: {
            network: Networks.Mainnet,
            inputs: [inputs.utxoShelley],
            outputs: [
                {
                    amount: 1,
                    destination: {
                        type: TxOutputDestinationType.THIRD_PARTY,
                        params: {
                            addressHex: bech32_to_hex("addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r"),
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
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
    {
        testname: "Change output and stake deregistration account mismatch",
        tx: {
            network: Networks.Mainnet,
            inputs: [inputs.utxoShelley],
            outputs: [
                {
                    amount: 1,
                    destination: {
                        type: TxOutputDestinationType.THIRD_PARTY,
                        params: {
                            addressHex: bech32_to_hex("addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r"),
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
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
    {
        testname: "Change output and withdrawal account mismatch",
        tx: {
            network: Networks.Mainnet,
            inputs: [inputs.utxoShelley],
            outputs: [
                {
                    amount: 1,
                    destination: {
                        type: TxOutputDestinationType.THIRD_PARTY,
                        params: {
                            addressHex: bech32_to_hex("addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r"),
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
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
    {
        testname: "Stake deregistration certificate and withdrawal account mismatch",
        tx: {
            network: Networks.Mainnet,
            inputs: [inputs.utxoShelley],
            outputs: [
                {
                    amount: 1,
                    destination: {
                        type: TxOutputDestinationType.THIRD_PARTY,
                        params: {
                            addressHex: bech32_to_hex("addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r"),
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
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
    {
        testname: "Byron to Shelley transfer input account mismatch",
        tx: {
            network: Networks.Mainnet,
            inputs: [
                {
                    ...inputs.utxoByron,
                    txHashHex: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
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
                            addressHex: bech32_to_hex("addr1z90z7zqwhya6mpk5q929ur897g3pp9kkgalpreny8y304r2dcrtx0sf3dluyu4erzr3xtmdnzvcyfzekkuteu2xagx0qeva0pr"),
                        },
                    },
                },
            ],
            fee: 42,
            ttl: 10,    
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
    {
        testname: "Byron to Shelley transfer output account mismatch",
        tx: {
            network: Networks.Mainnet,
            inputs: [
                {
                    ...inputs.utxoByron,
                    txHashHex: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
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
        errMsg: "Action rejected by Ledger's security policy",
        rejectReason: InvalidDataReason.LEDGER_POLICY,
    },
]
  

const allegraBase = {
    network: Networks.Mainnet,
    inputs: [inputs.utxoShelley],
    outputs: [outputs.externalShelley],
    fee: 42,
}

export type TestcaseAllegra = {
  testname: string
  tx: Transaction
  signingMode: TransactionSigningMode
  txBody: string
  result: NetworkIdlessTestResult
}
export const testsAllegra: TestcaseAllegra[] = [
    {
        testname: "Sign tx with no ttl and no validity interval start",
        tx: {
            ...allegraBase,
            ttl: null,
            validityIntervalStart: null,
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a400818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825841017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b09da61d425f34611140102182a0f01",
        result: {
            txHashHex:
        "ca4c7bcec3ddb3108c4c2d9c89de0d260f6a85c46552ba5682e4f64aadd5546b",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "1e0b8ea56f441acf7b115a864613f4ebfb8f7f5fbbe0ede14d9970dc8be30543fc2a8e81b76cb5eaff23f630556b308e96d388d504afad28e05c6ea7afe63705",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with no ttl, but with validity interval start",
        tx: {
            ...allegraBase,
            ttl: null,
            validityIntervalStart: 47,
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825841017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b09da61d425f34611140102182a08182f0f01",
        result: {
            txHashHex:
        "2cc7dee1ed45d9349b54aa45b9ee53eca59cecb104286a01e2793ff0243f60cb",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "50143367309b1cde4ae0ab9bbbdacf1b04ae931d1ccc851118adfc921f87e402184314fa1e36ef596f0bcda479d634270e0af0c31b7452a6a2fc62bd24fb4b01",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
]

const maryBase = {
    network: Networks.Mainnet,
    inputs: [inputs.utxoShelley],
    fee: 42,
    ttl: 10,
    // FIXME: this is quite unreasonable as validity start is after ttl
    validityIntervalStart: 47,
}

export type TestcaseMary = {
  testname: string
  tx: Transaction
  signingMode: TransactionSigningMode
  txBody: string,
  txAuxiliaryData?: string,
  result: NetworkIdlessTestResult
}

export const testsMary: TestcaseMary[] = [
    {
        testname: "Sign tx with a multiasset output",
        tx: {
            ...maryBase,
            outputs: [outputs.multiassetOneToken, outputs.internalBaseWithStakingPath],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018282583901eb0baa5e570cffbe2934db29df0b6a3d7c0430ee65d4c3a7ab2fefb91bc428e4720702ebd5dab4fb175324c192dc9bb76cc5da956e3c8dff821904d2a1581c95a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39a14874652474436f696e1a007838628258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a08182f0f01",
        result: {
            txHashHex:
        "b041dabdb8330387d1cca394c20024566db8720ef760020bcfb9497f24abdcbf",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "0f9bf1b2a63f5cb769b72cb8acdc3a61a5c42adb28737aa33635a7090e97609beeccb9ea3fe3e50e0ee54136c47cab7a2e324fbe4b699fa9b3b951fa30406a06",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with a complex multiasset output",
        tx: {
            ...maryBase,
            outputs: [outputs.multiassetManyTokens, outputs.internalBaseWithStakingPath],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018282583901eb0baa5e570cffbe2934db29df0b6a3d7c0430ee65d4c3a7ab2fefb91bc428e4720702ebd5dab4fb175324c192dc9bb76cc5da956e3c8dff821904d2a2581c7eae28af2208be856f7a119668ae52a49b73725e326dc16579dcc373a34003581c1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df209015820000000000000000000000000000000000000000000000000000000000000000002581c95a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39a248456c204e69c3b16f1904d24874652474436f696e1a007838628258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a08182f0f01",
        result: {
            txHashHex:
        "1ec6fc829dbffbed585376318e4d45ab456b9960475ff12527cd062e33538293",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "7ce89b1dc81015a100fd8f8af522dffcaf7855c88833ccdd76b62954ab3d09750b8258756dbbfdef3a3e3b894f14e56811e1e9292062fb6a83df80ef9e25c30b",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with big numbers",
        tx: {
            ...maryBase,
            outputs: [outputs.multiassetBigNumber],
            fee: "24103998870869519",
            ttl: "24103998870869519",
            validityIntervalStart: "24103998870869519",
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182583901eb0baa5e570cffbe2934db29df0b6a3d7c0430ee65d4c3a7ab2fefb91bc428e4720702ebd5dab4fb175324c192dc9bb76cc5da956e3c8dff821b0055a275925d560fa1581c95a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39a14874652474436f696e1b0055a275925d560f021b0055a275925d560f031b0055a275925d560f081b0055a275925d560f0f01",
        result: {
            txHashHex:
        "1e34dbc3d931392e861d51f821da1b142f90f86851bbb59499b4fd99e8b3685f",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "26b28003fade683dcb0119bd163c0a045c9da0fab2194bec707df117ca7877328c0032e2ab531cc03f79a7710ff41a77de366b99237c696fb4cc14253fca1e08",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with a multiasset change output",
        tx: {
            ...maryBase,
            outputs: [outputs.externalShelley, outputs.multiassetChange],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000182825841017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b09da61d425f3461114018258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c821904d2a1581c95a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39a14874652474436f696e1a0078386202182a030a08182f0f01",
        result: {
            txHashHex:
        "e09e9fc0ae29329a50ff46601d3a548adb8e50bc3edebcc921395cb35c0687dc",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "23e49a2c0a3a414677e22defd5badb8999b7bbe175c755aa569e4e78ae52c96a73e59bbd8df57d094bb6bb1049bdb09d42addcd55dae2dbb5cec6f3b5df5650c",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with zero fee, TTL and validity interval start",
        tx: {
            ...maryBase,
            fee: 0,
            ttl: 0,
            validityIntervalStart: 0,
            outputs: [outputs.internalBaseWithStakingPath],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca7930200030008000f01",
        result: {
            txHashHex:
        "3412daba5d8a46205d4760b97bd6de1b67ab72444ebdc7dbb46144f0cdceb99e",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "2837fb66b87037cb8063ff7a83055efa6a8655a12a03517dcdcb19477a95a223bf9ac3645901de9fd9edb0c74feb89edc8a82e7051259504b9a45c482f5c3f02",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with mint fields with various amounts",
        tx: {
            ...maryBase,
            outputs: [],
            mint: mints.mintAmountVariety,
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a700818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018002182a030a08182f09a1581c7eae28af2208be856f7a119668ae52a49b73725e326dc16579dcc373a44000581c1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df20920581c1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df20a1b7fffffffffffffff581c1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df20b3b7fffffffffffffff0f01",
        result: {
            txHashHex: "97ae08a3ae076e948e45398856053cbcc64c405e9bbecd210b6537a59ea07911",
            "witnesses": [
                {
                    "path": [
                        2147485500,
                        2147485463,
                        2147483648,
                        0,
                        0,
                    ],
                    "witnessSignatureHex": "40103e2ea359144ba5319e0a7434bd50e8185efd44f9191c8c9016da761e8a642486ddb8d2c9e450f94df6591336e2f8cfaf155b4752d107abc177aa145e5f04",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Sign tx with mint fields among other fields",
        tx: {
            ...maryBase,
            outputs: [outputs.multiassetOneToken, outputs.internalBaseWithStakingPath],
            fee: 10,
            validityIntervalStart: 100,
            ttl: 1000,
            mint: mints.mintAmountVariety,
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a700818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018282583901eb0baa5e570cffbe2934db29df0b6a3d7c0430ee65d4c3a7ab2fefb91bc428e4720702ebd5dab4fb175324c192dc9bb76cc5da956e3c8dff821904d2a1581c95a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39a14874652474436f696e1a007838628258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca793020a031903e808186409a1581c7eae28af2208be856f7a119668ae52a49b73725e326dc16579dcc373a44000581c1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df20920581c1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df20a1b7fffffffffffffff581c1e349c9bdea19fd6c147626a5260bc44b71635f398b67c59881df20b3b7fffffffffffffff0f01",
        result: {
            txHashHex: "99bbc718b732af07999623e7497ffd1d5e7abe9aef9cc9552e46f187966a700d",
            witnesses: [
                {
                    "path": [
                        2147485500,
                        2147485463,
                        2147483648,
                        0,
                        0,
                    ],
                    "witnessSignatureHex": "0a1d57cefe09979c3b33017383f2f0409adc5731f3fcac3ff57439f6564e73aa59c083084770530c4b08267ab744c822d0d0849d4de624e01cadf05f557ca203",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
]

export const testsCatalystRegistration: TestcaseMary[] = [
    {
        testname: "Sign tx with Catalyst voting key registration metadata with base address",
        tx: {
            ...maryBase,
            outputs: [outputs.internalBaseWithStakingPath],
            auxiliaryData: {
                type: TxAuxiliaryDataType.CATALYST_REGISTRATION,
                params: {
                    votingPublicKeyHex: "4b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c",
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    nonce: 1454448,
                    rewardsDestination: destinations.internalBaseWithStakingPath.params as DeviceOwnedAddress,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a700818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a075820e9141b460aea0abb69ce113c7302c7c03690267736d6a382ee62d2a53c2ec92608182f0f01",
        txAuxiliaryData: "82a219ef64a40158204b19e27ffc006ace16592311c4d2f0cafc255eaa47" +
      "a6178ff540c0a46d07027c02582066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67" +
      "bcb39bc870d85e80358390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11" +
      "241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c041a0016317019ef65a" +
      "10158400ca3bb69cad5f471ddd32097a8501e3956e4ae0c2bf523625d1686b123dcc04af24063" +
      "0eb93bf1069c607b59bbe7d521fb8dd14a4312788bc0b72b7473ee160e80",
        result: {
            txHashHex:
        "8a91218a0b024714e111c4d050560bc00b73ab93cde00d0cf8e1955c7270eead",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "d61427f03adac3edbb551d5aaa04a8446df2b5c52fba4cc3af88e2256a04d5228b351bc581675b102825d1994a70375fce6ac571382adfc1e67afc3eed121804",
                },
            ],
            auxiliaryDataSupplement: {
                type: TxAuxiliaryDataSupplementType.CATALYST_REGISTRATION,
                auxiliaryDataHashHex: "e9141b460aea0abb69ce113c7302c7c03690267736d6a382ee62d2a53c2ec926",
                catalystRegistrationSignatureHex: "0ca3bb69cad5f471ddd32097a8501e3956e4ae0c2bf523625d1686b123dcc04af240630eb93bf1069c607b59bbe7d521fb8dd14a4312788bc0b72b7473ee160e",
            },
        },
    },
    {
        testname: "Sign tx with Catalyst voting key registration metadata with stake address",
        tx: {
            ...maryBase,
            outputs: [outputs.internalBaseWithStakingPath],
            auxiliaryData: {
                type: TxAuxiliaryDataType.CATALYST_REGISTRATION,
                params: {
                    votingPublicKeyHex: "4b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c",
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    nonce: 1454448,
                    rewardsDestination: destinations.rewardsInternal.params as DeviceOwnedAddress,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a700818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a075820d19f7cb4d48a6ae8d370c64d2a42fca1f61d6b2cf3d0c0c02801541811338deb08182f0f01",
        txAuxiliaryData: "82a219ef64a40158204b19e27ffc006ace16592311c4d2f0cafc255eaa47" +
      "a6178ff540c0a46d07027c02582066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67" +
      "bcb39bc870d85e803581de11d227aefa4b773149170885aadba30aab3127cc611ddbc4999def6" +
      "1c041a0016317019ef65a10158401514b6bbc582b33edcf5fa30ec04dcaa62128de8755c78676" +
      "8ae5922132c2aa50b9ba17be28072de979f45b0f429c7f5d489c549a1e22bc8e7d0b2445c1036" +
      "0980",
        result: {
            txHashHex:
        "6de6579e67a04229ba475973286345d33fbfb4aa8bc6c4b56edd6283a3b44ef5",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "8f4dc1391f764d2ac7733191d46a713498ac17960b6c67f32a7f1c593baa975bd1c5077fc7373f99b2d3703b0a962160e3a05c48846df6fa3c0b5e5798418700",
                },
            ],
            auxiliaryDataSupplement: {
                type: TxAuxiliaryDataSupplementType.CATALYST_REGISTRATION,
                auxiliaryDataHashHex: "d19f7cb4d48a6ae8d370c64d2a42fca1f61d6b2cf3d0c0c02801541811338deb",
                catalystRegistrationSignatureHex: "1514b6bbc582b33edcf5fa30ec04dcaa62128de8755c786768ae5922132c2aa50b9ba17be28072de979f45b0f429c7f5d489c549a1e22bc8e7d0b2445c103609",
            },
        },
    },
]

export type InvalidTokenBundleOrderingTestcase = {
  testname: string,
  tx: Transaction,
  signingMode: TransactionSigningMode
  errCls: new (...args: any[]) => ErrorBase,
  errMsg: string,
  rejectReason: InvalidDataReason,
}

export const testsInvalidTokenBundleOrdering: InvalidTokenBundleOrderingTestcase[] = [
    {
        testname: "Reject tx where asset groups are not ordered",
        tx: {
            ...maryBase,
            outputs: [outputs.multiassetInvalidAssetGroupOrdering],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Invalid data supplied to Ledger",
        rejectReason: InvalidDataReason.MULTIASSET_INVALID_TOKEN_BUNDLE_ORDERING,
    },
    {
        testname: "Reject tx where asset groups are not unique",
        tx: {
            ...maryBase,
            outputs: [outputs.multiassetAssetGroupsNotUnique],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Invalid data supplied to Ledger",
        rejectReason: InvalidDataReason.MULTIASSET_INVALID_TOKEN_BUNDLE_NOT_UNIQUE,
    },
    {
        testname: "Reject tx where tokens within an asset group are not ordered - alphabetical",
        tx: {
            ...maryBase,
            outputs: [outputs.multiassetInvalidTokenOrderingSameLength],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Invalid data supplied to Ledger",
        rejectReason: InvalidDataReason.MULTIASSET_INVALID_ASSET_GROUP_ORDERING,
    },
    {
        testname: "Reject tx where tokens within an asset group are not ordered - length",
        tx: {
            ...maryBase,
            outputs: [outputs.multiassetInvalidTokenOrderingDifferentLengths],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Invalid data supplied to Ledger",
        rejectReason: InvalidDataReason.MULTIASSET_INVALID_ASSET_GROUP_ORDERING,
    },
    {
        testname: "Reject tx where tokens within an asset group are not unique",
        tx: {
            ...maryBase,
            outputs: [outputs.multiassetTokensNotUnique],
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Invalid data supplied to Ledger",
        rejectReason: InvalidDataReason.MULTIASSET_INVALID_ASSET_GROUP_NOT_UNIQUE,
    },
    {
        testname: "Reject tx with mint fields with invalid canonical ordering of policies",
        tx: {
            ...maryBase,
            outputs: [],
            mint: mints.mintInvalidCanonicalOrderingPolicy,
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Invalid data supplied to Ledger",
        rejectReason: InvalidDataReason.MULTIASSET_INVALID_TOKEN_BUNDLE_ORDERING,
    },
    {
        testname: "Reject tx with mint fields with invalid canonical ordering of asset names",
        tx: {
            ...maryBase,
            outputs: [],
            mint: mints.mintInvalidCanonicalOrderingAssetName,
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: "Invalid data supplied to Ledger",
        rejectReason: InvalidDataReason.MULTIASSET_INVALID_ASSET_GROUP_ORDERING,
    },
]

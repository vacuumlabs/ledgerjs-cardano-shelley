import type { Certificate, PoolKey, PoolOwner, PoolRegistrationParams, PoolRewardAccount, Relay, Transaction, TxInput, TxOutput } from "../../../src/Ada"
import { StakeCredentialParamsType } from "../../../src/Ada"
import { PoolKeyType, PoolRewardAccountType } from "../../../src/Ada"
import { CertificateType, Networks, PoolOwnerType, RelayType, TxOutputDestinationType, utils } from "../../../src/Ada"
import { TransactionSigningMode } from '../../../src/types/public'
import { str_to_path } from "../../../src/utils/address"
import type { TestcaseShelley } from "./signTx"

export const inputs: Record<
  | 'utxoNoPath'
  | 'utxoWithPath0'
  | 'utxoWithPath1'
  , TxInput
> = {
    utxoNoPath: {
        txHashHex:
      "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
        outputIndex: 0,
        path: null,
    },
    utxoWithPath0: {
        txHashHex: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
        outputIndex: 0,
        path: str_to_path("1852'/1815'/0'/0/0"),
    },
    utxoWithPath1: {
        txHashHex: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
        outputIndex: 0,
        path: str_to_path("1852'/1815'/0'/0/1"),
    },
}

export const outputs: Record<'external', TxOutput> = {
    external: {
        amount: "1",
        destination: {
            type: TxOutputDestinationType.THIRD_PARTY,
            params: {
                addressHex: utils.buf_to_hex(
                    utils.bech32_decodeAddress(
                        "addr1q97tqh7wzy8mnx0sr2a57c4ug40zzl222877jz06nt49g4zr43fuq3k0dfpqjh3uvqcsl2qzwuwsvuhclck3scgn3vys6wkj5d"
                    )
                ),
            },
        },
    },
}


const txBase: Transaction = {
    network: Networks.Mainnet,
    inputs: [inputs.utxoNoPath],
    outputs: [outputs.external],
    fee: 42,
    ttl: 10,
}

const poolKeys: Record<
  | 'poolKeyPath'
  | 'poolKeyHash'
  , PoolKey
> = {
    poolKeyPath: {
        type: PoolKeyType.DEVICE_OWNED,
        params: {
            path: str_to_path("1853'/1815'/0'/0'"),
        },
    },
    poolKeyHash: {
        type: PoolKeyType.THIRD_PARTY,
        params: {
            keyHashHex: "13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad",
        },
    },
}

const stakingHashOwners: Record<
  | 'owner0'
  | 'owner1'
  , PoolOwner
> = {
    owner0: {
        type: PoolOwnerType.THIRD_PARTY,
        params: {
            stakingKeyHashHex:
        "794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad",
        },
    },
    owner1: {
        type: PoolOwnerType.THIRD_PARTY,
        params: {
            stakingKeyHashHex:
        "0bd5d796f5e54866a14300ec2a18d706f7461b8f0502cc2a182bc88d",
        },
    },
}

const stakingPathOwners: Record<
  | 'owner0'
  | 'owner1'
  , PoolOwner
> = {
    owner0: {
        type: PoolOwnerType.DEVICE_OWNED,
        params: {
            stakingPath: str_to_path("1852'/1815'/0'/2/0"), // hash: 1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c
        },
    },
    owner1: {
        type: PoolOwnerType.DEVICE_OWNED,
        params: {
            stakingPath: str_to_path("1852'/1815'/0'/2/1"),
        },
    },
}

// No need for explicit type
export const poolOwnerVariationSet = {
    noOwners: [] as PoolOwner[],
    singleHashOwner: [stakingHashOwners.owner0],
    singlePathOwner: [stakingPathOwners.owner0],
    twoHashOwners: [stakingHashOwners.owner0, stakingHashOwners.owner1],
    twoPathOwners: [stakingPathOwners.owner0, stakingPathOwners.owner1],
    twoCombinedOwners: [stakingPathOwners.owner0, stakingHashOwners.owner0],
}

const poolRewardAccounts: Record<
  | 'poolRewardAccountPath'
  | 'poolRewardAccountHash'
  , PoolRewardAccount
> = {
    poolRewardAccountPath: {
        type: PoolRewardAccountType.DEVICE_OWNED,
        params: {
            path: str_to_path("1852'/1815'/3'/2/0"),
        },
    },
    poolRewardAccountHash: {
        type: PoolRewardAccountType.THIRD_PARTY,
        params: {
            rewardAccountHex: "e1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad",
        },
    },
}

const relays: Record<
  | 'singleHostIPV4Relay0'
  | 'singleHostIPV4Relay1'
  | 'singleHostIPV6Relay'
  | 'singleHostNameRelay'
  | 'multiHostNameRelay'
  , Relay
> = {
    singleHostIPV4Relay0: {
        type: RelayType.SINGLE_HOST_IP_ADDR,
        params: {
            portNumber: 3000,
            ipv4: "54.228.75.154", // "36e44b9a"
            ipv6: null,
        },
    },
    singleHostIPV4Relay1: {
        type: RelayType.SINGLE_HOST_IP_ADDR,
        params: {
            portNumber: 4000,
            ipv4: "54.228.75.154", // "36e44b9a"
            ipv6: null,
        },
    },
    singleHostIPV6Relay: {
        type: RelayType.SINGLE_HOST_IP_ADDR,
        params: {
            portNumber: 3000,
            ipv4: "54.228.75.155", // "36e44b9b"
            ipv6: "24ff:7801:33a2:e383:a5c4:340a:07c2:76e5",
        },
    },
    singleHostNameRelay: {
        type: RelayType.SINGLE_HOST_HOSTNAME,
        params: {
            portNumber: 3000,
            dnsName: "aaaa.bbbb.com",
        },
    },
    multiHostNameRelay: {
        type: RelayType.MULTI_HOST,
        params: {
            dnsName: "aaaa.bbbc.com",
        },
    },
}

// No need for explicit type
export const relayVariationSet = {
    noRelays: [] as Relay[],
    singleHostIPV4Relay: [relays.singleHostIPV4Relay0],
    singleHostIPV6Relay: [relays.singleHostIPV6Relay],
    singleHostNameRelay: [relays.singleHostNameRelay],
    multiHostNameRelay: [relays.multiHostNameRelay], // reportedly not implemented
    twoIPV4Relays: [relays.singleHostIPV4Relay0, relays.singleHostIPV4Relay1],
    combinedIPV4SingleHostNameRelays: [
        relays.singleHostIPV4Relay0,
        relays.singleHostNameRelay,
    ],
    combinedIPV4IPV6Relays: [
        relays.singleHostIPV4Relay1,
        relays.singleHostIPV6Relay,
    ],
    allRelays: [
        relays.singleHostIPV4Relay0,
        relays.singleHostIPV6Relay,
        relays.singleHostNameRelay,
        relays.multiHostNameRelay,
    ],
}

export const defaultPoolRegistration: PoolRegistrationParams = {
    poolKey: poolKeys.poolKeyHash,
    vrfKeyHashHex:
    "07821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d084450",
    pledge: "50000000000",
    cost: "340000000",
    margin: {
        numerator: 3,
        denominator: 100,
    },
    rewardAccount: poolRewardAccounts.poolRewardAccountHash,
    poolOwners: poolOwnerVariationSet.singlePathOwner,
    relays: relayVariationSet.singleHostIPV4Relay,
    metadata: {
        metadataUrl: "https://www.vacuumlabs.com/sampleUrl.json",
        metadataHashHex:
      "cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb",
    },
}

export const certificates: Record<
  | 'stakeDelegation'
  | 'stakeRegistration'
  | 'poolRegistrationDefault'
  | 'poolRegistrationMixedOwners'
  | 'poolRegistrationMixedOwnersAllRelays'
  | 'poolRegistrationMixedOwnersIpv4SingleHostRelays'
  | 'poolRegistrationMixedOwnersIpv4Ipv6Relays'
  | 'poolRegistrationNoRelays'
  | 'poolRegistrationNoMetadata'
  | 'poolRegistrationWrongMargin'
  | 'poolRegistrationOperatorNoOwnersNoRelays'
  | 'poolRegistrationOperatorMultipleOwnersAllRelays'
  | 'poolRegistrationOperatorOneOwnerOperatorNoRelays'
  , Certificate
> = {
    // for negative tests 
    stakeDelegation: {
        type: CertificateType.STAKE_DELEGATION,
        params: {
            stakeCredential: {
                type: StakeCredentialParamsType.KEY_PATH,
                keyPath: str_to_path("1852'/1815'/0'/2/0"),
            },
            poolKeyHashHex: "f61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973",
        },
    },
    stakeRegistration: {
        type: 0,
        params: {
            stakeCredential: {
                type: StakeCredentialParamsType.KEY_PATH,
                keyPath: str_to_path("1852'/1815'/0'/2/0"),
            },
        },
    },
    poolRegistrationDefault: {
        type: CertificateType.STAKE_POOL_REGISTRATION,
        params: defaultPoolRegistration,
    },
    poolRegistrationMixedOwners: {
        type: CertificateType.STAKE_POOL_REGISTRATION,
        params: {
            ...defaultPoolRegistration,
            poolOwners: poolOwnerVariationSet.twoCombinedOwners,
        },
    },
    poolRegistrationMixedOwnersAllRelays: {
        type: CertificateType.STAKE_POOL_REGISTRATION,
        params: {
            ...defaultPoolRegistration,
            poolOwners: poolOwnerVariationSet.twoCombinedOwners,
            relays: relayVariationSet.allRelays,
        },
    },
    poolRegistrationMixedOwnersIpv4SingleHostRelays: {
        type: CertificateType.STAKE_POOL_REGISTRATION,
        params: {
            ...defaultPoolRegistration,
            poolOwners: poolOwnerVariationSet.twoCombinedOwners,
            relays: relayVariationSet.combinedIPV4SingleHostNameRelays,
        },
    },
    poolRegistrationMixedOwnersIpv4Ipv6Relays: {
        type: CertificateType.STAKE_POOL_REGISTRATION,
        params: {
            ...defaultPoolRegistration,
            poolOwners: poolOwnerVariationSet.twoCombinedOwners,
            relays: relayVariationSet.combinedIPV4IPV6Relays,
        },
    },
    poolRegistrationNoRelays: {
        type: CertificateType.STAKE_POOL_REGISTRATION,
        params: {
            ...defaultPoolRegistration,
            relays: relayVariationSet.noRelays,
        },
    },
    poolRegistrationNoMetadata: {
        type: CertificateType.STAKE_POOL_REGISTRATION,
        params: {
            ...defaultPoolRegistration,
            metadata: null,
        },
    },
    poolRegistrationWrongMargin: {
        type: CertificateType.STAKE_POOL_REGISTRATION,
        params: {
            ...defaultPoolRegistration,
            margin: {
                numerator: "3",
                denominator: "1",
            },
        },
    },
    poolRegistrationOperatorNoOwnersNoRelays: {
        type: CertificateType.STAKE_POOL_REGISTRATION,
        params: {
            ...defaultPoolRegistration,
            poolKey: poolKeys.poolKeyPath,
            poolOwners: poolOwnerVariationSet.noOwners,
            relays: relayVariationSet.noRelays,
        },
    },
    poolRegistrationOperatorOneOwnerOperatorNoRelays: {
        type: CertificateType.STAKE_POOL_REGISTRATION,
        params: {
            ...defaultPoolRegistration,
            poolKey: poolKeys.poolKeyPath,
            rewardAccount: poolRewardAccounts.poolRewardAccountPath,
            poolOwners: poolOwnerVariationSet.singleHashOwner,
            relays: relayVariationSet.noRelays,
        },
    },
    poolRegistrationOperatorMultipleOwnersAllRelays: {
        type: CertificateType.STAKE_POOL_REGISTRATION,
        params: {
            ...defaultPoolRegistration,
            poolKey: poolKeys.poolKeyPath,
            poolOwners: poolOwnerVariationSet.twoHashOwners,
            relays: relayVariationSet.allRelays,
        },
    },
}

// export const withdrawals: Record<
//   | 'withdrawal0'
//   , Withdrawal
// > = {
//     withdrawal0: {
//         stakeCredential: {
//             type: StakeCredentialParamsType.KEY_PATH,
//             keyPath: str_to_path("1852'/1815'/0'/2/0"),
//         },
//         amount: "111",
//     },
// }

// export type Testcase = {
//   testname: string
//   tx: Transaction
//   txBody?: string,
//   result: NetworkIdlessTestResult
// }

export const poolRegistrationOwnerTestcases: TestcaseShelley[] = [
    {
        testname: "Witness valid multiple mixed owners all relays pool registration",
        tx: {
            ...txBase,
            certificates: [certificates.poolRegistrationMixedOwnersAllRelays],
        },
        signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581c13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad82581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c581c794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad848400190bb84436e44b9af68400190bb84436e44b9b500178ff2483e3a2330a34c4a5e576c2078301190bb86d616161612e626262622e636f6d82026d616161612e626262632e636f6d82782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb0f01",
        result: {
            txHashHex:
        "b6ad77bb329945299a387446998e5750c6f1dcfff3a3ed7295c2c3c105083888",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "340f068744fa9aa8375a927569e1d2b34717fa2d3d0b1e3ddcfe1b6f2ba285654f1c241e27478d6af83da76e2bcc5295bd2808d8da48af0b4e993ea2af3dcf07",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Witness valid single path owner ipv4 relay pool registration",
        tx: {
            ...txBase,
            certificates: [certificates.poolRegistrationDefault],
        },
        signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581c13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad81581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c818400190bb84436e44b9af682782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb0f01",
        result: {
            txHashHex:
        "842855c4ceded0d83d718978a5b18a99afbcf33cbe8eb21b86a118ba71f73af0",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "01553602c0880980ed54a27a9927fd119bb647f7c2fe909544ab808712f2c35dcd953ac5458e2b0211526c9ac36d2d9845641f39b57eaa8d84a9d0d2af761d07",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Witness valid multiple mixed owners ipv4 relay pool registration",
        tx: {
            ...txBase,
            certificates: [certificates.poolRegistrationMixedOwners],
        },
        signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a0304818a03581c13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad82581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c581c794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad818400190bb84436e44b9af682782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb0f01",
        result: {
            txHashHex:
        "bd935accb6489fd823397194b635456ca04e4094a55dec934fd4efb87025a92f",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "dc90b84e0cf061d43c0686ce9ba5c625cd51023d9637531b38275f9a116162016b176b6e8c35a35833a50d0f860a7e7d58cda3bc041e4574ad11688cf5c68e05",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Witness valid multiple mixed owners mixed ipv4, single host relays pool registration",
        tx: {
            ...txBase,
            certificates: [certificates.poolRegistrationMixedOwnersIpv4SingleHostRelays],
        },
        signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581c13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad82581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c581c794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad828400190bb84436e44b9af68301190bb86d616161612e626262622e636f6d82782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb0f01",
        result: {
            txHashHex:
        "25ab245b246144fe919fc496bafa2ec91832c166deeb0f5d93092b190e882ec3",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "1538dc1d08a842875b27ccfd9ba84ccc588c191ef4a5a451af8ba73ee1637451bade160b9859afe7437dbabfe5017b8d48c55b54494f240db755b55d03b19309",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Witness valid multiple mixed owners mixed ipv4 ipv6 relays pool registration",
        tx: {
            ...txBase,
            certificates: [certificates.poolRegistrationMixedOwnersIpv4Ipv6Relays],
        },
        signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581c13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad82581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c581c794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad828400190fa04436e44b9af68400190bb84436e44b9b500178ff2483e3a2330a34c4a5e576c20782782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb0f01",
        result: {
            txHashHex:
        "284f27c5f92d379181047e635b9c939cf4d2d5fbb52e933d19c1239d1305b221",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "726ebaaca21d2f4cc863acddcc097fde4c1b213cd61ea81800fc8a60290b15286ce4c128c2fbb62dcaed3a5d89a7585afc61368f10bc0436201108fd0c2f510c",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Witness valid single path owner no relays pool registration",
        tx: {
            ...txBase,
            certificates: [certificates.poolRegistrationNoRelays],
        },
        signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581c13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad81581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c8082782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb0f01",
        result: {
            txHashHex:
        "cc229d17c6a6fa0b6e122bad4a2d606f06c968cbbacf470bf9d9752706c0d615",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "63dc0b738d825b7ec81fc3af0aee85ec45d2f867d521653412d386b180a868b17a32a850ca5b3fe59bd90d4d682796d8aedee4477def1e44d6458ba112419d0d",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
    // works as a private pool not visible in yoroi, daedalus, etc.
        testname: "Witness pool registration with no metadata",
        tx: {
            ...txBase,
            certificates: [certificates.poolRegistrationNoMetadata],
        },
        signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581c13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad81581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c818400190bb84436e44b9af6f60f01",
        result: {
            txHashHex:
        "7bc723b062c5b4b6ae2bae0eca0421f53304024119a943674ce284851d8a721e",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "afe3234f647db594ae17c520ada1bc2a7eabd2f4d2e414f61cb9fa31ff7f5f6fcf8185bdbfdb16ca4c4b4fefe0da296a274dc1558191ef3b6e55046da213d701",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Witness pool registration without outputs",
        tx: {
            ...txBase,
            outputs: [],
            certificates: [certificates.poolRegistrationMixedOwnersAllRelays],
        },
        signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018002182a030a04818a03581c13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad82581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c581c794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad848400190bb84436e44b9af68400190bb84436e44b9b500178ff2483e3a2330a34c4a5e576c2078301190bb86d616161612e626262622e636f6d82026d616161612e626262632e636f6d82782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb0f01",
        result: {
            txHashHex:
        "036d541c7dfc377f857ba4cc5aec0337180893cdbda46b182f12cae988817b56",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/2/0"),
                    witnessSignatureHex:
            "3a211fa972da1c5998a90a2dda1480d533f0a93b20b3b2dd44239113e1eb4c52422ab22574b5c430dbd3dc6b8fabb4d2fd4cde5ba8ef36c0fb7828a7079c430f",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
]

export const poolRegistrationOperatorTestcases: TestcaseShelley[] = [
    {
        testname: "Witness pool registration as operator with no owners and no relays",
        tx: {
            ...txBase,
            inputs: [inputs.utxoWithPath0],
            certificates: [certificates.poolRegistrationOperatorNoOwnersNoRelays],
        },
        signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581cdbfee4665e58c8f8e9b9ff02b17f32e08a42c855476a5d867c2737b7582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad808082782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb0f01",
        result: {
            txHashHex:
        "59e83a6409ff2cd2ee215a3e9142da2672085ca50fdddc18ed54290aa36a82aa",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "b2d97387235215398d65e09371b6543e74481e29b579ca1fae292dbc65578b5b42aa3be795af67acb00012643587813841496392a68ed5e9493144858fedd400",
                },
                {
                    path: str_to_path("1853'/1815'/0'/0'"),
                    witnessSignatureHex:
            "47b567b6ea4d9d6fe0eb11558ee2915a0cc07bd22a432bfdb908685d4acaea802925ee233bc3a9b6a49ebe9cfaeb6254e54bb6c0555e4ac640da5c99a585b006",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Witness pool registration as operator with one owner and no relays",
        tx: {
            ...txBase,
            inputs: [inputs.utxoWithPath0],
            certificates: [certificates.poolRegistrationOperatorOneOwnerOperatorNoRelays],
        },
        signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581cdbfee4665e58c8f8e9b9ff02b17f32e08a42c855476a5d867c2737b7582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1eef1689a3970b7880dcf3cb4ca9f22453b3833824fea34105117c84081581c794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad8082782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb0f01",
        result: {
            txHashHex:
        "2f41dbce90ecc13d154e1e5e3d3503bd7e43a1a8edae6bca721ce35ba905ed10",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "c0109f65d6aa6cef68b8a64ca6d9a540e5091b99b3f82081c5369931e067e2eca4ff6735322a8e0ee61be72cd8b02fb1cc394203a6801539e927246fbbd59503",
                },
                {
                    path: str_to_path("1853'/1815'/0'/0'"),
                    witnessSignatureHex:
            "3465a02596afd308ef2ff5652defa62ca080ba947dbd977363d502e7f451f7af4809e3d4fbd01077a20185feb7f0e5270a2ee001bb0216462fac17fc226e7608",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
    {
        testname: "Witness pool registration as operator with multiple owners and all relays",
        tx: {
            ...txBase,
            inputs: [inputs.utxoWithPath0],
            certificates: [certificates.poolRegistrationOperatorMultipleOwnersAllRelays],
        },
        signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR,
        additionalWitnessPaths: [],
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581cdbfee4665e58c8f8e9b9ff02b17f32e08a42c855476a5d867c2737b7582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad82581c794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad581c0bd5d796f5e54866a14300ec2a18d706f7461b8f0502cc2a182bc88d848400190bb84436e44b9af68400190bb84436e44b9b500178ff2483e3a2330a34c4a5e576c2078301190bb86d616161612e626262622e636f6d82026d616161612e626262632e636f6d82782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb0f01",
        result: {
            txHashHex:
        "caa0503401960eabd4747707ba14100d41567aa8c4e0079257920b787ae778e7",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex:
            "03c680921585607dfdf0fc2c37a75fd9beaa214be9866cba00d0334ff402c9e5f508c7fd535aff41e4c9f2f380b420507c39de2c109722440e4f6b3b33bc6004",
                },
                {
                    path: str_to_path("1853'/1815'/0'/0'"),
                    witnessSignatureHex:
            "5a797cde87da1309b68be01adc96205c6c6118052e94ea3a1ba40d2c53d2eaddaeda90bc3348729ef18d85e4000fe081a37f358e244714504f7f2c413cc0a400",
                },
            ],
            auxiliaryDataSupplement: null,
        },
    },
]

import { utils } from "../../../../lib/Ada";
import { str_to_path } from "../../test_utils";

export const inputs = {
  utxoNoPath: {
    txHashHex: "3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7",
    outputIndex: 0
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
};
  
export const outputs = {
  external: {
    amountStr: "1",
    addressHex: utils.buf_to_hex(utils.bech32_decodeAddress(
      "addr1q97tqh7wzy8mnx0sr2a57c4ug40zzl222877jz06nt49g4zr43fuq3k0dfpqjh3uvqcsl2qzwuwsvuhclck3scgn3vys6wkj5d"
    ))
  }
}

export const sampleFeeStr = "42";
export const sampleTtlStr = "10";

export const poolMetadataVariations = {
  poolMetadataDefault: {
    metadataUrl: "https://www.vacuumlabs.com/sampleUrl.json",
    metadataHashHex: "cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb"
  },
  poolMetadataUrlTooLong: {
    metadataUrl: "https://www.vacuumlabs.com/aaaaaaaaaaaaaaaaaaaaaaaasampleUrl.json",
    metadataHashHex: "cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb"
  },
  poolMetadataInvalidHexLength: {
    metadataUrl: "https://www.vacuumlabs.com/sampleUrl.json",
    metadataHashHex: "6bf124f217d0e5a0a8adb1dbd8540e1334280d49ab861127868339f43b3948"
  },
  poolMetadataInvalidUrl: {
    metadataUrl: "\n",
    metadataHashHex: "6bf124f217d0e5a0a8adb1dbd8540e1334280d49ab861127868339f43b3948"
  },
  poolMetadataMissingHash: {
    metadataUrl: "https://www.vacuumlabs.com/sampleUrl.json"
  },
  poolMetadataMissingUrl: {
    metadataHashHex: "cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb"
  },
  poolMetadataNone: null
}

const stakingHashOwners = {
  owner0: {
    stakingKeyHashHex: "794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad"
  },
  owner1: {
    stakingKeyHashHex: "0bd5d796f5e54866a14300ec2a18d706f7461b8f0502cc2a182bc88d"
  }
}

const stakingPathOwners = {
  owner0: {
    stakingPath: str_to_path("1852'/1815'/0'/2/0") // hash: 1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c
  },
  owner1: {
    stakingPath: str_to_path("1852'/1815'/0'/2/1")
  }
}

const poolOwnerVariationSet = {
  noOwners: [],
  singleHashOwner: [stakingHashOwners.owner0],
  singlePathOwner: [stakingPathOwners.owner0],
  twoHashOwners: [
    stakingHashOwners.owner0,
    stakingHashOwners.owner1
  ],
  twoPathOwners: [
    stakingPathOwners.owner0,
    stakingPathOwners.owner1
  ],
  twoCombinedOwners: [
    stakingPathOwners.owner0,
    stakingHashOwners.owner0
  ]
}

export const relays = {
  singleHostIPV4Relay0: {
    type: 0,
    params: {
      portNumber: 3000,
      ipv4: "54.228.75.154", // "36e44b9a"
      ipv6: null
    }
  },
  singleHostIPV4Relay1: {
    type: 0,
    params: {
      portNumber: 4000,
      ipv4: "54.228.75.154", // "36e44b9a"
      ipv6: null
    }
  },
  singleHostIPV4RelayMissingPort: {
    type: 0,
    params: {
      portNumber: null,
      ipv4: "54.228.75.154", // "36e44b9a"
      ipv6: null
    }
  },
  singleHostIPV4RelayMissingIpv4: {
    type: 0,
    params: {
      portNumber: 3000,
      ipv4: null,
      ipv6: null
    }
  },
  singleHostIPV6Relay: {
    type: 0,
    params: {
      portNumber: 3000,
      ipv4: "54.228.75.155", // "36e44b9b"
      ipv6: "24ff:7801:33a2:e383:a5c4:340a:07c2:76e5"
    }
  },
  singleHostNameRelay: {
    type: 1,
    params: {
      portNumber: 3000,
      dnsName: "aaaa.bbbb.com"
    }
  },
  singleHostNameRelayMissingPort: {
    type: 1,
    params: {
      portNumber: null,
      dnsName: "aaaa.bbbb.com"
    }
  },
  singleHostNameRelayMissingDns: {
    type: 1,
    params: {
      portNumber: 3000,
      dnsName: null
    }
  },
  multiHostNameRelay: {
    type: 2,
    params: {
      dnsName: "aaaa.bbbc.com"
    }
  },
  multiHostNameRelayMissingDns: {
    type: 2,
    params: {
      dnsName: null
    }
  }
}

const relayVariationSet = {
  noRelays: [],
  singleHostIPV4Relay: [relays.singleHostIPV4Relay0],
  singleHostIPV6Relay: [relays.singleHostIPV6Relay],
  singleHostNameRelay: [relays.singleHostNameRelay],
  multiHostNameRelay: [relays.multiHostNameRelay], // reportedly not implemented
  twoIPV4Relays: [relays.singleHostIPV4Relay0, relays.singleHostIPV4Relay1],
  combinedIPV4SingleHostNameRelays: [relays.singleHostIPV4Relay0, relays.singleHostNameRelay],
  combinedIPV4IPV6Relays: [relays.singleHostIPV4Relay1, relays.singleHostIPV6Relay],
  allRelays: [
    relays.singleHostIPV4Relay0,
    relays.singleHostIPV6Relay,
    relays.singleHostNameRelay,
    relays.multiHostNameRelay
  ]
}

const defaultPoolRegistration = {
  type: 3,
  poolRegistrationParams: {
    poolKey: {
      keyHashHex: "13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad",
    },
    vrfKeyHashHex: "07821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d084450",
    pledgeStr: "50000000000",
    costStr: "340000000",
    margin: {
      numeratorStr: "3",
      denominatorStr: "100",
    },
    rewardAccountHex: "e1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad",
    poolOwners: poolOwnerVariationSet.singlePathOwner,
    relays: relayVariationSet.singleHostIPV4Relay,
    metadata: poolMetadataVariations.poolMetadataDefault
  }
}

export const certificates = {
  stakeRegistration: {
    type: 0,
    path: str_to_path("1852'/1815'/0'/2/0")
  },
  stakeDeregistration: {
    type: 1,
    path: str_to_path("1852'/1815'/0'/2/0")
  },
  stakeDelegation: {
    type: 2,
    path: str_to_path("1852'/1815'/0'/2/0"),
    poolKeyHashHex: "f61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973"
  },
  poolRetirement: {
    type: 4,
    poolRetirementParams: {
      poolKeyPath: str_to_path("1853'/1815'/0'/0'"),
      retirementEpochStr: "10",
    }
  },
  poolRegistrationDefault: {
    ...defaultPoolRegistration
  },
  poolRegistrationMixedOwners: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      poolOwners: poolOwnerVariationSet.twoCombinedOwners
    }
  },
  poolRegistrationMixedOwnersAllRelays: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      poolOwners: poolOwnerVariationSet.twoCombinedOwners,
      relays: relayVariationSet.allRelays
    }
  },
  poolRegistration2PathOwners: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      poolOwners: poolOwnerVariationSet.twoPathOwners
    }
  },
  poolRegistration2HashOwners: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      poolOwners: poolOwnerVariationSet.twoHashOwners
    }
  },
  poolRegistrationNoOwners: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      poolOwners: poolOwnerVariationSet.noOwners
    }
  },
  poolRegistrationMixedOwnersIpv4SingleHostRelays: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      poolOwners: poolOwnerVariationSet.twoCombinedOwners,
      relays: relayVariationSet.combinedIPV4SingleHostNameRelays
    }
  },
  poolRegistrationMixedOwnersIpv4Ipv6Relays: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      poolOwners: poolOwnerVariationSet.twoCombinedOwners,
      relays: relayVariationSet.combinedIPV4IPV6Relays
    }
  },
  poolRegistrationNoRelays: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      relays: relayVariationSet.noRelays
    }
  },
  poolRegistrationNoMetadata: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      metadata: poolMetadataVariations.poolMetadataNone
    }
  },
  poolRegistrationWrongMargin: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      margin: {
        numeratorStr: "3",
        denominatorStr: "1",
      }
    }
  },
  poolRegistrationOperatorNoOwnersNoRelays: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      poolKey: {
        path: str_to_path("1853'/1815'/0'/0'"),
      },
      poolOwners: [],
      relays: [],
    }
  },
  poolRegistrationOperatorSingleOwnerNoRelays: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      poolKey: {
        path: str_to_path("1853'/1815'/0'/0'"),
      },
      poolOwners: [stakingHashOwners.owner0],
      relays: [],
    }
  },
  poolRegistrationOperatorMultipleOwnersAllRelays: {
    ...defaultPoolRegistration,
    poolRegistrationParams: {
      ...defaultPoolRegistration.poolRegistrationParams,
      poolKey: {
        path: str_to_path("1853'/1815'/0'/0'"),
      },
      poolOwners: poolOwnerVariationSet.twoHashOwners,
      relays: relayVariationSet.allRelays,
    }
  },
}

export const withdrawals = {
  withdrawal0: {
    path: str_to_path("1852'/1815'/0'/2/0"),
    amountStr: "111"
  },
  withdrawal1: {
    path: str_to_path("1852'/1815'/1'/2/0"),
    amountStr: "112"
  },
}

export const results = {
  allRelaysHashAndPathOwners: {
    // computed by cardano-cli
    /*
    * txBody: a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581c13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad82581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c581c794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad848400190bb84436e44b9af68400190bb84436e44b9b500178ff2483e3a2330a34c4a5e576c2078301190bb86d616161612e626262622e636f6d82026d616161612e626262632e636f6d82782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb
    */
    txHashHex: "bc678441767b195382f00f9f4c4bddc046f73e6116fa789035105ecddfdee949",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/2/0"),
        witnessSignatureHex:
          "61fc06451462426b14fa3a31008a5f7d32b2f1793022060c02939bd0004b07f2bd737d542c2db6cef6dad912b9bdca1829a5dc2b45bab3c72afe374cef59cc04"
      }
    ]
  },
  poolRetirement: {
    // WARNING: only as computed by ledger, not verified with cardano-cli
    txHashHex: "da65ca8c5a9e4e1a8dd3c7f623e7e0e13c4f23d7ef2ae7bdd9e5edd654ec5656",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/0/0"),
        witnessSignatureHex:
          "1238a6c4baf2dd0732c4b377db24ce3169196bcf64bd058a41cb0bfb4eefa4269384501645e8fc40be6d3bcc0272a51d1f36d7f06a9f0a55bfc2797bff573f0c"
      },
      {
        path: str_to_path("1853'/1815'/0'/0'"),
        witnessSignatureHex:
          "ce19e55d2a6f00ed7627e164f7c4df5686e60e0f26e51280b7459e149ff520cb9adbbccb846d3852d30e492ffccdb40f9315966917e939c7621fbbc80ab3cc02"
      },
      {
        path: str_to_path("1852'/1815'/0'/2/0"),
        witnessSignatureHex:
          "09e73628850d3b69e19ba3b95009ab389a6def0b19d6d4b8db84033cd989676384b1cf73dbe65bf1b2e373346e8159a2dc5c92f2c86f6b56827edf541604f30c"
      },
    ]
  },
  poolRegistrationDefault: {
    // WARNING: only as computed by ledger, not verified with cardano-cli
    txHashHex: "4ea6c33b8f9714996080700d0e8480b2ab1136641ea8c3b08572be189c9825ab",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/2/0"),
        witnessSignatureHex:
          "f03947901bcfc96ac8e359825091db88900a470947c60220fcd3892683ec7fe949ef4e28a446d78a883f034cd77cbca669529a9da3f2316b762eb97033797a07"
      }
    ]
  },
  poolRegistrationMixedOwners: {
    // WARNING: only as computed by ledger, not verified with cardano-cli
    txHashHex: "322872680d2f13e2d50c806572b28a95e12bbea2e8e27db44e369e5d304929df",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/2/0"),
        witnessSignatureHex:
          "c1b454f3cf868007d2850084ff404bc4b91d9b541a78af9014288504143bd6b4f12df2163b7efb1817636eb625a62967fb66281ecae4d1b461770deafb65ba0f"
      }
    ]
  },
  poolRegistrationMixedOwnersIpv4SingleHostRelays: {
    // WARNING: only as computed by ledger, not verified with cardano-cli
    txHashHex: "a41a6e4e00ad04824455773302f95a179c03f583f969862a479d4805b53a708f",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/2/0"),
        witnessSignatureHex:
          "8bb8c10b390ac92f617ba6895e3b138f43dc741e3589a9548166d1eda995becf4a229e9e95f6300336f7e92345b244c5dc78cfe0cc12cac6ff6fbb5731671c0e"
      }
    ]
  },
  poolRegistrationMixedOwnersIpv4Ipv6Relays: {
    // WARNING: only as computed by ledger, not verified with cardano-cli
    txHashHex: "ab64050759a4221d4a8568badf06c444b42dae05fb2d22b0dff5749a49e5d332",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/2/0"),
        witnessSignatureHex:
          "b0e6796ca5f97a0776c798e602afd0f6541996d431a3cbec8e3fe77eb49416cd812dcf6084672e40c9ae2b8cc8a5513d1b1a6c3ad408864d4a771e315c50d808"
      }
    ]
  },
  noRelaysSinglePathOwner: {
    // WARNING: only as computed by ledger, not verified with cardano-cli
    txHashHex: "fc4778c13fadb8b69249b4cd98ef45f42145e1ce081c5466170a670829dc2184",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/2/0"),
        witnessSignatureHex:
          "adc06e34dc66f01b16496b04fc4ce5058e3be7290398cf2728f8463dda15c87866314449bdb309d0cdc22f3ca9bee310458f2769df6a1486f1b470a3227a030b"
      }
    ]
  },
  noMetadata: {
    // WARNING: only as computed by ledger, not verified with cardano-cli
    txHashHex: "a97b2258962537e0ad3cbcb1fbf9d454f55bc9b7feb2bea0da23f82c1e956f67",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/2/0"),
        witnessSignatureHex:
          "06e66f6a2d510a8a5446597c59c79cbf4f9e7af9073da0651ea59bbdc2340dc933ed292aa282e6ea7068bed9f6bcb44228573e661c211e6dc61f4dd73ff41f04"
      }
    ]
  },
  noOutputs: {
    // WARNING: only as computed by ledger, not verified with cardano-cli
    txHashHex: "600114fd1c50a7e857fdcaaea73d94f7435c9fce63cfde597f7c48b8dda3b0ba",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/2/0"),
        witnessSignatureHex:
          "91c09ad95d5d0f87f61a62e2f5e2dda4245eb4011887a04a53bdf085282002ccc712718e855e36a30cfcf7ecd43bcdc795aa87647be9c716b65e7fcf376e0503"
      }
    ]
  },
  poolRegistrationOperatorNoOwnersNoRelays: {
    // WARNING: only as computed by ledger, not verified with cardano-cli
    txHashHex: "75a57a27893443eb7bb6e4746b6d52ba74c401ece0d2a2570322d6b7d07c29a7",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/0/0"),
        witnessSignatureHex:
          "2bff91cbd14ae53a2d476bd27306a7117d705c4fb58248af4f9b86c770991ea9785a39924d824a75b9ee0632b52c4267e6afec41e206a03b4753c5a397275807"
      },
      {
        path: str_to_path("1853'/1815'/0'/0'"),
        witnessSignatureHex:
          "a92f621f48c785103b1dab862715beef0f0dc2408d0668422286a1dbc268db9a32cacd3b689a0c6af32ab2ac5057caac13910f09363e2d2db0dde4a27b2b5a09"
      },
    ]
  },
  poolRegistrationOperatorOneOwnerOperatorNoRelays: {
    // WARNING: only as computed by ledger, not verified with cardano-cli
    txHashHex: "19b4e645af2c4b4bf16ec3e378d8e52624c46dba3a91398d46be12c1ef3585d5",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/0/0"),
        witnessSignatureHex:
          "4f31baa6c392043b3c525c5edd8d1dcc5331d9aab7706c506b60bbe71a95259299c63bd680e645633604082913ba267e31078c6a2ccd4686e9ba3f612342070c"
      },
      {
        path: str_to_path("1853'/1815'/0'/0'"),
        witnessSignatureHex:
          "6948f460334f0daddbea8700325b2ceadb241114767db72a68c074dd717e58135579425eb5181dbb8a6d46fcb83bd4aa08f2fd16ed7540ee70e7020af4d96709"
      },
    ]
  },
  poolRegistrationOperatorMultipleOwnersAllRelays: {
    // WARNING: only as computed by ledger, not verified with cardano-cli
    txHashHex: "7ece5d431b09770f2e24c190e96c3884866ba4c9cd3292d4b42d286af5f3f872",
    witnesses: [
      {
        path: str_to_path("1852'/1815'/0'/0/0"),
        witnessSignatureHex:
          "9f6da51173411ba82e76695ccf7c222f1df7444b0bbc1af354800acf244a4eaf72e95853406918e3ef461569fe99b39e33164ab440510f75df06e4ff89ca9107"
      },
      {
        path: str_to_path("1853'/1815'/0'/0'"),
        witnessSignatureHex:
          "8957a7768bc9389cd7ab6fa3b3e2fa089785715a5298f9cb38abf99a6e0da5bef734c4862ca7948fb69575ccb9ed8ae1d92cc971742f674632f6f03e22c5b103"
      },
    ]
  },
}
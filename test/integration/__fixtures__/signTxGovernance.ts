import { DeviceStatusCodes, DeviceStatusError, DeviceStatusMessages, InvalidDataReason } from "../../../src/Ada"
import { TxAuxiliaryDataSupplementType } from "../../../src/Ada"
import { TxAuxiliaryDataType } from "../../../src/Ada"
import { CIP36VoteDelegationType } from '../../../src/types/public'
import { CIP36VoteRegistrationFormat} from '../../../src/types/public'
import { TransactionSigningMode } from '../../../src/types/public'
import { str_to_path } from "../../../src/utils/address"
import type { SignTxTestcase } from "./signTx"
import type { TestcaseRejectShelley } from "./signTxRejects"
import { destinations, inputs, mainnetFeeTtl, outputs, shelleyBase } from "./txElements"

export const testsCatalystRegistration: SignTxTestcase[] = [
    {
        testName: "Sign tx with Catalyst voting key registration metadata with base address",
        tx: {
            ...mainnetFeeTtl,
            inputs: [inputs.utxoShelley],
            outputs: [outputs.internalBaseWithStakingPath],
            validityIntervalStart: 7,
            auxiliaryData: {
                type: TxAuxiliaryDataType.CIP36_VOTE_REGISTRATION,
                params: {
                    format: CIP36VoteRegistrationFormat.CIP_15,
                    votingPublicKeyHex: "4b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c",
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    rewardsDestination: destinations.internalBaseWithStakingPath,
                    nonce: 1454448,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a075820e9141b460aea0abb69ce113c7302c7c03690267736d6a382ee62d2a53c2ec9260807",
        txAuxiliaryData: "82a219ef64a40158204b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c02582066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67bcb39bc870d85e80358390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c041a0016317019ef65a10158400ca3bb69cad5f471ddd32097a8501e3956e4ae0c2bf523625d1686b123dcc04af240630eb93bf1069c607b59bbe7d521fb8dd14a4312788bc0b72b7473ee160e80",
        expectedResult: {
            txHashHex: "9941060a76f5702e72b43c382f77b143ed0e328ac3977a0791f08a5f0e0149cd",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex: "b0bc6b3ddc0ab65e5b2e83cfdedbbf76619c3a833705f634f1c8c335dc7c1c5372ec7ebb8199d6d18204da4a0168a172c41c6dd53f45235225f5e62b672ca709",
                },
            ],
            auxiliaryDataSupplement: {
                type: TxAuxiliaryDataSupplementType.CIP36_VOTING_REGISTRATION,
                auxiliaryDataHashHex: "e9141b460aea0abb69ce113c7302c7c03690267736d6a382ee62d2a53c2ec926",
                cip36VoteRegistrationSignatureHex: "0ca3bb69cad5f471ddd32097a8501e3956e4ae0c2bf523625d1686b123dcc04af240630eb93bf1069c607b59bbe7d521fb8dd14a4312788bc0b72b7473ee160e",
            },
        },
    },
    {
        testName: "Sign tx with Catalyst voting key registration metadata with stake address",
        tx: {
            ...mainnetFeeTtl,
            inputs: [inputs.utxoShelley],
            outputs: [outputs.internalBaseWithStakingPath],
            auxiliaryData: {
                type: TxAuxiliaryDataType.CIP36_VOTE_REGISTRATION,
                params: {
                    format: CIP36VoteRegistrationFormat.CIP_15,
                    votingPublicKeyHex: "4b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c",
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    rewardsDestination: destinations.rewardsKeyPath,
                    nonce: 1454448,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a075820d19f7cb4d48a6ae8d370c64d2a42fca1f61d6b2cf3d0c0c02801541811338deb",
        txAuxiliaryData: "82a219ef64a40158204b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c02582066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67bcb39bc870d85e803581de11d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c041a0016317019ef65a10158401514b6bbc582b33edcf5fa30ec04dcaa62128de8755c786768ae5922132c2aa50b9ba17be28072de979f45b0f429c7f5d489c549a1e22bc8e7d0b2445c10360980",
        expectedResult: {
            txHashHex: "90ab18ad3a25cb9f48470cb16a51e1fe04181b96f639d939c51ca81ab4c0fa23",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex: "138afde8640bd8d1a08309455f604d842d65a85e5ce2f584974f004e9043dea670ead5de3e4895a320f94033d5476d56ccf7147f327156cc30aef8304c66c006",
                },
            ],
            auxiliaryDataSupplement: {
                type: TxAuxiliaryDataSupplementType.CIP36_VOTING_REGISTRATION,
                auxiliaryDataHashHex: "d19f7cb4d48a6ae8d370c64d2a42fca1f61d6b2cf3d0c0c02801541811338deb",
                cip36VoteRegistrationSignatureHex: "1514b6bbc582b33edcf5fa30ec04dcaa62128de8755c786768ae5922132c2aa50b9ba17be28072de979f45b0f429c7f5d489c549a1e22bc8e7d0b2445c103609",
            },
        },
    },
]

export const testsGovernanceVotingRegistrationCIP36: SignTxTestcase[] = [
    {
        testName: "Sign tx with governance voting registration CIP36 with voting key hex",
        tx: {
            ...mainnetFeeTtl,
            inputs: [inputs.utxoShelley],
            outputs: [outputs.internalBaseWithStakingPath],
            auxiliaryData: {
                type: TxAuxiliaryDataType.CIP36_VOTE_REGISTRATION,
                params: {
                    format: CIP36VoteRegistrationFormat.CIP_36,
                    votingPublicKeyHex: "4b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c",
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    rewardsDestination: destinations.rewardsKeyPath,
                    nonce: 1454448,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a0758201999b3bb9102b585c42616e40cf1290518d788f967ab4b3329dcb712ac933da0",
        txAuxiliaryData: "82a219ef64a50158204b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c02582066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67bcb39bc870d85e803581de11d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c041a00163170050019ef65a1015840d07070f841e17f50139bfd6cadeaa89ce87474200db051f48d585cba52360f52444db9b4529e1721348763374f35fa8a054d5a3931fb3524484aa910cf46550580",
        expectedResult: {
            txHashHex: "358f273c7416fba90abaec19dfa96eb7257ffd047edcb8f035acb0403bd3c6ce",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex: "60e3674421e004efcb6c893ec69a7131d52688cd927512510d59d83280639af55cbc05ae75bf7711d2562c26fa966ca17e908664c6fa7a042b7aac5a7f32d80d",
                },
            ],
            auxiliaryDataSupplement: {
                type: TxAuxiliaryDataSupplementType.CIP36_VOTING_REGISTRATION,
                auxiliaryDataHashHex: "1999b3bb9102b585c42616e40cf1290518d788f967ab4b3329dcb712ac933da0",
                cip36VoteRegistrationSignatureHex: "d07070f841e17f50139bfd6cadeaa89ce87474200db051f48d585cba52360f52444db9b4529e1721348763374f35fa8a054d5a3931fb3524484aa910cf465505",
            },
        },
    },
    {
        testName: "Sign tx with governance voting registration CIP36 with voting key path",
        tx: {
            ...mainnetFeeTtl,
            inputs: [inputs.utxoShelley],
            outputs: [outputs.internalBaseWithStakingPath],
            validityIntervalStart: 7,
            auxiliaryData: {
                type: TxAuxiliaryDataType.CIP36_VOTE_REGISTRATION,
                params: {
                    format: CIP36VoteRegistrationFormat.CIP_36,
                    votingPublicKeyPath: str_to_path("1694'/1815'/0'/0/1"),
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    rewardsDestination: destinations.internalBaseWithStakingPath,
                    nonce: 1454448,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a075820d05698c555a117014a3b360a66931ec43bf18e2aa16560fc99dbd92dd7f6f6540807",
        txAuxiliaryData: "82a219ef64a5015820aac861247bd24cae705bca1d1c9763f19c19188fb0faf257c50ed69b8157bced02582066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67bcb39bc870d85e80358390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c041a00163170050019ef65a10158400e42a6796426b14876d522a08ffff450971f15a61ee81ba7f34d55a51a43e3928b965fd12e3c0b6e35a8d887e3e9acce466e4069ee44ab250d9976c49197830180",
        expectedResult: {
            txHashHex: "7244322ab32df88ab579dd67da9f77fe172129059ed8c8896dddb35573ee3dcd",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex: "12cc08ec7f2047970a03ce68148392bceb870bc4735cda7ad3eb1eca17e7f5938d7790c8d51b2fcc7c1fd71571ea9fdee0f9a2702942fdd2e38bfc3573e5bf0f",
                },
            ],
            auxiliaryDataSupplement: {
                type: TxAuxiliaryDataSupplementType.CIP36_VOTING_REGISTRATION,
                auxiliaryDataHashHex: "d05698c555a117014a3b360a66931ec43bf18e2aa16560fc99dbd92dd7f6f654",
                cip36VoteRegistrationSignatureHex: "0e42a6796426b14876d522a08ffff450971f15a61ee81ba7f34d55a51a43e3928b965fd12e3c0b6e35a8d887e3e9acce466e4069ee44ab250d9976c491978301",
            },
        },
    },
    {
        testName: "Sign tx with governance voting registration CIP36 with unusual voting key path",
        tx: {
            ...mainnetFeeTtl,
            inputs: [inputs.utxoShelley],
            outputs: [outputs.internalBaseWithStakingPath],
            validityIntervalStart: 7,
            auxiliaryData: {
                type: TxAuxiliaryDataType.CIP36_VOTE_REGISTRATION,
                params: {
                    format: CIP36VoteRegistrationFormat.CIP_36,
                    votingPublicKeyPath: str_to_path("1694'/1815'/101'/0/1"),
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    rewardsDestination: destinations.internalBaseWithStakingPath,
                    nonce: 1454448,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a07582077be323b8df4c6aa1bf2f180112f85ffe8d7f658bc8febdf7dbd5a07453a31cb0807",
        txAuxiliaryData: "82a219ef64a50158206469c8eecf160d7021856131613a48bedadd817d8e615ce5aee738dd57b1b17102582066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67bcb39bc870d85e80358390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c041a00163170050019ef65a1015840b72e5aa4c6932a967afbe4d08b12b4da05cac538f5d3e89deb2ae1cba6db59d5f3f2026b11e381e0737ac9e74c26db4973205960f47c4d73bf3aebfdb214220680",
        expectedResult: {
            txHashHex: "34e9f85a4af9487bdf31de7d01132f63f8b3461cd8ec751851188cff7b3ee7bb",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex: "328575c58f12eeee968f0ad3a10cfdba7551941cf1fd3238aa8003aadd2c2b59ebdae220e69e6f62392f38dc8a95343baf76772e5c9f10ca8e5805ae699a4a02",
                },
            ],
            auxiliaryDataSupplement: {
                type: TxAuxiliaryDataSupplementType.CIP36_VOTING_REGISTRATION,
                auxiliaryDataHashHex: "77be323b8df4c6aa1bf2f180112f85ffe8d7f658bc8febdf7dbd5a07453a31cb",
                cip36VoteRegistrationSignatureHex: "b72e5aa4c6932a967afbe4d08b12b4da05cac538f5d3e89deb2ae1cba6db59d5f3f2026b11e381e0737ac9e74c26db4973205960f47c4d73bf3aebfdb2142206",
            },
        },
    },
    {
        testName: "Sign tx with governance voting registration CIP36 with third-party reward address",
        tx: {
            ...mainnetFeeTtl,
            inputs: [inputs.utxoShelley],
            outputs: [outputs.internalBaseWithStakingPath],
            validityIntervalStart: 7,
            auxiliaryData: {
                type: TxAuxiliaryDataType.CIP36_VOTE_REGISTRATION,
                params: {
                    format: CIP36VoteRegistrationFormat.CIP_36,
                    votingPublicKeyPath: str_to_path("1694'/1815'/0'/0/1"),
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    rewardsDestination: destinations.externalShelleyBaseKeyhashScripthash,
                    nonce: 1454448,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a07582042e408fb03986a958be9e2cca01623a31e23f86f31172a5a9b84acdfce6f0e750807",
        txAuxiliaryData: "82a219ef64a5015820aac861247bd24cae705bca1d1c9763f19c19188fb0faf257c50ed69b8157bced02582066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67bcb39bc870d85e80358392113d58234512f7f616ef62308c40170c110b2f8d810f230402c5e74177004b5785308380e2dac2955d234b60aa4b786057dd5a93984439d32041a00163170050019ef65a1015840a7f8da0b4e114aff812aa9d5ce502f34a0de177000894d7a9798d3bb0ac64a0c1856501e50ab91b581fb786d32236d242b76ef2ef4d28a3a96f47a268972760f80",
        expectedResult: {
            txHashHex: "69ce56529386b4a68138c5f5a0063758c3ff09d9c53cd075943e37a43f236805",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex: "05836647a2864d20d0ddf1f591eecdaed02d54e60ecc40f9a881402c5bb9c401a10ae690dbca826242d1be0cd512c134e0bf03db7c81de90bf732e93fb36f501",
                },
            ],
            auxiliaryDataSupplement: {
                type: TxAuxiliaryDataSupplementType.CIP36_VOTING_REGISTRATION,
                auxiliaryDataHashHex: "42e408fb03986a958be9e2cca01623a31e23f86f31172a5a9b84acdfce6f0e75",
                cip36VoteRegistrationSignatureHex: "a7f8da0b4e114aff812aa9d5ce502f34a0de177000894d7a9798d3bb0ac64a0c1856501e50ab91b581fb786d32236d242b76ef2ef4d28a3a96f47a268972760f",
            },
        },
    },
    {
        testName: "Sign tx with governance voting registration CIP36 with voting purpose",
        tx: {
            ...mainnetFeeTtl,
            inputs: [inputs.utxoShelley],
            outputs: [outputs.internalBaseWithStakingPath],
            validityIntervalStart: 7,
            auxiliaryData: {
                type: TxAuxiliaryDataType.CIP36_VOTE_REGISTRATION,
                params: {
                    format: CIP36VoteRegistrationFormat.CIP_36,
                    votingPublicKeyHex: "4b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c",
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    rewardsDestination: destinations.internalBaseWithStakingPath,
                    nonce: 1454448,
                    votingPurpose: 0,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a075820d706aed1ebc1e8af188aae6d37ffdf4e259a0f04635bef5edce7f43ff632c4450807",
        txAuxiliaryData: "82a219ef64a50158204b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c02582066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67bcb39bc870d85e80358390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c041a00163170050019ef65a10158405af32c1a5eb3f1e7f449504be7e292b07773ef318d545a98e248e375ded56868454e8aafb77942def5ca758da0f2d7d2e4b4d16198cf82073767372731e24a0680",
        expectedResult: {
            txHashHex: "0791e4d8da98cacbc4bbda3bc5ed24bc9e9ed40e73ae3e785b2d23029176aeb8",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex: "2caf21060dfd08ec405df11578dc6380b0f375ceb74bc1c02e92d72310033d1c4309bd2488f3f6c4548e2f93099201663b59a2bded609d4abce2018a1d2b610c",
                },
            ],
            auxiliaryDataSupplement: {
                type: TxAuxiliaryDataSupplementType.CIP36_VOTING_REGISTRATION,
                auxiliaryDataHashHex: "d706aed1ebc1e8af188aae6d37ffdf4e259a0f04635bef5edce7f43ff632c445",
                cip36VoteRegistrationSignatureHex: "5af32c1a5eb3f1e7f449504be7e292b07773ef318d545a98e248e375ded56868454e8aafb77942def5ca758da0f2d7d2e4b4d16198cf82073767372731e24a06",
            },
        },
    },
    {
        testName: "Sign tx with governance voting registration CIP36 with delegations",
        tx: {
            ...mainnetFeeTtl,
            inputs: [inputs.utxoShelley],
            outputs: [outputs.internalBaseWithStakingPath],
            validityIntervalStart: 7,
            auxiliaryData: {
                type: TxAuxiliaryDataType.CIP36_VOTE_REGISTRATION,
                params: {
                    format: CIP36VoteRegistrationFormat.CIP_36,
                    delegations: [
                        {
                            type: CIP36VoteDelegationType.KEY,
                            votingPublicKeyHex: "4b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c",
                            weight: 9,
                        },
                        {
                            type: CIP36VoteDelegationType.PATH,
                            votingKeyPath: str_to_path("1694'/1815'/0'/0/1"),
                            weight: 0,
                        },
                    ],
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    rewardsDestination: destinations.internalBaseWithStakingPath,
                    nonce: 1454448,
                    votingPurpose: 2790,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        txBody: "a600818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b70001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a006ca79302182a030a075820f0e62a047ef597d9fb1bfefb9cd3f4e77558c33510ca552484ee8b5c77bbdf650807",
        txAuxiliaryData: "82a219ef64a501828258204b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c09825820aac861247bd24cae705bca1d1c9763f19c19188fb0faf257c50ed69b8157bced0002582066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67bcb39bc870d85e80358390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c041a0016317005190ae619ef65a10158406bfb7d485c2c4cc470863ab2555746b7822e35c0d299854ed56a631257bf06003db642fe5a527f7af340edfbfc4874fbcf3e59937cb998b54de71fbb9b1f120880",
        expectedResult: {
            txHashHex: "7cdb049d053e7e957d42128f7d90bde2b7f928853bb97ee2f935899f7b521cb8",
            witnesses: [
                {
                    path: str_to_path("1852'/1815'/0'/0/0"),
                    witnessSignatureHex: "8a74428e0d7d74f94ff6e5cb7e1a2bec582225955d322e49b69a42ab47d2d768dc8b6aa9c50279f725af4d8579ba16d80606d858916452272353284d511e1806",
                },
            ],
            auxiliaryDataSupplement: {
                type: TxAuxiliaryDataSupplementType.CIP36_VOTING_REGISTRATION,
                auxiliaryDataHashHex: "f0e62a047ef597d9fb1bfefb9cd3f4e77558c33510ca552484ee8b5c77bbdf65",
                cip36VoteRegistrationSignatureHex: "6bfb7d485c2c4cc470863ab2555746b7822e35c0d299854ed56a631257bf06003db642fe5a527f7af340edfbfc4874fbcf3e59937cb998b54de71fbb9b1f1208",
            },
        },
    },
]

export const testsGovernanceVotingRegistrationRejects: TestcaseRejectShelley[] = [
    {
        testName: "Governance voting CIP-15 with delegation",
        tx: {
            ...shelleyBase,
            auxiliaryData: {
                type: TxAuxiliaryDataType.CIP36_VOTE_REGISTRATION,
                params: {
                    format: CIP36VoteRegistrationFormat.CIP_15,
                    delegations: [
                        {
                            type: CIP36VoteDelegationType.KEY,
                            votingPublicKeyHex: "4b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c",
                            weight: 0,
                        },
                    ],
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    rewardsDestination: destinations.internalBaseWithStakingPath,
                    nonce: 1454448,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_INVALID_DATA],
        rejectReason: InvalidDataReason.CVOTE_REGISTRATION_INCONSISTENT_WITH_CIP15,
    },
    {
        testName: "Governance voting CIP-15 with voting purpose",
        tx: {
            ...shelleyBase,
            auxiliaryData: {
                type: TxAuxiliaryDataType.CIP36_VOTE_REGISTRATION,
                params: {
                    format: CIP36VoteRegistrationFormat.CIP_15,
                    votingPublicKeyHex: "4b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c",
                    stakingPath: str_to_path("1852'/1815'/0'/2/0"),
                    rewardsDestination: destinations.internalBaseWithStakingPath,
                    nonce: 1454448,
                    votingPurpose: 0,
                },
            },
        },
        signingMode: TransactionSigningMode.ORDINARY_TRANSACTION,
        errCls: DeviceStatusError,
        errMsg: DeviceStatusMessages[DeviceStatusCodes.ERR_INVALID_DATA],
        rejectReason: InvalidDataReason.CVOTE_REGISTRATION_INCONSISTENT_WITH_CIP15,
    },
]

import type {Version} from '../../../../src/types/public'
import {parseSignTransactionRequest} from '../../../../src/parsing/transaction'
import {TxAuxiliaryDataType} from '../../../../src/types/public'
import {
  buildSignTxAuxiliaryDataDelegation,
  buildSignTxAuxiliaryDataInit,
  buildSignTxChunks,
  buildSignTxInit,
  buildSignTxWitness,
} from '../../../../src/interactions/v8/commandBuilder'
import {serializeApdu} from '../../../../src/interactions/v8/common/apdu'
import {
  testsAlonzoTrezorComparison,
  testsBabbageTrezorComparison,
  testsConwayProposalProcedures,
} from '../../../integration/__fixtures__/signTx'
import {testsCVoteRegistrationCIP36} from '../../../integration/__fixtures__/signTxCVote'

const INS_SIGN_TX = 0x21
const P1_TX_SIGN_WITNESS = 0x0f
const P1_TX_INIT = 0x10
const P1_TX_CHUNK = 0x11
const P1_TX_CONFIRM = 0x12
const P1_TX_AUX_DATA = 0x13
const P2_UNUSED = 0x00
const P2_AUX_DATA_INIT = 0x36
const P2_AUX_DATA_DELEGATION = 0x37
const MAX_SIGN_TX_CHUNK_SIZE = 250

function u8Hex(value: number): string {
  return value.toString(16).padStart(2, '0')
}

function u16Hex(value: number): string {
  return value.toString(16).padStart(4, '0')
}

function u32Hex(value: number): string {
  return value.toString(16).padStart(8, '0')
}

function u64Hex(value: bigint): string {
  return value.toString(16).padStart(16, '0')
}

function buildApduHex(ins: number, p1: number, p2: number, payloadHex: string) {
  return `${u8Hex(0xd7)}${u8Hex(ins)}${u8Hex(p1)}${u8Hex(p2)}${u8Hex(
    payloadHex.length / 2,
  )}${payloadHex}`
}

function signingModeHex(signingMode: string): string {
  const mapping: Record<string, number> = {
    ordinary_transaction: 3,
    pool_registration_as_owner: 4,
    pool_registration_as_operator: 5,
    multisig_transaction: 6,
    plutus_transaction: 7,
  }
  return u8Hex(mapping[signingMode])
}

function buildInitApduHex(params: {
  networkId: number
  protocolMagic: number
  signingMode: string
  numInputs: number
  numOutputs: number
  includeTtl: boolean
  numCertificates: number
  numWithdrawals: number
  includeAuxDataHash: boolean
  auxDataType: number | null
  auxDataHashHex: string
  includeValidityIntervalStart: boolean
  numMintAssetGroups: number
  includeScriptDataHash: boolean
  numCollateralInputs: number
  numRequiredSigners: number
  includeNetworkId: boolean
  includeCollateralOutput: boolean
  includeTotalCollateral: boolean
  numReferenceInputs: number
  numVoters: number
  includeTreasury: boolean
  includeDonation: boolean
  numWitnesses: number
  rawTxHex: string
}) {
  const payloadHex = [
    u64Hex(BigInt(0)),
    u8Hex(params.networkId),
    u32Hex(params.protocolMagic),
    signingModeHex(params.signingMode),
    u16Hex(params.numInputs),
    u16Hex(params.numOutputs),
    u8Hex(params.includeTtl ? 2 : 1),
    u16Hex(params.numCertificates),
    u16Hex(params.numWithdrawals),
    u8Hex(params.includeAuxDataHash ? 2 : 1),
    params.includeAuxDataHash ? u8Hex(params.auxDataType ?? 0) : '',
    params.includeAuxDataHash && params.auxDataHashHex.length > 0
      ? params.auxDataHashHex
      : '',
    u8Hex(params.includeValidityIntervalStart ? 2 : 1),
    u16Hex(params.numMintAssetGroups),
    u8Hex(params.includeScriptDataHash ? 2 : 1),
    u16Hex(params.numCollateralInputs),
    u16Hex(params.numRequiredSigners),
    u8Hex(params.includeNetworkId ? 2 : 1),
    u8Hex(params.includeCollateralOutput ? 2 : 1),
    u8Hex(params.includeTotalCollateral ? 2 : 1),
    u16Hex(params.numReferenceInputs),
    u16Hex(params.numVoters),
    u8Hex(params.includeTreasury ? 2 : 1),
    u8Hex(params.includeDonation ? 2 : 1),
    u16Hex(params.numWitnesses),
    u16Hex(params.rawTxHex.length / 2),
  ].join('')

  return buildApduHex(INS_SIGN_TX, P1_TX_INIT, P2_UNUSED, payloadHex)
}

function buildChunkApdusHex(rawTxHex: string): string[] {
  const result: string[] = []
  for (
    let offset = 0;
    offset < rawTxHex.length;
    offset += MAX_SIGN_TX_CHUNK_SIZE * 2
  ) {
    const chunkHex = rawTxHex.slice(offset, offset + MAX_SIGN_TX_CHUNK_SIZE * 2)
    const p1 =
      offset + MAX_SIGN_TX_CHUNK_SIZE * 2 < rawTxHex.length
        ? P1_TX_CHUNK
        : P1_TX_CONFIRM
    result.push(buildApduHex(INS_SIGN_TX, p1, P2_UNUSED, chunkHex))
  }
  return result
}

function buildWitnessApduHex(payloadHex: string): string {
  return buildApduHex(INS_SIGN_TX, P1_TX_SIGN_WITNESS, P2_UNUSED, payloadHex)
}

function parseFixtureRequest(
  testCase: (typeof testsAlonzoTrezorComparison)[number],
) {
  return parseSignTransactionRequest({
    tx: testCase.tx,
    signingMode: testCase.signingMode,
    additionalWitnessPaths: testCase.additionalWitnessPaths,
  })
}

function expectHexString(value: string | undefined): string {
  if (value == null) {
    throw new Error('expected hex string fixture value')
  }
  return value
}

export const parsedAlonzoTrezorSignTxRequest = parseFixtureRequest(
  testsAlonzoTrezorComparison[0],
)

export const parsedBabbagePlutusSignTxRequest = parseFixtureRequest(
  testsBabbageTrezorComparison[0],
)

export const parsedBabbageOrdinarySignTxRequest = parseFixtureRequest(
  testsBabbageTrezorComparison[1],
)

export const parsedCIP36VoteKeyHexSignTxRequest = parseFixtureRequest(
  testsCVoteRegistrationCIP36[0],
)

export const parsedCIP36DelegationsSignTxRequest = parseFixtureRequest(
  testsCVoteRegistrationCIP36[5],
)

export const parsedProposalInfoSignTxRequest = parseFixtureRequest(
  testsConwayProposalProcedures[0],
)

export const parsedProposalHardForkInitiationSignTxRequest =
  parseFixtureRequest(testsConwayProposalProcedures[1])

export const parsedProposalNewConstitutionSignTxRequest = parseFixtureRequest(
  testsConwayProposalProcedures[2],
)

export const parsedProposalUpdateCommitteeSignTxRequest = parseFixtureRequest(
  testsConwayProposalProcedures[3],
)

export const parsedProposalTreasuryWithdrawalsSignTxRequest =
  parseFixtureRequest(testsConwayProposalProcedures[4])

export const parsedProposalNoConfidenceSignTxRequest = parseFixtureRequest(
  testsConwayProposalProcedures[5],
)

export const parsedProposalParameterChangeSignTxRequest = parseFixtureRequest(
  testsConwayProposalProcedures[6],
)

export const parsedProposalParameterChangeCanonicalSignTxRequest =
  parseFixtureRequest(testsConwayProposalProcedures[7])

export const alonzoTrezorRawTxHex =
  '3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700000000007801003901eb0baa5e570cffbe2934db29df0b6a3d7c0430ee65d4c3a7ab2fefb91bc428e4720702ebd5dab4fb175324c192dc9bb76cc5da956e3c8dff00000000001e848000010100010d63e8d2c5a00cbcffbdf9112487c443466e1ea7d8c834df5ac5c42500010874657374436f696e0000000000783862004e01001d71477e52b3116b62fe8cd34a312615f5fcd678c94e1d6cdb86c1a3964c00000000000000010002010000003b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000000000000002a000000000000000a000129fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd010129fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd020129fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fdf61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb497300000000000003e80129fb5fd4aa8cadd6705acc8263cee0fc62edca5ac38db593fec2f9fd000000000000002f0d63e8d2c5a00cbcffbdf9112487c443466e1ea7d8c834df5ac5c42500020874657374436f696e00000000007838620875657374436f696effffffffff87c79e3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7'
export const babbagePlutusRawTxHex =
  '3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000000000078010039017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b0900000000001e848000010100010d63e8d2c5a00cbcffbdf9112487c443466e1ea7d8c834df5ac5c42500010874657374436f696e0000000000783862004e01001d71477e52b3116b62fe8cd34a312615f5fcd678c94e1d6cdb86c1a3964c00000000000000010002010000003b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000000000000002a000000000000000a000000000000002f3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b73b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000000000049010039017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b0900000000000000010001010000000000000000000a3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700000000'
export const babbageOrdinaryRawTxHex =
  '3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700000000008101001d71477e52b3116b62fe8cd34a312615f5fcd678c94e1d6cdb86c1a3964c000000000000000101020200000100165579657420616e6f746865722063686f636f6c61746500390080f9e2c88e6c817008f3a812ed889b4a4da8e0bd103f86e7335422aa122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b4277000000000000002a000000000000000a000000000000002f'
export const cip36VoteKeyHexRawTxHex =
  '3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700000000003b020001058000073c8000071780000000000000000000000022058000073c8000071780000000000000020000000000000000006ca7930001010000000000000000002a000000000000000a'
export const cip36DelegationsRawTxHex =
  '3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700000000003b020001058000073c8000071780000000000000000000000022058000073c8000071780000000000000020000000000000000006ca7930001010000000000000000002a000000000000000a0000000000000007'
export const proposalInfoRawTxHex =
  '2d41957c0b829cb7b7dad2214aeb2286e6b9b74f9eac0007d00a4009336620af000000000049010039014f4ac1e24970e2f62cb27a6e344ef60e65ea72a09cf8a07781384de7bd8a6ca646f9d7e62d0d64fd424df8afa35892e89f62acecca8cd3fd00000000001be3e30001010000000000000002a09d000000000b85485c000000174876e80000e149d2f64bf237b683e3a3e2b543ca6f18bde2b673716514b4d1cd53480602003f68747470733a2f2f73747238706f6f6c2e636f6d2f676f7665726e616e63652f323032362d30372d32332d46616269616e7642657267656e2e6a736f6e6c6495c0bcf2ec42756d6f12f8110d40826021fca29ed82526609efb62d9e79c98ad'
export const proposalHardForkInitiationRawTxHex =
  '41bfdf1ed20d0d8b89de2308dc8136180b70d199625bfb7a76a6a79f3fe9f46600000000fff0df644d328a5367212f45bab59060bde3c4091dc96c723062896fd619731400000000002d01001d619de6194b5f8c5c5547f3735f7d1e53b83c15134abe89de232fd162e700000000000daad60001010000000000000002ce55000000174876e80000e111ce01cd0e4dbba24d7f99d3516ae9229f0199ed4b9315fe4693b64b01010a0000000002007968747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f496e746572736563744d424f2f676f7665726e616e63652d616374696f6e732f726566732f68656164732f6d61696e2f6d61696e6e65742f323032342d31302d33302d686631302f6d657461646174612e6a736f6e6c648a1bd37caa6b914a8b569adb63a0f41d8f159c110dc5c8409118a3f087fffb43'
export const proposalNewConstitutionRawTxHex =
  'bacbce38c49df898004b14587d7f9fa92eb2524543472cf47894afdb278eb44e000000000049010039016878e4c51866756e3bdd49882c6e218a8ea18850ad89ac2a582b35f429b3155178e987f4eb0e8b60bb5ef4498d960145fa23156744c891220000000005f313030001010000000000000002cdfd000000174876e80000e129b3155178e987f4eb0e8b60bb5ef4498d960145fa23156744c8912205028c653ee5c9800e6d31e79b5a7f7d4400c81d44717ad4db633dc18d4c07e4a4fd00000000020042697066733a2f2f6261666b7265696579756b6e6f7a6274657779757266716f616776706c76796b61646e366134753677676c75706176647a34366262736e6e6c3665b368bdad83c727bbfe86425575233fb914eb76d05d89497f7790cf007fd95f5202fa24fb305126805cf2164c161d852a0e7330cf988f1fe558cf7d4a64020042697066733a2f2f6261666b7265696778707765717632726e6837616a7435687a64713667696b6f676d6171336e62796f66357576646e746334686b673532676871796c5645b67cca1f39323984f97ea2d5f5a68423c592407e241b0637e26d244591'
export const proposalUpdateCommitteeRawTxHex =
  'ab474223d40e2e3540555364be27e161a809c33651408f43d84acff10c0ba30600000000e404e5f9afc5091204fb954485a79ae31d22cf3cb9869b2303ba4089a3a8522400000000004901003901076ad93c90e7dafc2ad468212fb2e2701559d1d32f25ebdc1facdada611943783e94de22f533778841521e97f77588fe05447f464be192c900000000002981e10001010000000000000002f8c9000000174876e80000e1192688a334130db2b51aedea594301010b0d1d2e9a86a460932520ba04024dab331457b61b824bbc6ba4b9d9be4750e25c0b5dd42207aeb63c7431a6b70400000000000300040000000000000002000000000000000301349e55f83e9af24813e6cb368df6a80d38951b2a334dfcdf26815558019cc3f387623f45dae6a68b7096b0c2e403d8601a82dc40221ead41e200dc0d6ef49590eb6880a50a00adde17596e6d76f7159572fa1ff85f2a000af99047bc90e0d9073467548a19a85089b766e73eb807748a2ad361000000000000031f0013493790d9b03483a1e1e684ea4faf1ee48a58f402574e7f2246f4d4000000000000031f0116feefc225e06f75a3c917f4aa50acffde7631ea0355721f2ac12542000000000000031f017c34e0240b84029e0932f5e8d81af42a63f55de6da31f16e19b1f5b4000000000000031f020042697066733a2f2f6261666b726569663232353533683372656165647264333736687a676b6a6e67366b786e62336f37796375336a34707a6a62636a657276326263656014f3e6c052eb1e83ce344bda1ee5262000a83d1d1aa62d63726d91316e6647'
export const proposalTreasuryWithdrawalsRawTxHex =
  '1668e3cd3a8bb8bebde53cb19ee9fde34262002adac634c0be5f883b4bc1180300000000004901003900cf46aeaa7a28f19607a6401227d71feb1c8abed11d9ae2cf8eda8ae1cf68ca7c215a8d857f17fd146b94267a6512fe2c0eedb49678d75f91000000ba2590648300010100000000000000073e1d7436e2169b9a857273fddbd84444ed65130f6166c970e4c3e24c95932c7993761668e3cd3a8bb8bebde53cb19ee9fde34262002adac634c0be5f883b4bc1180300000000000000174876e80000e0cf68ca7c215a8d857f17fd146b94267a6512fe2c0eedb49678d75f910202fa24fb305126805cf2164c161d852a0e7330cf988f1fe558cf7d4a64000100e0cf68ca7c215a8d857f17fd146b94267a6512fe2c0eedb49678d75f910000042f055db000020035697066733a2f2f516d586d38666a56476941624b6267487a4a55524c48735536656a586375666f33484b686b5561587475594b6b6f0ea630cff2cc4aefec1968a65baff3e367024369eb6097f34dcb84b154dee260'
export const proposalNoConfidenceRawTxHex =
  '46ec6fcc62fb354438bc2597807787d2538e62ba021f9835648cf2de0646324200000000004901003900cf46aeaa7a28f19607a6401227d71feb1c8abed11d9ae2cf8eda8ae1cf68ca7c215a8d857f17fd146b94267a6512fe2c0eedb49678d75f910000005fca8796f20001010000000000000002cb49000000174876e80000e0cf68ca7c215a8d857f17fd146b94267a6512fe2c0eedb49678d75f9103026f8b70a482e10ae4077d70730826ef27f72b08e148118a5171c72e7fe3c6d55100000000020035697066733a2f2f516d535a3376766d6177354d39445a354e5148583174427541753556427067516e4d6d583170426f4a336b773252413abd5de38d3967686d8dd615d3ca0dd7db9fd5c1f2f710b5dfa1b35512c096'
export const proposalParameterChangeRawTxHex =
  'a589b9135438251dfef851692c918f8d0f4df7dba8a380fd39d083019083a14300000000004901003900cf46aeaa7a28f19607a6401227d71feb1c8abed11d9ae2cf8eda8ae1cf68ca7c215a8d857f17fd146b94267a6512fe2c0eedb49678d75f91000000a2dd07896600010100000000000000073f517436e2169b9a857273fddbd84444ed65130f6166c970e4c3e24c95932c799376606d4b5872cf0ff010d535374a3ae0aaf6dd2a5b0d6ae524ccccfabe338a8281000000055d90d1f09a8a64391e92ff57bde96fcdeac59163012608b903c594536ac9954900000005000000174876e80000e0cf68ca7c215a8d857f17fd146b94267a6512fe2c0eedb49678d75f9100023e1b4d548e3cb10944aa42168c9e0e6c43636e96d0db7fa630645e713c72245100000000000000004000000002fa24fb305126805cf2164c161d852a0e7330cf988f1fe558cf7d4a6400000002540be400020035697066733a2f2f516d5a4576616d5473694274556d317047785658476b7848714d525376546146676d356e78686578693245575668cded5e1a3284ef5016c132e313fe4c9bc526fe85c8b80a8e1655290196f7fe46'
export const proposalParameterChangeCanonicalRawTxHex =
  '36d07f29c67822b9a75cef6d899ec66843d87922077bdac8a3ee508b7f8b561500000000b3d452bff7769d7f557ec6b8974760ee6c5e496c276652b654032966621e0ccf00000000004901003901076ad93c90e7dafc2ad468212fb2e2701559d1d32f25ebdc1facdada611943783e94de22f533778841521e97f77588fe05447f464be192c900000000002c7aaa00010100000000000000053c2f8c75478b90ba1457795d9102d92f4a19886f1a8c147fe96a02d1cb8f355d4ca9b3d452bff7769d7f557ec6b8974760ee6c5e496c276652b654032966621e0ccf00000000004901003901076ad93c90e7dafc2ad468212fb2e2701559d1d32f25ebdc1facdada611943783e94de22f533778841521e97f77588fe05447f464be192c900000000002ca3af0001010000000000000007da47000000174876e80000e1192688a334130db2b51aedea594301010b0d1d2e9a86a460932520ba0002c75bb221606687aa858ec89c7a15c88e9c17054f2e045ae31ecc8a9687cd206e00000000000000000031000002fa24fb305126805cf2164c161d852a0e7330cf988f1fe558cf7d4a6400000000047868c000000000010b076000000002540be40000000000049e8e6000000004a817c800020042697066733a2f2f6261666b7265696663356374356670657534796778366b3463717a62797a6e793778666d756c6a7977676e376a6765337a6b66327469646163796df200d39e39a3db74bdaa4f04865b4da38b5403322984c6fdcaf09bd44cacf868'
export const cip36VoteKeyHexAuxDataResponseHex = `${expectHexString(
  testsCVoteRegistrationCIP36[0].expectedResult.auxiliaryDataSupplement
    ?.auxiliaryDataHashHex,
)}${expectHexString(
  testsCVoteRegistrationCIP36[0].expectedResult.auxiliaryDataSupplement
    ?.cip36VoteRegistrationSignatureHex,
)}`
export const cip36DelegationsAuxDataResponseHex = `${expectHexString(
  testsCVoteRegistrationCIP36[5].expectedResult.auxiliaryDataSupplement
    ?.auxiliaryDataHashHex,
)}${expectHexString(
  testsCVoteRegistrationCIP36[5].expectedResult.auxiliaryDataSupplement
    ?.cip36VoteRegistrationSignatureHex,
)}`
export const cip36VoteKeyHexExpectedAuxInitApduHex = buildApduHex(
  INS_SIGN_TX,
  P1_TX_AUX_DATA,
  P2_AUX_DATA_INIT,
  '02000002058000073c80000717800000000000000200000000020e0122058000073c8000071780000000000000020000000000000000001631700000000000000000004b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c',
)
export const cip36DelegationsExpectedAuxInitApduHex = buildApduHex(
  INS_SIGN_TX,
  P1_TX_AUX_DATA,
  P2_AUX_DATA_INIT,
  '02000202058000073c80000717800000000000000200000000020001058000073c8000071780000000000000000000000022058000073c8000071780000000000000020000000000000000001631700000000000000ae6',
)
export const cip36DelegationsExpectedAuxDelegationApdusHex = [
  buildApduHex(
    INS_SIGN_TX,
    P1_TX_AUX_DATA,
    P2_AUX_DATA_DELEGATION,
    '004b19e27ffc006ace16592311c4d2f0cafc255eaa47a6178ff540c0a46d07027c00000009',
  ),
  buildApduHex(
    INS_SIGN_TX,
    P1_TX_AUX_DATA,
    P2_AUX_DATA_DELEGATION,
    '02058000069e8000071780000000000000000000000100000000',
  ),
]

export const alonzoExpectedInitApduHex = buildInitApduHex({
  networkId: 1,
  protocolMagic: 764824073,
  signingMode: parsedAlonzoTrezorSignTxRequest.signingMode as unknown as string,
  numInputs: 1,
  numOutputs: 2,
  includeTtl: true,
  numCertificates: 3,
  numWithdrawals: 1,
  includeAuxDataHash: true,
  auxDataType: 0,
  auxDataHashHex:
    '58ec01578fcdfdc376f09631a7b2adc608eaf57e3720484c7ff37c13cff90fdf',
  includeValidityIntervalStart: true,
  numMintAssetGroups: 1,
  includeScriptDataHash: true,
  numCollateralInputs: 0,
  numRequiredSigners: 0,
  includeNetworkId: true,
  includeCollateralOutput: false,
  includeTotalCollateral: false,
  numReferenceInputs: 0,
  numVoters: 0,
  includeTreasury: false,
  includeDonation: false,
  numWitnesses: 2,
  rawTxHex: alonzoTrezorRawTxHex,
})

export const babbagePlutusExpectedInitApduHex = buildInitApduHex({
  networkId: 1,
  protocolMagic: 764824073,
  signingMode:
    parsedBabbagePlutusSignTxRequest.signingMode as unknown as string,
  numInputs: 1,
  numOutputs: 2,
  includeTtl: true,
  numCertificates: 0,
  numWithdrawals: 0,
  includeAuxDataHash: false,
  auxDataType: null,
  auxDataHashHex: '',
  includeValidityIntervalStart: true,
  numMintAssetGroups: 0,
  includeScriptDataHash: true,
  numCollateralInputs: 1,
  numRequiredSigners: 0,
  includeNetworkId: true,
  includeCollateralOutput: true,
  includeTotalCollateral: true,
  numReferenceInputs: 1,
  numVoters: 0,
  includeTreasury: false,
  includeDonation: false,
  numWitnesses: 1,
  rawTxHex: babbagePlutusRawTxHex,
})

export const babbageOrdinaryExpectedInitApduHex = buildInitApduHex({
  networkId: 1,
  protocolMagic: 764824073,
  signingMode:
    parsedBabbageOrdinarySignTxRequest.signingMode as unknown as string,
  numInputs: 1,
  numOutputs: 1,
  includeTtl: true,
  numCertificates: 0,
  numWithdrawals: 0,
  includeAuxDataHash: false,
  auxDataType: null,
  auxDataHashHex: '',
  includeValidityIntervalStart: true,
  numMintAssetGroups: 0,
  includeScriptDataHash: false,
  numCollateralInputs: 0,
  numRequiredSigners: 0,
  includeNetworkId: true,
  includeCollateralOutput: false,
  includeTotalCollateral: false,
  numReferenceInputs: 0,
  numVoters: 0,
  includeTreasury: false,
  includeDonation: false,
  numWitnesses: 1,
  rawTxHex: babbageOrdinaryRawTxHex,
})

export const cip36VoteKeyHexExpectedInitApduHex = buildInitApduHex({
  networkId: 1,
  protocolMagic: 764824073,
  signingMode:
    parsedCIP36VoteKeyHexSignTxRequest.signingMode as unknown as string,
  numInputs: 1,
  numOutputs: 1,
  includeTtl: true,
  numCertificates: 0,
  numWithdrawals: 0,
  includeAuxDataHash: true,
  auxDataType: 1,
  auxDataHashHex: '',
  includeValidityIntervalStart: false,
  numMintAssetGroups: 0,
  includeScriptDataHash: false,
  numCollateralInputs: 0,
  numRequiredSigners: 0,
  includeNetworkId: false,
  includeCollateralOutput: false,
  includeTotalCollateral: false,
  numReferenceInputs: 0,
  numVoters: 0,
  includeTreasury: false,
  includeDonation: false,
  numWitnesses: 1,
  rawTxHex: cip36VoteKeyHexRawTxHex,
})

export const cip36DelegationsExpectedInitApduHex = buildInitApduHex({
  networkId: 1,
  protocolMagic: 764824073,
  signingMode:
    parsedCIP36DelegationsSignTxRequest.signingMode as unknown as string,
  numInputs: 1,
  numOutputs: 1,
  includeTtl: true,
  numCertificates: 0,
  numWithdrawals: 0,
  includeAuxDataHash: true,
  auxDataType: 1,
  auxDataHashHex: '',
  includeValidityIntervalStart: true,
  numMintAssetGroups: 0,
  includeScriptDataHash: false,
  numCollateralInputs: 0,
  numRequiredSigners: 0,
  includeNetworkId: false,
  includeCollateralOutput: false,
  includeTotalCollateral: false,
  numReferenceInputs: 0,
  numVoters: 0,
  includeTreasury: false,
  includeDonation: false,
  numWitnesses: 1,
  rawTxHex: cip36DelegationsRawTxHex,
})

export const alonzoExpectedChunkApdusHex =
  buildChunkApdusHex(alonzoTrezorRawTxHex)
export const babbagePlutusExpectedChunkApdusHex = buildChunkApdusHex(
  babbagePlutusRawTxHex,
)
export const babbageOrdinaryExpectedChunkApdusHex = buildChunkApdusHex(
  babbageOrdinaryRawTxHex,
)
export const cip36VoteKeyHexExpectedChunkApdusHex = buildChunkApdusHex(
  cip36VoteKeyHexRawTxHex,
)
export const cip36DelegationsExpectedChunkApdusHex = buildChunkApdusHex(
  cip36DelegationsRawTxHex,
)

export const alonzoExpectedWitnessApdusHex = [
  buildWitnessApduHex('058000073e80000717800000000000000000000000'),
  buildWitnessApduHex('058000073e80000717800000000000000200000000'),
]

export const babbagePlutusExpectedWitnessApdusHex = [
  buildWitnessApduHex('058000073c80000717800000000000000000000000'),
]

export const babbageOrdinaryExpectedWitnessApdusHex = [
  buildWitnessApduHex('058000073c80000717800000000000000000000000'),
]
export const cip36VoteKeyHexExpectedWitnessApdusHex = [
  buildWitnessApduHex('058000073c80000717800000000000000000000000'),
]
export const cip36DelegationsExpectedWitnessApdusHex = [
  buildWitnessApduHex('058000073c80000717800000000000000000000000'),
]

export const alonzoExpectedWitnessPaths =
  parsedAlonzoTrezorSignTxRequest.additionalWitnessPaths

export const babbagePlutusExpectedWitnessPaths = [
  parsedBabbagePlutusSignTxRequest.tx.inputs[0].path!,
]

export const babbageOrdinaryExpectedWitnessPaths = [
  parsedBabbageOrdinarySignTxRequest.tx.inputs[0].path!,
]
export const cip36VoteKeyHexExpectedWitnessPaths = [
  parsedCIP36VoteKeyHexSignTxRequest.tx.inputs[0].path!,
]
export const cip36DelegationsExpectedWitnessPaths = [
  parsedCIP36DelegationsSignTxRequest.tx.inputs[0].path!,
]

export const v8AppVersion: Version = {
  major: 8,
  minor: 0,
  patch: 0,
  flags: {isDebug: false, isAppXS: false},
}

export function serializeBuiltInitApduHex(
  request: typeof parsedAlonzoTrezorSignTxRequest,
  witnessPaths: typeof alonzoExpectedWitnessPaths,
  version: Version = v8AppVersion,
) {
  return serializeApdu(
    buildSignTxInit(version, request, witnessPaths),
  ).toString('hex')
}

export function serializeBuiltChunkApdusHex(
  request: typeof parsedAlonzoTrezorSignTxRequest,
) {
  return buildSignTxChunks(request.tx).map(
    (apdu: {ins: number; p1: number; p2: number; data: Buffer}) =>
      serializeApdu(apdu).toString('hex'),
  )
}

export function serializeBuiltAuxInitApduHex(
  request:
    | typeof parsedCIP36VoteKeyHexSignTxRequest
    | typeof parsedCIP36DelegationsSignTxRequest,
) {
  if (
    request.tx.auxiliaryData?.type !== TxAuxiliaryDataType.CIP36_REGISTRATION
  ) {
    throw new Error('expected CIP36 auxiliary data')
  }

  return serializeApdu(
    buildSignTxAuxiliaryDataInit(request.tx.auxiliaryData.params),
  ).toString('hex')
}

export function serializeBuiltAuxDelegationApdusHex(
  request: typeof parsedCIP36DelegationsSignTxRequest,
) {
  if (
    request.tx.auxiliaryData?.type !== TxAuxiliaryDataType.CIP36_REGISTRATION
  ) {
    throw new Error('expected CIP36 auxiliary data')
  }

  return (request.tx.auxiliaryData.params.delegations ?? []).map(
    (delegation, index, delegations) =>
      serializeApdu(
        buildSignTxAuxiliaryDataDelegation(
          delegation,
          index === delegations.length - 1,
        ),
      ).toString('hex'),
  )
}

export function serializeBuiltWitnessApdusHex(
  witnessPaths: typeof alonzoExpectedWitnessPaths,
) {
  return witnessPaths.map((path: number[]) =>
    serializeApdu(buildSignTxWitness(path as never)).toString('hex'),
  )
}

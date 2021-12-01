import { describePositiveTest,describeRejects  } from "../test_utils"
import {
    testsAllegra,
    testsByron,
    testsCatalystRegistration,
    testsMary,
    testsShelleyNoCertificates,
    testsShelleyWithCertificates,
} from "./__fixtures__/signTx"
import {
    addressBytesRejectTestcases,
    addressParamsRejectTestcases,
    certificateRejectTestcases,
    certificateStakePoolRetirementRejectTestcases,
    certificateStakingRejectTestcases,
    singleAccountRejectTestcases,
    testsInvalidTokenBundleOrdering,
    transactionInitRejectTestcases,
    withdrawalRejectTestcases,
    witnessRejectTestcases,
} from "./__fixtures__/signTxRejects"

describePositiveTest("signTxOrdinaryByron", testsByron)
describePositiveTest("signTxOrdinaryShelleyNoCertificates", testsShelleyNoCertificates)
describePositiveTest("signTxOrdinaryShelleyWithCertificates", testsShelleyWithCertificates)
describePositiveTest("signTxOrdinaryAllegra", testsAllegra)
describePositiveTest("signTxOrdinaryMary", testsMary)
describePositiveTest("signTxOrdinaryMaryCatalyst", testsCatalystRegistration)

describeRejects("signTxInitPolicyRejects", transactionInitRejectTestcases)
describeRejects("signTxAddressBytesPolicyRejects", addressBytesRejectTestcases)
describeRejects("signTxAddressParamsPolicyRejects", addressParamsRejectTestcases)
describeRejects("signTxCertificatePolicyRejects", certificateRejectTestcases)
describeRejects("signTxCertificateStakingPolicyRejects", certificateStakingRejectTestcases)
describeRejects("signTxCertificateStakePoolRetirementPolicyRejects", certificateStakePoolRetirementRejectTestcases)
describeRejects("signTxWithdrawalRejects", withdrawalRejectTestcases)
describeRejects("signTxWitnessRejects", witnessRejectTestcases)
describeRejects("signTxInvalidMultiassetRejects", testsInvalidTokenBundleOrdering)
describeRejects("signTxSingleAccountRejects", singleAccountRejectTestcases)


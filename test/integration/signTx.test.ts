import { expect } from "chai"

import type Ada from "../../src/Ada"
import type { NetworkIdlessTestResult } from "../test_utils"
import { describeRejects, getAda, hashTxBody } from "../test_utils"
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
    stakePoolRegistrationOwnerRejectTestcases,
    stakePoolRegistrationPoolIdRejectTestcases,
    testsInvalidTokenBundleOrdering,
    transactionInitRejectTestcases,
    withdrawalRejectTestcases,
    witnessRejectTestcases,
} from "./__fixtures__/signTxRejects"

function describePositiveTest(name: string, tests: any[]) {
    describe(name, async () => {
        let ada: Ada = {} as Ada

        beforeEach(async () => {
            ada = await getAda()
        })
    
        afterEach(async () => {
            await (ada as any).t.close()
        })
    
        for (const { testname, tx, signingMode, additionalWitnessPaths, txBody, result: expected } of tests) {
            const additionalWitnessPathsIfPresent = additionalWitnessPaths || []
            it(testname, async () => {
                if (!txBody) {
                    console.log("No tx body given!")
                } else if (hashTxBody(txBody) !== expected.txHashHex) {
                    console.log("Tx body hash mismatch")
                    console.log(hashTxBody(txBody))
                }
                const response = await ada.signTransaction({
                    tx,
                    signingMode,
                    additionalWitnessPaths: additionalWitnessPathsIfPresent,
                })
                const networklessResponse: NetworkIdlessTestResult = {
                    txHashHex: response.txHashHex,
                    witnesses: response.witnesses,
                    auxiliaryDataSupplement: response.auxiliaryDataSupplement,
                }
                expect(networklessResponse).to.deep.equal(expected)
            })
        }
    })
}

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
describeRejects("signTxStakePoolRegistrationPoolIdRejects", stakePoolRegistrationPoolIdRejectTestcases)
describeRejects("signTxStakePoolRegistrationOwnerRejects", stakePoolRegistrationOwnerRejectTestcases)
describeRejects("signTxWithdrawalRejects", withdrawalRejectTestcases)
describeRejects("signTxWitnessRejects", witnessRejectTestcases)
describeRejects("signTxInvalidMultiassetRejects", testsInvalidTokenBundleOrdering)
describeRejects("signTxSingleAccountRejects", singleAccountRejectTestcases)


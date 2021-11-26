import chai from "chai"
import chaiAsPromised from "chai-as-promised"

import { describeRejects, describePositiveTest } from "../test_utils"
import {
    poolRegistrationOperatorTestcases,
    poolRegistrationOwnerTestcases,
} from "./__fixtures__/signTxPoolRegistration"
import {
    poolRegistrationOwnerRejectTestcases,
    invalidCertificates,
    invalidPoolMetadataTestcases,
    invalidRelayTestcases,
    stakePoolRegistrationPoolIdRejectTestcases,
    stakePoolRegistrationOwnerRejectTestcases,
} from "./__fixtures__/signTxPoolRegistrationRejects"
chai.use(chaiAsPromised)

describePositiveTest("signTxPoolRegistrationOK_Owner", poolRegistrationOwnerTestcases)
describePositiveTest("signTxPoolRegistrationOK_Operator", poolRegistrationOperatorTestcases)

describeRejects("signTxPoolRegistrationRejects_Owner_General", poolRegistrationOwnerRejectTestcases)
describeRejects("signTxPoolRegistrationRejects_Owner_Certificates", invalidCertificates)
describeRejects("signTxPoolRegistrationRejects_Owner_Metadata", invalidPoolMetadataTestcases)
describeRejects("signTxPoolRegistrationRejects_Owner_Relay", invalidRelayTestcases)
describeRejects("signTxPoolRegistrationRejects_Owner_PoolId", stakePoolRegistrationPoolIdRejectTestcases)
describeRejects("signTxPoolRegistrationRejects_Owner_Security", stakePoolRegistrationOwnerRejectTestcases)

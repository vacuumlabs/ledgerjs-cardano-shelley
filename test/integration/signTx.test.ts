import { expect } from "chai"

import type Ada from "../../src/Ada"
import { describeWithoutValidation,getAda } from "../test_utils"
import {
    testsAllegra,
    testsByron,
    testsCatalystRegistration,
    testsInvalidTokenBundleOrdering,
    testsMary,
    testsShelleyNoCertificates,
    testsShelleyRejects,
    testsShelleyWithCertificates,
} from "./__fixtures__/signTx"

// ========================================   BYRON   ========================================



// Shelley transaction format, but includes legacy Byron addresses in outputs
describe("signTxOrdinaryByron", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const { testname, tx, signingMode, result: expected } of testsByron) {
        it(testname, async () => {
            const response = await ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            expect(response).to.deep.equal(expected)
        })
    }
})

// ========================================   SHELLEY   ========================================

describe("signTxOrdinaryShelleyNoCertificates", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const { testname, tx, signingMode, additionalWitnessPaths, result: expected } of testsShelleyNoCertificates) {
        it(testname, async () => {
            const response = await ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths,
            })
            expect(response).to.deep.equal(expected)
        })
    }
})

describe("signTxOrdinaryShelleyWithCertificates", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const { testname, tx, signingMode, additionalWitnessPaths, result: expected } of testsShelleyWithCertificates) {
        it(testname, async () => {
            const response = await ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths,
            })
            expect(response).to.deep.equal(expected)
        })
    }
})

describe("signTxShelleyRejectsJS", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const {testname, tx, signingMode, rejectReason } of testsShelleyRejects) {
        it(testname, async() => {
            const response = ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            await expect(response).to.be.rejectedWith(rejectReason)
        })
    }
})

describeWithoutValidation("signTxShelleyRejectsLedger", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const {testname, tx, signingMode, errCls, errMsg } of testsShelleyRejects) {
        it(testname, async() => {
            const response = ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            await expect(response).to.be.rejectedWith(errCls, errMsg)
        })
    }
})


// ========================================   ALLEGRA   ========================================

// changes:
// ttl optional
// added validity_interval_start

describe("signTxOrdinaryAllegra", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const { testname, tx, signingMode, result: expected } of testsAllegra) {
        it(testname, async () => {
            const response = await ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            expect(response).to.deep.equal(expected)
        })
    }
})

// ========================================   MARY   ========================================

// changes:
// multiassets in outputs

describe("signTxOrdinaryMary", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const { testname, tx, signingMode, result: expected } of testsMary) {
        it(testname, async () => {
            const response = await ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            expect(response).to.deep.equal(expected)
        })
    }

    for (const { testname, tx, signingMode, result: expected } of testsCatalystRegistration) {
        it(testname, async () => {
            const response = await ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            expect(response).to.deep.equal(expected)
        })
    }

    for (const {testname, tx, signingMode, rejectReason } of testsInvalidTokenBundleOrdering) {
        it(testname, async() => {
            const response = ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            await expect(response).to.be.rejectedWith(rejectReason)
        })
    }
})

describeWithoutValidation("signTxOrdinaryMaryRejects", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const {testname, tx, signingMode, errCls, errMsg } of testsInvalidTokenBundleOrdering) {
        it(testname, async() => {
            const response = ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            await expect(response).to.be.rejectedWith(errCls, errMsg)
        })
    }
})

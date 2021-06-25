import chai, { expect } from "chai"
import chaiAsPromised from "chai-as-promised"

import type { Ada} from "../../src/Ada"
import { InvalidData, NativeScriptHashDisplayFormat } from "../../src/Ada"
import { getAda } from "../test_utils"
import { InvalidScriptTestcases } from "./__fixtures__/deriveNativeScriptHash"

chai.use(chaiAsPromised)

describe("deriveNativeScriptHash", async () => {
    let ada: Ada = {} as any

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    describe("Should not permit invalid scripts", async () => {
        for (const { testname, script, invalidDataReason: expectedInvalidDataReason } of InvalidScriptTestcases) {
            it(testname, async () => {
                const promise = ada.deriveNativeScriptHash({
                    script,
                    displayFormat: NativeScriptHashDisplayFormat.BECH32,
                })
                await expect(promise).to.be.rejectedWith(InvalidData, expectedInvalidDataReason)
            })
        }
    })
})

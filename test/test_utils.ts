// @ts-ignore
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid"
import SpeculosTransport from "@ledgerhq/hw-transport-node-speculos"
import * as blake2 from "blake2"
import { expect } from "chai"
import { ImportMock } from "ts-mock-imports"
import type { FixlenHexString} from "types/internal"

import { Ada, utils } from "../src/Ada"
import { InvalidDataReason } from "../src/errors/index"
import type { TxAuxiliaryDataSupplement,Witness } from "../src/types/public"
import * as parseModule from "../src/utils/parse"

export function shouldUseSpeculos(): boolean {
    return process.env.LEDGER_TRANSPORT === 'speculos'
}

export function getTransport() {
    return shouldUseSpeculos()
        ? SpeculosTransport.open({apduPort: 9999})
        : TransportNodeHid.create(1000)
}

export async function getAda() {
    const transport = await getTransport()

    const ada = new Ada(transport);
    (ada as any).t = transport
    return Promise.resolve(ada)
}

export function turnOffValidation() {
    const validate_mock = ImportMock.mockFunction(parseModule, 'validate')

    const fns = ['isString', 'isInteger', 'isArray', 'isBuffer', 'isHexString', 'isHexStringOfLength', 'isValidPath']
    /* @ts-ignore */
    const mocks = fns.map((fn) => ImportMock.mockFunction(parseModule, fn, true))

    return () => {
        validate_mock.restore()
        mocks.forEach((mock) => mock.restore())
    }
}

export function describeWithoutValidation(title: string, test: () => void) {
    describe(title, async () => {
        let restoreValidation: () => void

        before(() => {
            restoreValidation = turnOffValidation()
        })

        after(() => {
            restoreValidation()
        })

        test()
    })
}

const ProtocolMagics = {
    MAINNET: 764824073,
    TESTNET: 42,
}

const NetworkIds = {
    TESTNET: 0x00,
    MAINNET: 0x01,
}

export const Networks = {
    Mainnet: {
        networkId: NetworkIds.MAINNET,
        protocolMagic: ProtocolMagics.MAINNET,
    },
    Testnet: {
        networkId: NetworkIds.TESTNET,
        protocolMagic: ProtocolMagics.TESTNET,
    },
    Fake: {
        networkId: 0x03,
        protocolMagic: 47,
    },
}

type TxHash = FixlenHexString<32>

function hashTxBody(txBodyHex: string): TxHash {
    let b2 = blake2.createHash("blake2b", { digestLength: 32 })
    b2.update(Buffer.from(txBodyHex, 'hex'))
    return parseModule.parseHexStringOfLength(b2.digest('hex'), 32, InvalidDataReason.INVALID_B2_HASH)
}

export type NetworkIdlessTestResult = {
    txHashHex: string,
    witnesses: Array<Witness>,
    auxiliaryDataSupplement: TxAuxiliaryDataSupplement | null,
}

export function bech32_to_hex(str: string): string {
    return utils.buf_to_hex(utils.bech32_decodeAddress(str))
}

export const DontRunOnLedger: string = "DO NOT RUN ON LEDGER"

export function describeRejects(name: string, testList: any) {
    describe(name + "_JS", async () => {
        let ada: Ada = {} as Ada
    
        beforeEach(async () => {
            ada = await getAda()
        })
    
        afterEach(async () => {
            await (ada as any).t.close()
        })
    
        for (const {testname, tx, additionalWitnessPaths, signingMode, rejectReason } of testList) {
            it(testname, async() => {
                if (rejectReason === InvalidDataReason.LEDGER_POLICY) {
                    return
                }
                const response = ada.signTransaction({
                    tx,
                    signingMode,
                    additionalWitnessPaths: additionalWitnessPaths || [] ,
                })
                await expect(response).to.be.rejectedWith(rejectReason)
            })
        }
    })
    
    describeWithoutValidation(name + "_Ledger", async () => {
        let ada: Ada = {} as Ada
    
        beforeEach(async () => {
            ada = await getAda()
        })
    
        afterEach(async () => {
            await (ada as any).t.close()
        })
    
        for (const {testname, tx, additionalWitnessPaths, signingMode, errCls, errMsg } of testList) {
            it(testname, async() => {
                if (errMsg === DontRunOnLedger) {
                    return
                }
                const response = ada.signTransaction({
                    tx,
                    signingMode,
                    additionalWitnessPaths: additionalWitnessPaths || [],
                })
                await expect(response).to.be.rejectedWith(errCls, errMsg)
            })
        }
    })
}

export function describePositiveTest(name: string, tests: any[]) {
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


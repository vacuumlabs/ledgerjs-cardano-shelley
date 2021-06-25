import type { NativeScript} from "../../../src/Ada"
import { InvalidDataReason, NativeScriptType } from "../../../src/Ada"

type InvalidScriptTestcase = {
    testname: string,
    script: NativeScript,
    invalidDataReason: InvalidDataReason,
}

export const InvalidScriptTestcases: InvalidScriptTestcase[] = [
    {
        testname: "PUBKEY - invalid key path",
        script: {
            type: NativeScriptType.PUBKEY_DEVICE_OWNED,
            params: {
                path: [0, 0, 0, 0, 0, 0],
            },
        },
        invalidDataReason: InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_KEY_PATH,
    },
    {
        testname: "PUBKEY - invalid key hash (too short)",
        script: {
            type: NativeScriptType.PUBKEY_THIRD_PARTY,
            params: {
                keyHashHex: '3a55d9f68255dfbefa1efd711f82d005fae1be2e145d616c90cf0fa',
            },
        },
        invalidDataReason: InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_KEY_HASH,
    },
    {
        testname: "PUBKEY - invalid key hash (not hex)",
        script: {
            type: NativeScriptType.PUBKEY_THIRD_PARTY,
            params: {
                keyHashHex: '3g55d9f68255dfbefa1efd711f82d005fae1be2e145d616c90cf0fa9',
            },
        },
        invalidDataReason: InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_KEY_HASH,
    },
    {
        testname: "N_OF_K - invalid required count (negative number)",
        script: {
            type: NativeScriptType.N_OF_K,
            params: {
                requiredCount: -1,
                scripts: [
                    {
                        type: NativeScriptType.PUBKEY_THIRD_PARTY,
                        params: {
                            keyHashHex: '3a55d9f68255dfbefa1efd711f82d005fae1be2e145d616c90cf0fa9',
                        },
                    },
                ],
            },
        },
        invalidDataReason: InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_REQUIRED_COUNT,
    },
    {
        testname: "N_OF_K - invalid required count (higher than number of scripts)",
        script: {
            type: NativeScriptType.N_OF_K,
            params: {
                requiredCount: 1,
                scripts: [],
            },
        },
        invalidDataReason: InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_REQUIRED_COUNT_HIGHER_THAN_NUMBER_OF_SCRIPTS,
    },
    {
        testname: "INVALID_BEFORE - invalid invalidBefore (negative number) as a subscript",
        script: {
            type: NativeScriptType.ANY,
            params: {
                scripts: [
                    {
                        type: NativeScriptType.PUBKEY_THIRD_PARTY,
                        params: {
                            keyHashHex: '3a55d9f68255dfbefa1efd711f82d005fae1be2e145d616c90cf0fa9',
                        },
                    },
                    {
                        type: NativeScriptType.INVALID_BEFORE,
                        params: {
                            slot: -1,
                        },
                    },
                ],
            },
        },
        invalidDataReason: InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_TOKEN_LOCKING_SLOT,
    },
    {
        testname: "INVALID_HEREAFTER - invalid invalidHereafter (negative number)",
        script: {
            type: NativeScriptType.INVALID_HEREAFTER,
            params: {
                slot: -1,
            },
        },
        invalidDataReason: InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_TOKEN_LOCKING_SLOT,
    },
]

import type { NativeScript} from "../../../src/Ada"
import { ScriptType } from "../../../src/Ada"
import { InvalidDataReason} from "../../../src/Ada"

type InvalidScriptTestcase = {
    testname: string,
    script: NativeScript,
    invalidDataReason: InvalidDataReason,
}

export const InvalidScriptTestcases: InvalidScriptTestcase[] = [
    {
        testname: "invalid key hash (too short)",
        script: {
            type: ScriptType.PUBKEY,
            params: {
                keyHash: 'invalid key hash',
            },
        },
        invalidDataReason: InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_KEY_HASH,
    },
    {
        testname: "invalid key hash (not hex)",
        script: {
            type: ScriptType.PUBKEY,
            params: {
                keyHash: '3g55d9f68255dfbefa1efd711f82d005fae1be2e145d616c90cf0fa9',
            },
        },
        invalidDataReason: InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_KEY_HASH,
    },
    {
        testname: "invalid required count (negative number)",
        script: {
            type: ScriptType.N_OF_K,
            params: {
                requiredCount: -1,
                scripts: [],
            },
        },
        invalidDataReason: InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_REQUIRED_COUNT,
    },
    {
        testname: "invalid script in scripts (invalid nested)",
        script: {
            type: ScriptType.ANY,
            params: {
                scripts: [
                    {
                        type: ScriptType.PUBKEY,
                        params: {
                            keyHash: '3a55d9f68255dfbefa1efd711f82d005fae1be2e145d616c90cf0fa9',
                        },
                    },
                    {
                        type: ScriptType.INVALID_BEFORE,
                        params: {
                            invalidBefore: -1,
                        },
                    },
                ],
            },
        },
        invalidDataReason: InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_INVALID_BEFORE,
    },
]

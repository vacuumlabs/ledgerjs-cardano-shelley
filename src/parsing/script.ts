import { InvalidData, InvalidDataReason } from "../errors"
import type { ParsedScript } from "../types/internal"
import { KEY_HASH_LENGTH } from "../types/internal"
import type { bigint_like, NativeScript} from "../types/public"
import { ScriptType } from "../types/public"
import { isArray, parseHexStringOfLength, parseUint32_t, parseUint64_str, validate } from "../utils/parse"

export function parseScript(
    script: NativeScript
): ParsedScript {
    // union of all param fields
    const params = script.params as {
        keyHash?: string,
        requiredCount?: bigint_like,
        invalidBefore?: bigint_like,
        invalidHereafter?: bigint_like,
        scripts?: NativeScript[],
    }

    const type = script.type

    switch (type) {
    case ScriptType.PUBKEY: {
        const keyHashHex = parseHexStringOfLength(params.keyHash, KEY_HASH_LENGTH, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_KEY_HASH)
        return {
            type,
            params: {
                keyHashHex,
            },
        }
    }
    case ScriptType.ALL:
    case ScriptType.ANY: {
        validate(isArray(params.scripts), InvalidDataReason.DERIVE_SCRIPT_HASH_SCRIPTS_NOT_AN_ARRAY)
        const scripts = params.scripts.map(parseScript)
        return {
            type,
            params: {
                scripts,
            },
        }
    }
    case ScriptType.N_OF_K: {
        validate(isArray(params.scripts), InvalidDataReason.DERIVE_SCRIPT_HASH_SCRIPTS_NOT_AN_ARRAY)
        const requiredCount = parseUint32_t(params.requiredCount, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_REQUIRED_COUNT)
        const scripts = params.scripts.map(parseScript)
        return {
            type,
            params: {
                requiredCount,
                scripts,
            },
        }
    }
    case ScriptType.INVALID_BEFORE: {
        const invalidBefore = parseUint64_str(params.invalidBefore, {}, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_INVALID_BEFORE)
        return {
            type,
            params: {
                invalidBefore,
            },
        }
    }
    case ScriptType.INVALID_HEREAFTER: {
        const invalidHereafter = parseUint64_str(params.invalidHereafter, {}, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_INVALID_HEREAFTER)
        return {
            type,
            params: {
                invalidHereafter,
            },
        }
    }
    default:
        throw new InvalidData(InvalidDataReason.DERIVE_SCRIPT_HASH_UNKNOWN_TYPE)
    }
}

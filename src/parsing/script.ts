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
        validate(params.requiredCount == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidBefore == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidHereafter == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.scripts == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)

        return {
            type,
            params: {
                keyHashHex: parseHexStringOfLength(params.keyHash, KEY_HASH_LENGTH, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_KEY_HASH),
            },
        }
    }
    case ScriptType.ALL:
    case ScriptType.ANY: {
        validate(params.keyHash == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.requiredCount == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidBefore == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidHereafter == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(isArray(params.scripts), InvalidDataReason.DERIVE_SCRIPT_HASH_SCRIPTS_NOT_AN_ARRAY)
        validate(params.scripts.length > 0, InvalidDataReason.DERIVE_SCRIPT_HASH_SCRIPTS_EMPTY_ARRAY)

        return {
            type,
            params: {
                scripts: params.scripts.map(parseScript),
            },
        }
    }
    case ScriptType.N_OF_K: {
        validate(params.keyHash == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidBefore == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidHereafter == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(isArray(params.scripts), InvalidDataReason.DERIVE_SCRIPT_HASH_SCRIPTS_NOT_AN_ARRAY)
        validate(params.scripts.length > 0, InvalidDataReason.DERIVE_SCRIPT_HASH_SCRIPTS_EMPTY_ARRAY)

        return {
            type,
            params: {
                requiredCount: parseUint32_t(params.requiredCount, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_REQUIRED_COUNT),
                scripts: params.scripts.map(parseScript),
            },
        }
    }
    case ScriptType.INVALID_BEFORE: {
        validate(params.keyHash == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.requiredCount == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidHereafter == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.scripts == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)

        return {
            type,
            params: {
                invalidBefore: parseUint64_str(params.invalidBefore, {}, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_INVALID_BEFORE),
            },
        }
    }
    case ScriptType.INVALID_HEREAFTER: {
        validate(params.keyHash == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.requiredCount == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidBefore == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.scripts == null, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_DATA)

        return {
            type,
            params: {
                invalidHereafter: parseUint64_str(params.invalidHereafter, {}, InvalidDataReason.DERIVE_SCRIPT_HASH_INVALID_INVALID_HEREAFTER),
            },
        }
    }
    default:
        throw new InvalidData(InvalidDataReason.DERIVE_SCRIPT_HASH_UNKNOWN_TYPE)
    }
}

import { InvalidData, InvalidDataReason } from "../errors"
import type { ParsedNativeScript } from "../types/internal"
import { KEY_HASH_LENGTH } from "../types/internal"
import type { bigint_like, BIP32Path, NativeScript} from "../types/public"
import { NativeScriptType } from "../types/public"
import { isArray, parseBIP32Path, parseHexStringOfLength, parseUint32_t, parseUint64_str, validate } from "../utils/parse"

export function parseNativeScript(
    script: NativeScript
): ParsedNativeScript {
    // union of all param fields
    const params = script.params as {
        path?: BIP32Path,
        keyHashHex?: string,
        requiredCount?: bigint_like,
        invalidBefore?: bigint_like,
        invalidHereafter?: bigint_like,
        scripts?: NativeScript[],
    }

    const type = script.type

    switch (type) {
    case NativeScriptType.PUBKEY_DEVICE_OWNED: {
        validate(params.keyHashHex == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.requiredCount == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidBefore == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidHereafter == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.scripts == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)

        return {
            type,
            params: {
                path: parseBIP32Path(params.path, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_KEY_PATH),
            },
        }
    }
    case NativeScriptType.PUBKEY_THIRD_PARTY: {
        validate(params.path == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.requiredCount == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidBefore == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidHereafter == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.scripts == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)

        return {
            type,
            params: {
                keyHashHex: parseHexStringOfLength(params.keyHashHex, KEY_HASH_LENGTH, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_KEY_HASH),
            },
        }
    }
    case NativeScriptType.ALL:
    case NativeScriptType.ANY: {
        validate(params.path == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.keyHashHex == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.requiredCount == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidBefore == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidHereafter == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(isArray(params.scripts), InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_SCRIPTS_NOT_AN_ARRAY)
        validate(params.scripts.length > 0, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_SCRIPTS_EMPTY_ARRAY)

        return {
            type,
            params: {
                scripts: params.scripts.map(parseNativeScript),
            },
        }
    }
    case NativeScriptType.N_OF_K: {
        validate(params.path == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.keyHashHex == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidBefore == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidHereafter == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(isArray(params.scripts), InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_SCRIPTS_NOT_AN_ARRAY)
        validate(params.scripts.length > 0, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_SCRIPTS_EMPTY_ARRAY)

        return {
            type,
            params: {
                requiredCount: parseUint32_t(params.requiredCount, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_REQUIRED_COUNT),
                scripts: params.scripts.map(parseNativeScript),
            },
        }
    }
    case NativeScriptType.INVALID_BEFORE: {
        validate(params.path == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.keyHashHex == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.requiredCount == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidHereafter == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.scripts == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)

        return {
            type,
            params: {
                invalidBefore: parseUint64_str(params.invalidBefore, {}, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_INVALID_BEFORE),
            },
        }
    }
    case NativeScriptType.INVALID_HEREAFTER: {
        validate(params.path == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.keyHashHex == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.requiredCount == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.invalidBefore == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)
        validate(params.scripts == null, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA)

        return {
            type,
            params: {
                invalidHereafter: parseUint64_str(params.invalidHereafter, {}, InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_INVALID_INVALID_HEREAFTER),
            },
        }
    }
    default:
        throw new InvalidData(InvalidDataReason.DERIVE_NATIVE_SCRIPT_HASH_UNKNOWN_TYPE)
    }
}

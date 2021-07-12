import type { ParsedComplexScript, ParsedSimpleScript, Uint8_t,Uint32_t} from "../../types/internal"
import { ScriptType } from "../../types/internal"
import { unreachable } from "../../utils/assert"
import { hex_to_buf, path_to_buf,uint8_to_buf, uint32_to_buf, uint64_to_buf } from "../../utils/serialize"

const TYPE_ENCODING = {
    [ScriptType.PUBKEY_DEVICE_OWNED]: 0 as Uint8_t,
    [ScriptType.PUBKEY_THIRD_PARTY]: 0 as Uint8_t,
    [ScriptType.ALL]: 1 as Uint8_t,
    [ScriptType.ANY]: 2 as Uint8_t,
    [ScriptType.N_OF_K]: 3 as Uint8_t,
    [ScriptType.INVALID_BEFORE]: 4 as Uint8_t,
    [ScriptType.INVALID_HEREAFTER]: 5 as Uint8_t,
}

const PUBKEY_TYPE_ENCODING = {
    [ScriptType.PUBKEY_DEVICE_OWNED]: 0 as Uint8_t,
    [ScriptType.PUBKEY_THIRD_PARTY]: 1 as Uint8_t,
}

export function serializeComplexScriptStart(
    script: ParsedComplexScript
): Buffer {
    switch (script.type) {
    case ScriptType.ALL:
    case ScriptType.ANY:
        return Buffer.concat([
            uint8_to_buf(TYPE_ENCODING[script.type]),
            uint32_to_buf(script.params.scripts.length as Uint32_t),
        ])
    case ScriptType.N_OF_K:
        return Buffer.concat([
            uint8_to_buf(TYPE_ENCODING[script.type]),
            uint32_to_buf(script.params.requiredCount), // N
            uint32_to_buf(script.params.scripts.length as Uint32_t), // K
        ])
    default:
        unreachable(script)
    }
}

export function serializeSimpleScript(
    script: ParsedSimpleScript
): Buffer {
    switch (script.type) {
    case ScriptType.PUBKEY_DEVICE_OWNED:
        return Buffer.concat([
            uint8_to_buf(TYPE_ENCODING[script.type]),
            uint8_to_buf(PUBKEY_TYPE_ENCODING[script.type]),
            path_to_buf(script.params.path),
        ])
    case ScriptType.PUBKEY_THIRD_PARTY:
        return Buffer.concat([
            uint8_to_buf(TYPE_ENCODING[script.type]),
            uint8_to_buf(PUBKEY_TYPE_ENCODING[script.type]),
            hex_to_buf(script.params.keyHashHex),
        ])
    case ScriptType.INVALID_BEFORE:
        return Buffer.concat([
            uint8_to_buf(TYPE_ENCODING[script.type]),
            uint64_to_buf(script.params.invalidBefore),
        ])
    case ScriptType.INVALID_HEREAFTER:
        return Buffer.concat([
            uint8_to_buf(TYPE_ENCODING[script.type]),
            uint64_to_buf(script.params.invalidHereafter),
        ])
    default:
        unreachable(script)
    }
}

export function serializeComplexScriptFinish(
    _script: ParsedComplexScript
): Buffer {
    return Buffer.from([])
}

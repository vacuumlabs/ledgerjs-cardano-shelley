import type { ParsedComplexScript, ParsedSimpleScript } from "../../types/internal"

export function serializeScriptHeader(
    _script: ParsedComplexScript
): Buffer {
    return Buffer.from([])
}

export function serializeScript(
    _script: ParsedSimpleScript
): Buffer {
    return Buffer.from([])
}

export function serializeScriptFinished(
    _script: ParsedComplexScript
): Buffer {
    return Buffer.from([])
}

import type { NativeScriptHashDisplayFormat, ParsedComplexNativeScript, ParsedSimpleNativeScript } from "../../types/internal"

export function serializeComplexNativeScriptStart(
    _script: ParsedComplexNativeScript
): Buffer {
    return Buffer.from([])
}

export function serializeSimpleNativeScript(
    _script: ParsedSimpleNativeScript
): Buffer {
    return Buffer.from([])
}

export function serializeWholeNativeScriptFinish(
    _displayFormat: NativeScriptHashDisplayFormat
): Buffer {
    return Buffer.from([])
}


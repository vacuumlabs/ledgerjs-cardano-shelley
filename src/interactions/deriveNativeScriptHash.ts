import { DeviceVersionUnsupported } from "../errors"
import type { ParsedComplexNativeScript, ParsedNativeScript, ParsedSimpleNativeScript} from "../types/internal"
import { NATIVE_SCRIPT_HASH_LENGTH } from "../types/internal"
import type { DerivedNativeScriptHash, Version } from "../types/public"
import { NativeScriptType } from "../types/public"
import { INS } from "./common/ins"
import type { Interaction, SendParams } from "./common/types"
import { ensureLedgerAppVersionCompatible, getCompatibility } from "./getVersion"
import { serializeComplexNativeScriptFinish, serializeComplexNativeScriptStart, serializeSimpleNativeScript } from "./serialization/nativeScript"

const send = (params: {
    p1: number,
    p2: number,
    data: Buffer,
    expectedResponseLength?: number
  }): SendParams => ({ ins: INS.DERIVE_NATIVE_SCRIPT_HASH, ...params })

const enum P1 {
    STAGE_SCRIPT_HEADER = 0x01,
    STAGE_SCRIPT = 0x02,
    STAGE_SCRIPT_FINISHED = 0x03,
}

const enum P2 {
    UNUSED = 0x00,
}

type ScriptHashResponse<B> = B extends true ? { scriptHashHex: string } : void

function responseIf<B extends boolean>(predicate: B, response: Buffer) {
    return (predicate ? {
        scriptHashHex: response.toString('hex'),
    } : undefined) as ScriptHashResponse<B>
}

function *deriveNativeScriptHash_startComplexScript(
    script: ParsedComplexNativeScript,
): Interaction<void> {
    yield send({
        p1: P1.STAGE_SCRIPT_HEADER,
        p2: P2.UNUSED,
        data: serializeComplexNativeScriptStart(script),
        expectedResponseLength: 0,
    })
}

function *deriveNativeScriptHash_addSimpleScript<B extends boolean>(
    script: ParsedSimpleNativeScript,
    expectsResponse: B,
): Interaction<ScriptHashResponse<B>> {
    const response = yield send({
        p1: P1.STAGE_SCRIPT,
        p2: P2.UNUSED,
        data: serializeSimpleNativeScript(script),
        expectedResponseLength: expectsResponse ? NATIVE_SCRIPT_HASH_LENGTH : 0,
    })
    return responseIf(expectsResponse, response)
}

function *deriveNativeScriptHash_finishComplexScript<B extends boolean>(
    script: ParsedComplexNativeScript,
    expectsResponse: B,
): Interaction<ScriptHashResponse<B>> {
    const response = yield send({
        p1: P1.STAGE_SCRIPT_FINISHED,
        p2: P2.UNUSED,
        data: serializeComplexNativeScriptFinish(script),
        expectedResponseLength: expectsResponse ? NATIVE_SCRIPT_HASH_LENGTH : 0,
    })
    return responseIf(expectsResponse, response)
}

function isComplexScript(script: ParsedNativeScript): script is ParsedComplexNativeScript {
    return script.type === NativeScriptType.ALL || script.type === NativeScriptType.ANY || script.type === NativeScriptType.N_OF_K
}

function *deriveNativeScriptHash_addScript<B extends boolean>(
    script: ParsedNativeScript,
    expectsResponse: B,
): Interaction<ScriptHashResponse<B>> {
    if (isComplexScript(script)) {
        yield* deriveNativeScriptHash_startComplexScript(script)
        for (const subscript of script.params.scripts) {
            yield* deriveNativeScriptHash_addScript(subscript, false)
        }
        return yield* deriveNativeScriptHash_finishComplexScript(script, expectsResponse)
    } else {
        return yield* deriveNativeScriptHash_addSimpleScript(script, expectsResponse)
    }
}

function ensureNativeScriptHashDerivationSupportedByAppVersion(
    version: Version
): void {
    if (!getCompatibility(version).supportsNativeScriptHashDerivation) {
        throw new DeviceVersionUnsupported(`Script hash derivation not supported by Ledger app version ${version}.`)
    }
}

export function* deriveNativeScriptHash(
    version: Version,
    script: ParsedNativeScript,
): Interaction<DerivedNativeScriptHash> {
    ensureLedgerAppVersionCompatible(version)
    ensureNativeScriptHashDerivationSupportedByAppVersion(version)

    const { scriptHashHex } = yield* deriveNativeScriptHash_addScript(script, true)

    return {
        scriptHashHex,
    }
}

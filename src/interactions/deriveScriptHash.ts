import { DeviceVersionUnsupported } from "../errors"
import type { ParsedComplexScript, ParsedScript, ParsedSimpleScript} from "../types/internal"
import { SCRIPT_HASH_LENGTH } from "../types/internal"
import type { DerivedScriptHash, Version } from "../types/public"
import { ScriptType } from "../types/public"
import { INS } from "./common/ins"
import type { Interaction, SendParams } from "./common/types"
import { ensureLedgerAppVersionCompatible, getCompatibility } from "./getVersion"
import { serializeSimpleScript, serializeComplexScriptFinish, serializeComplexScriptStart } from "./serialization/script"

const send = (params: {
    p1: number,
    p2: number,
    data: Buffer,
    expectedResponseLength?: number
  }): SendParams => ({ ins: INS.DERIVE_SCRIPT_HASH, ...params })

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

function *deriveScriptHash_startComplexScript(
    script: ParsedComplexScript,
): Interaction<void> {
    yield send({
        p1: P1.STAGE_SCRIPT_HEADER,
        p2: P2.UNUSED,
        data: serializeComplexScriptStart(script),
        expectedResponseLength: 0,
    })
}

function *deriveScriptHash_addSimpleScript<B extends boolean>(
    script: ParsedSimpleScript,
    expectsResponse: B,
): Interaction<ScriptHashResponse<B>> {
    const response = yield send({
        p1: P1.STAGE_SCRIPT,
        p2: P2.UNUSED,
        data: serializeSimpleScript(script),
        expectedResponseLength: expectsResponse ? SCRIPT_HASH_LENGTH : 0,
    })
    return responseIf(expectsResponse, response)
}

function *deriveScriptHash_finishComplexScript<B extends boolean>(
    script: ParsedComplexScript,
    expectsResponse: B,
): Interaction<ScriptHashResponse<B>> {
    const response = yield send({
        p1: P1.STAGE_SCRIPT_FINISHED,
        p2: P2.UNUSED,
        data: serializeComplexScriptFinish(script),
        expectedResponseLength: expectsResponse ? SCRIPT_HASH_LENGTH : 0,
    })
    return responseIf(expectsResponse, response)
}

function isComplexScript(script: ParsedScript): script is ParsedComplexScript {
    return script.type === ScriptType.ALL || script.type === ScriptType.ANY || script.type === ScriptType.N_OF_K
}

function *deriveScriptHash_addScript<B extends boolean>(
    script: ParsedScript,
    expectsResponse: B,
): Interaction<ScriptHashResponse<B>> {
    if (isComplexScript(script)) {
        yield* deriveScriptHash_startComplexScript(script)
        for (const subscript of script.params.scripts) {
            yield* deriveScriptHash_addScript(subscript, false)
        }
        return yield* deriveScriptHash_finishComplexScript(script, expectsResponse)
    } else {
        return yield* deriveScriptHash_addSimpleScript(script, expectsResponse)
    }
}

function ensureScriptHashDerivationSupportedByAppVersion(
    version: Version
): void {
    if (!getCompatibility(version).supportsScriptHashDerivation) {
        throw new DeviceVersionUnsupported(`Script hash derivation not supported by Ledger app version ${version}.`)
    }
}

export function* deriveScriptHash(
    version: Version,
    script: ParsedScript,
): Interaction<DerivedScriptHash> {
    ensureLedgerAppVersionCompatible(version)
    ensureScriptHashDerivationSupportedByAppVersion(version)

    const { scriptHashHex } = yield* deriveScriptHash_addScript(script, true)

    return {
        scriptHashHex,
    }
}

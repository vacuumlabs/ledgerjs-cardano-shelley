import type { ParsedScript } from "../types/internal"
import type { DerivedScriptHash, Version } from "../types/public"
import { INS } from "./common/ins"
import type { Interaction, SendParams } from "./common/types"
import { serializeScript } from "./serialization/script"

const send = (params: {
    p1: number,
    p2: number,
    data: Buffer,
    expectedResponseLength?: number
  }): SendParams => ({ ins: INS.DERIVE_SCRIPT_HASH, ...params })

export function* deriveScriptHash(
    _version: Version,
    script: ParsedScript,
): Interaction<DerivedScriptHash> {
    const P1_RETURN = 0x01
    const P2_UNUSED = 0x00

    const response = yield send({
        p1: P1_RETURN,
        p2: P2_UNUSED,
        data: serializeScript(script),
    })

    return {
        scriptHashHex: response.toString("hex"),
    }
}

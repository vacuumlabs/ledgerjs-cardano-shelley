import type { ParsedTransaction, Uint8_t, Uint32_t, Version } from "../../types/internal"
import { TransactionSigningMode } from "../../types/internal"
import { assert } from "../../utils/assert"
import { serializeOptionFlag,uint8_to_buf, uint32_to_buf } from "../../utils/serialize"
import { getCompatibility } from "../getVersion"

const _serializeSigningMode = (
    mode: TransactionSigningMode
): Buffer => {
    const value = {
        [TransactionSigningMode.ORDINARY_TRANSACTION]: 3 as Uint8_t,
        [TransactionSigningMode.POOL_REGISTRATION_AS_OWNER]: 4 as Uint8_t,
        [TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR]: 5 as Uint8_t,
        [TransactionSigningMode.MULTISIG_TRANSACTION]: 6 as Uint8_t,
    }[mode]

    assert(value !== undefined, 'Invalid signing mode')

    return uint8_to_buf(value)
}

export function serializeTxInit(
    tx: ParsedTransaction,
    signingMode: TransactionSigningMode,
    numWitnesses: number,
    version: Version,
) {
    const mintBuffer = getCompatibility(version).supportsMint
        ? serializeOptionFlag(tx.mint != null)
        : Buffer.from([])
    const scriptDataHashBuffer = getCompatibility(version).supportsAlonzo
        ? serializeOptionFlag(tx.scriptDataHashHex != null)
        : Buffer.from([])
    const collateralsBuffer = getCompatibility(version).supportsAlonso
        ? uint32_to_buf(tx.collaterals.length as Uint32_t)
        : Buffer.from([])
    const requiredSignersBuffer = getCompatibility(version).supportsAlonso
        ? uint32_to_buf(tx.requiredSigners.length as Uint32_t)
        : Buffer.from([])

    return Buffer.concat([
        uint8_to_buf(tx.network.networkId),
        uint32_to_buf(tx.network.protocolMagic),
        serializeOptionFlag(tx.ttl != null),
        serializeOptionFlag(tx.auxiliaryData != null),
        serializeOptionFlag(tx.validityIntervalStart != null),
        mintBuffer,
        scriptDataHashBuffer,
        _serializeSigningMode(signingMode),
        uint32_to_buf(tx.inputs.length as Uint32_t),
        uint32_to_buf(tx.outputs.length as Uint32_t),
        uint32_to_buf(tx.certificates.length as Uint32_t),
        uint32_to_buf(tx.withdrawals.length as Uint32_t),
        uint32_to_buf(numWitnesses as Uint32_t),
        collateralsBuffer,
        requiredSignersBuffer,
    ])
}

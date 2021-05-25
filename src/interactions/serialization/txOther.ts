import type { Int64_str, ParsedAssetGroup, ParsedInput, ParsedToken, ParsedWithdrawal, Uint32_t, Uint64_str, ValidBIP32Path } from "../../types/internal"
import { hex_to_buf, path_to_buf, uint32_to_buf, uint64_to_buf } from "../../utils/serialize"
import type {SerializingFunction} from "../signTx"

export function serializeTxInput(
    input: ParsedInput
) {
    return Buffer.concat([
        hex_to_buf(input.txHashHex),
        uint32_to_buf(input.outputIndex),
    ])
}

export function serializeTxWithdrawal(
    withdrawal: ParsedWithdrawal
) {
    return Buffer.concat([
        uint64_to_buf(withdrawal.amount),
        path_to_buf(withdrawal.path),
    ])
}

export function serializeTxFee(
    fee: Uint64_str
) {
    return Buffer.concat([
        uint64_to_buf(fee),
    ])
}

export function serializeTxTtl(
    ttl: Uint64_str
) {
    return Buffer.concat([
        uint64_to_buf(ttl),
    ])
}

export function serializeTxValidityStart(
    validityIntervalStart: Uint64_str
) {
    return Buffer.concat([
        uint64_to_buf(validityIntervalStart),
    ])
}

export function serializeTxWitnessRequest(
    path: ValidBIP32Path
) {
    return Buffer.concat([
        path_to_buf(path),
    ])
}

export function serializeAssetGroup<Type>(assetGroup: ParsedAssetGroup<Type>) {
    return Buffer.concat([
        hex_to_buf(assetGroup.policyIdHex),
        uint32_to_buf(assetGroup.tokens.length as Uint32_t),
    ])
}

export function serializeToken<Type>(token: ParsedToken<Type>, parseFn: SerializingFunction<Type>) {
    return Buffer.concat([
        uint32_to_buf(token.assetNameHex.length / 2 as Uint32_t),
        hex_to_buf(token.assetNameHex),
        parseFn(token.amount),
    ])
}

export function serializeMintBasicParams(mint: Array<ParsedAssetGroup<Int64_str>>) {
    return Buffer.concat([
        uint32_to_buf(mint.length as Uint32_t),
    ])
}
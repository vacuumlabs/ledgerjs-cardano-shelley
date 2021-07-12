import { InvalidDataReason } from "../../errors/invalidDataReason"
import { validate } from "../../utils/parse"
import { Int64_str, MultisigIdentifierType, ParsedAssetGroup, ParsedInput, ParsedToken, ParsedWithdrawal, Uint32_t, Uint64_str, ValidBIP32Path } from "../../types/internal"
import { hex_to_buf, path_to_buf, uint32_to_buf, uint64_to_buf, multisig_identifier_to_buf } from "../../utils/serialize"
import type {SerializeTokenAmountFn} from "../signTx"

export function serializeTxInput(
    input: ParsedInput
) {
    return Buffer.concat([
        hex_to_buf(input.txHashHex),
        uint32_to_buf(input.outputIndex),
    ])
}

export function serializeTxWithdrawalPreMultisig(
    withdrawal: ParsedWithdrawal
) {
    validate(MultisigIdentifierType.KEY_PATH == withdrawal.identifier.type, InvalidDataReason.WITHDRAWAL_INVALID_IDENTIFIER)
    return Buffer.concat([
        uint64_to_buf(withdrawal.amount),
        path_to_buf(withdrawal.identifier.path),
    ])
}

export function serializeTxWithdrawal(
    withdrawal: ParsedWithdrawal
) {
    return Buffer.concat([
        uint64_to_buf(withdrawal.amount),
        multisig_identifier_to_buf(withdrawal.identifier),
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

export function serializeAssetGroup<T>(assetGroup: ParsedAssetGroup<T>) {
    return Buffer.concat([
        hex_to_buf(assetGroup.policyIdHex),
        uint32_to_buf(assetGroup.tokens.length as Uint32_t),
    ])
}

export function serializeToken<T>(token: ParsedToken<T>, serializeTokenAmountFn: SerializeTokenAmountFn<T>) {
    return Buffer.concat([
        uint32_to_buf(token.assetNameHex.length / 2 as Uint32_t),
        hex_to_buf(token.assetNameHex),
        serializeTokenAmountFn(token.amount),
    ])
}

export function serializeMintBasicParams(mint: Array<ParsedAssetGroup<Int64_str>>) {
    return Buffer.concat([
        uint32_to_buf(mint.length as Uint32_t),
    ])
}

import {MAX_DATUM_CHUNK_SIZE} from "../../parsing/constants"
import type {HexString, OutputDestination, ParsedOutput, Uint8_t,Uint32_t} from "../../types/internal"
import {TxOutputDestinationType} from "../../types/internal"
import type {Version} from "../../types/public"
import {DatumType, TxOutputType} from "../../types/public"
import {unreachable} from "../../utils/assert"
import {hex_to_buf, serializeOptionFlag, uint8_to_buf,uint32_to_buf, uint64_to_buf} from "../../utils/serialize"
import {getCompatibility} from "../getVersion"
import {serializeAddressParams} from "./addressParams"

function serializeTxOutputDestination(
    destination: OutputDestination,
    version: Version,) {
    const typeEncoding = {
        [TxOutputDestinationType.THIRD_PARTY]: 1 as Uint8_t,
        [TxOutputDestinationType.DEVICE_OWNED]: 2 as Uint8_t,
    }

    switch (destination.type) {
    case TxOutputDestinationType.THIRD_PARTY:
        return Buffer.concat([
            uint8_to_buf(typeEncoding[destination.type]),
            uint32_to_buf(destination.addressHex.length / 2 as Uint32_t),
            hex_to_buf(destination.addressHex),
        ])
    case TxOutputDestinationType.DEVICE_OWNED:
        return Buffer.concat([
            uint8_to_buf(typeEncoding[destination.type]),
            serializeAddressParams(destination.addressParams, version),
        ])
    default:
        unreachable(destination)
    }
}

export function serializeTxOutputBasicParams(
    output: ParsedOutput,
    version: Version,
): Buffer {
    const serializationFormatBuffer = getCompatibility(version).supportsBabbage
        ? uint8_to_buf(output.type as Uint8_t)
        : Buffer.from([])

    const hasDatum = output.datum != null

    const datumOptionBuffer = getCompatibility(version).supportsAlonzo
        ? serializeOptionFlag(hasDatum)
        : Buffer.from([])

    return Buffer.concat([
        serializationFormatBuffer,
        serializeTxOutputDestination(output.destination, version),
        uint64_to_buf(output.amount),
        uint32_to_buf(output.tokenBundle.length as Uint32_t),
        datumOptionBuffer,
    ])
}

export function serializeTxOutputDatum(
    output: ParsedOutput,
    version: Version,
): Buffer {

    if (output.type === TxOutputType.MAP_BABBAGE) {

        switch (output.datum?.type) {
        case DatumType.HASH: {
            return Buffer.concat([
                uint8_to_buf(DatumType.HASH as Uint8_t),
                hex_to_buf(output.datum.datumHashHex),
            ])
        }

        case DatumType.INLINE: {
            const totalDatumSize = output.datum.datumHex.length / 2
            let chunkHex: HexString

            if (totalDatumSize > MAX_DATUM_CHUNK_SIZE) {
                chunkHex = output.datum.datumHex.substr(0, MAX_DATUM_CHUNK_SIZE * 2) as HexString
            } else {
                chunkHex = output.datum.datumHex
            }
            const chunkSize = chunkHex.length / 2

            return Buffer.concat([
                uint8_to_buf(DatumType.INLINE as Uint8_t),
                uint32_to_buf(totalDatumSize as Uint32_t),
                uint32_to_buf(chunkSize as Uint32_t), //First chunk
                hex_to_buf(chunkHex),
            ])
        }

        default:
            return Buffer.concat([])
        }

    } else {    //  Alonzo Format
        if (output.datum?.type === DatumType.HASH) {
            // Do not include datum option for legacy version
            const datumOptionBuffer = getCompatibility(version).supportsBabbage
                ? uint8_to_buf(DatumType.HASH as Uint8_t)
                : Buffer.concat([])

            return Buffer.concat([
                datumOptionBuffer,
                hex_to_buf(output.datum.datumHashHex),
            ])
        } else {
            return Buffer.concat([])
        }
    }
}


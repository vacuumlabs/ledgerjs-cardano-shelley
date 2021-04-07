import type { ParsedTxAuxiliaryData, Uint8_t } from "../../types/internal";
import { TxAuxiliaryDataType, TxMetadataType } from "../../types/internal";
import { unreachable } from "../../utils/assert";
import { hex_to_buf, uint8_to_buf } from "../../utils/serialize";

export function serializeTxAuxiliaryData(
    auxiliaryData: ParsedTxAuxiliaryData,
) {
    const auxiliaryDataTypesEncoding = {
        [TxAuxiliaryDataType.ARBITRARY_HASH]: 0x00,
    } as const;

    const metadataTypesEncoding = {
        [TxMetadataType.CATALYST_REGISTRATION]: 0x01,
    } as const;

    switch (auxiliaryData.type) {
        case TxAuxiliaryDataType.ARBITRARY_HASH: {
            return Buffer.concat([
                uint8_to_buf(auxiliaryDataTypesEncoding[auxiliaryData.type] as Uint8_t),
                hex_to_buf(auxiliaryData.hashHex)
            ]);
        }
        case TxAuxiliaryDataType.TUPLE: {
            switch (auxiliaryData.metadata.type) {
                case TxMetadataType.CATALYST_REGISTRATION:
                    return Buffer.concat([
                        uint8_to_buf(metadataTypesEncoding[auxiliaryData.metadata.type] as Uint8_t)
                    ]);
                default:
                    unreachable(auxiliaryData.metadata.type)
            }
            break;
        }
        default:
            unreachable(auxiliaryData)
    }
}

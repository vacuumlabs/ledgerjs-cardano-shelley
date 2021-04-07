import { InvalidData } from "../errors";
import { InvalidDataReason } from "../errors/invalidDataReason";
import type { ParsedTxAuxiliaryData, ParsedTxMetadata, ShelleyAddressParams } from "../types/internal";
import type { Network,TxAuxiliaryData, TxMetadata } from "../types/public";
import { AddressType } from "../types/public";
import { TxAuxiliaryDataType, TxMetadataType } from "../types/public";
import { parseBIP32Path, parseHexStringOfLength, parseUint64_str } from "../utils/parse";
import { validate } from "../utils/parse";
import { parseAddress } from "./address";

export function parseTxAuxiliaryData(network: Network, auxiliaryData: TxAuxiliaryData): ParsedTxAuxiliaryData {
    switch (auxiliaryData.type) {
        case TxAuxiliaryDataType.ARBITRARY_HASH: {
            return {
                type: TxAuxiliaryDataType.ARBITRARY_HASH,
                hashHex: parseHexStringOfLength(auxiliaryData.params.hashHex, 32, InvalidDataReason.AUXILIARY_DATA_INVALID_HASH)
            }
        }
        case TxAuxiliaryDataType.TUPLE: {
            return {
                type: TxAuxiliaryDataType.TUPLE,
                metadata: parseTxMetadata(network, auxiliaryData.params.metadata)
            }
        }
        default:
            throw new InvalidData(InvalidDataReason.AUXILIARY_DATA_UNKNOWN_TYPE)
    }
}

function parseTxMetadata(network: Network, metadata: TxMetadata): ParsedTxMetadata {
    switch (metadata.type) {
        case TxMetadataType.CATALYST_REGISTRATION: {
            validate(metadata.params.rewardsDestination.type !== AddressType.BYRON, InvalidDataReason.CATALYST_REGISTRATION_INVALID_REWARDS_DESTINATION_BYRON);

            return {
                type: TxMetadataType.CATALYST_REGISTRATION,
                votingPublicKey: parseHexStringOfLength(metadata.params.votingPublicKeyHex, 32, InvalidDataReason.CATALYST_REGISTRATION_INVALID_VOTING_KEY),
                stakingPath: parseBIP32Path(metadata.params.stakingPath, InvalidDataReason.CATALYST_REGISTRATION_INVALID_STAKING_KEY_PATH),
                rewardsDestination: parseAddress(network, metadata.params.rewardsDestination) as ShelleyAddressParams,
                nonce: parseUint64_str(metadata.params.nonce, {}, InvalidDataReason.CATALYST_REGISTRATION_INVALID_NONCE)
            }
        }
        default:
            throw new InvalidData(InvalidDataReason.METADATA_UNKNOWN_TYPE)
    }
}
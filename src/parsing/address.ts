import { InvalidData } from "../errors"
import { InvalidDataReason } from "../errors/invalidDataReason"
import type { ParsedAddressParams } from "../types/internal"
import { AddressType, KEY_HASH_LENGTH, StakingChoiceType } from "../types/internal"
import type { BIP32Path, BlockchainPointer, DeviceOwnedAddress, Network } from "../types/public"
import { parseBIP32Path, parseHexStringOfLength, parseUint32_t, validate } from "../utils/parse"
import { parseNetwork } from "./network"

export function parseAddress(
    network: Network,
    address: DeviceOwnedAddress
): ParsedAddressParams {
    const parsedNetwork = parseNetwork(network)

    // Cast to union of all param fields
    const params = address.params as {
        spendingPath?: BIP32Path,
        spendingScriptHash?: string,
        stakingPath?: BIP32Path
        stakingKeyHashHex?: string
        stakingBlockchainPointer?: BlockchainPointer
        stakingScriptHash?: string
    }

    if (address.type === AddressType.BYRON) {
        validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
        validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
        validate(params.stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)

        return {
            type: address.type,
            protocolMagic: parsedNetwork.protocolMagic,
            spendingPath: parseBIP32Path(params.spendingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH),
            stakingChoice: { type: StakingChoiceType.NO_STAKING },
        }
    }

    const networkId = parsedNetwork.networkId

    switch (address.type) {
        /*
        // TODO figure this one out
        case AddressType.BASE_PAYMENT_KEY_STAKE_KEY:
        case AddressType.BASE_PAYMENT_SCRIPT_STAKE_KEY:
        case AddressType.BASE_PAYMENT_KEY_STAKE_SCRIPT:
        case AddressType.BASE_PAYMENT_SCRIPT_STAKE_SCRIPT:
        case AddressType.POINTER_KEY:
        case AddressType.POINTER_SCRIPT:
        case AddressType.ENTERPRISE_KEY:
        case AddressType.ENTERPRISE_SCRIPT:
        case AddressType.REWARD_KEY:
        case AddressType.REWARD_SCRIPT:
*/
        /*
    return {
            type: address.type,
            networkId: parsedNetwork.networkId,
            // networkId: Uint8_t(1),
            spendingPath: parseBIP32Path(params.spendingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH),
            stakingChoice: {
                type: StakingChoiceType.NO_STAKING
            }
         }
        break;
        case AddressType.BASE: {
            */
/*
            validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)

            const spendingPath = parseBIP32Path(params.spendingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)

            const _hash = params.stakingKeyHashHex != null ? 'hash' : ''
            const _path = params.stakingPath != null ? 'path' : ''

            switch (_hash + _path) {
                case 'hash': {
                    const hashHex = parseHexStringOfLength(params.stakingKeyHashHex!, KEY_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_STAKING_KEY_HASH)
                    return {
                        type: address.type,
                        networkId,
                        spendingPath,
                        stakingChoice: {
                            type: StakingChoiceType.STAKING_KEY_HASH,
                            hashHex,
                        },
                    }
                }
*/
                /*

        case 'path': {
            const path = parseBIP32Path(params.stakingPath!, InvalidDataReason.ADDRESS_INVALID_STAKING_KEY_PATH)

            return {
                type: address.type,
                networkId,
                spendingPath,
                stakingChoice: {
                    type: StakingChoiceType.STAKING_KEY_PATH,
                    path,
                },
            }
        }

        default:
            throw new InvalidData(InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
        }
    }
    case AddressType.ENTERPRISE: {
        validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
        validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
        validate(params.stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)

        const spendingPath = parseBIP32Path(params.spendingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)

        return {
            type: address.type,
            networkId,
            spendingPath,
            stakingChoice: {
                type: StakingChoiceType.NO_STAKING,
            },
        }
    }
    case AddressType.POINTER: {
        validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
        validate(params.stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)

        validate(params.stakingBlockchainPointer != null, InvalidDataReason.ADDRESS_INVALID_BLOCKCHAIN_POINTER)
        const pointer = params.stakingBlockchainPointer!

        const spendingPath = parseBIP32Path(params.spendingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)

        return {
            type: address.type,
            networkId,
            spendingPath,
            stakingChoice: {
                type: StakingChoiceType.BLOCKCHAIN_POINTER,
                pointer: {
                    blockIndex: parseUint32_t(pointer.blockIndex, InvalidDataReason.ADDRESS_INVALID_BLOCKCHAIN_POINTER),
                    txIndex: parseUint32_t(pointer.txIndex, InvalidDataReason.ADDRESS_INVALID_BLOCKCHAIN_POINTER),
                    certificateIndex: parseUint32_t(pointer.certificateIndex, InvalidDataReason.ADDRESS_INVALID_BLOCKCHAIN_POINTER),
                },
            },
        }
    }
    case AddressType.REWARD: {
        validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
        validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
        validate(params.spendingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)

        const stakingPath = parseBIP32Path(params.stakingPath, InvalidDataReason.ADDRESS_INVALID_STAKING_KEY_PATH)

        return {
            type: address.type,
            networkId,
            // this is intentional, reward address staking path is actually passed as a spending path at APDU level
            spendingPath: stakingPath,
            stakingChoice: {
                type: StakingChoiceType.NO_STAKING,
            },
        }
*/
    default:
        throw new InvalidData(InvalidDataReason.ADDRESS_UNKNOWN_TYPE)
    }
}

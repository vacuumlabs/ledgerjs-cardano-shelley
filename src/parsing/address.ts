import { InvalidData } from "../errors"
import { InvalidDataReason } from "../errors/invalidDataReason"
import type { ParsedAddressParams } from "../types/internal"
import { AddressType, KEY_HASH_LENGTH, SCRIPT_HASH_LENGTH, StakingChoiceType, SpendingChoiceType } from "../types/internal"
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
        validate(params.spendingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
        validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
        validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
        validate(params.stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
        validate(params.stakingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)

        return {
            type: address.type,
            protocolMagic: parsedNetwork.protocolMagic,
            spendingChoice: {
                type: SpendingChoiceType.PATH,
                path: parseBIP32Path(params.spendingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH),
            },
            stakingChoice: { type: StakingChoiceType.NO_STAKING },
        }
    }

    const networkId = parsedNetwork.networkId

    switch (address.type) {
        case AddressType.BASE_PAYMENT_KEY_STAKE_KEY: {
            validate(params.spendingPath != null, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            validate(params.spendingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            const stakingHashPresent = params.stakingKeyHashHex != null
            const stakingPathPresent = params.stakingPath != null
            validate((stakingHashPresent && !stakingPathPresent) || (!stakingHashPresent && stakingPathPresent), InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            
            const spendingPath = parseBIP32Path(params.spendingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            
            if (stakingHashPresent) {
                const hashHex = parseHexStringOfLength(params.stakingKeyHashHex!, KEY_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_STAKING_KEY_HASH)
                return {
                    type: address.type,
                    networkId,
                    spendingChoice: {
                        type: SpendingChoiceType.PATH,
                        path: spendingPath,
                    },
                    stakingChoice: {
                        type: StakingChoiceType.STAKING_KEY_HASH,
                        hashHex,
                    },
                }
            }
            const stakingPath = parseBIP32Path(params.stakingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            return {
                type: address.type,
                networkId,
                spendingChoice: {
                    type: SpendingChoiceType.PATH,
                    path: spendingPath,
                },
                stakingChoice: {
                    type: StakingChoiceType.STAKING_KEY_PATH,
                    path: stakingPath,
                },
            }
        }
        case AddressType.BASE_PAYMENT_SCRIPT_STAKE_KEY: {
            validate(params.spendingPath == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            validate(params.spendingScriptHash != null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            const stakingHashPresent = params.stakingKeyHashHex != null
            const stakingPathPresent = params.stakingPath != null
            validate((stakingHashPresent && !stakingPathPresent) || (!stakingHashPresent && stakingPathPresent), InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            
            const scriptHashHex = parseHexStringOfLength(params.spendingScriptHash, SCRIPT_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)

            if (stakingHashPresent) {
                const hashHex = parseHexStringOfLength(params.stakingKeyHashHex, KEY_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_STAKING_KEY_HASH)
                return {
                    type: address.type,
                    networkId,
                    spendingChoice: {
                        type: SpendingChoiceType.SCRIPT_HASH,
                        scriptHash: scriptHashHex,
                    },
                    stakingChoice: {
                        type: StakingChoiceType.STAKING_KEY_HASH,
                        hashHex,
                    },
                }
            }
            const stakingPath = parseBIP32Path(params.stakingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            return {
                type: address.type,
                networkId,
                spendingChoice: {
                    type: SpendingChoiceType.SCRIPT_HASH,
                    scriptHash: scriptHashHex,
                },
                stakingChoice: {
                    type: StakingChoiceType.STAKING_KEY_PATH,
                    path: stakingPath,
                },
            }
        }
        case AddressType.BASE_PAYMENT_KEY_STAKE_SCRIPT: {
            validate(params.spendingPath != null, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            validate(params.spendingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            validate(params.stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingScriptHash != null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            
            const spendingPath = parseBIP32Path(params.spendingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            
            const stakingHash = parseHexStringOfLength(params.stakingScriptHash!, SCRIPT_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_STAKING_SCRIPT_HASH)
            return {
                type: address.type,
                networkId,
                spendingChoice: {
                    type: SpendingChoiceType.PATH,
                    path: spendingPath,
                },
                stakingChoice: {
                    type: StakingChoiceType.STAKING_SCRIPT_HASH,
                    hashHex: stakingHash,
                },
            }
        }
        case AddressType.BASE_PAYMENT_SCRIPT_STAKE_SCRIPT: {
            validate(params.spendingPath == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            validate(params.spendingScriptHash != null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            validate(params.stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingScriptHash != null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            
            const scriptHashHex = parseHexStringOfLength(params.spendingScriptHash, SCRIPT_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            const stakingHash = parseHexStringOfLength(params.stakingScriptHash, SCRIPT_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_STAKING_SCRIPT_HASH)
            return {
                type: address.type,
                networkId,
                spendingChoice: {
                    type: SpendingChoiceType.SCRIPT_HASH,
                    scriptHash: scriptHashHex,
                },
                stakingChoice: {
                    type: StakingChoiceType.STAKING_SCRIPT_HASH,
                    hashHex: stakingHash,
                },
            }
        }
        case AddressType.POINTER_KEY: {
            validate(params.spendingPath != null, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            validate(params.spendingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            validate(params.stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingBlockchainPointer != null, InvalidDataReason.ADDRESS_INVALID_BLOCKCHAIN_POINTER)
            validate(params.stakingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
    
            const pointer = params.stakingBlockchainPointer!
    
            const spendingPath = parseBIP32Path(params.spendingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
    
            return {
                type: address.type,
                networkId,
                spendingChoice: {
                    type: SpendingChoiceType.PATH,
                    path: spendingPath,
                },
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
        case AddressType.POINTER_SCRIPT: {
            validate(params.spendingPath == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            validate(params.spendingScriptHash != null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            validate(params.stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingBlockchainPointer != null, InvalidDataReason.ADDRESS_INVALID_BLOCKCHAIN_POINTER)
            validate(params.stakingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            
            const pointer = params.stakingBlockchainPointer!
            
            const scriptHashHex = parseHexStringOfLength(params.spendingScriptHash, SCRIPT_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)

            return {
                type: address.type,
                networkId,
                spendingChoice: {
                    type: SpendingChoiceType.SCRIPT_HASH,
                    scriptHash: scriptHashHex,
                },
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
        case AddressType.ENTERPRISE_KEY: {
            validate(params.spendingPath != null, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            validate(params.spendingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            validate(params.stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
    
            const spendingPath = parseBIP32Path(params.spendingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
    
            return {
                type: address.type,
                networkId,
                spendingChoice: {
                    type: SpendingChoiceType.PATH,
                    path: spendingPath,
                },
                stakingChoice: {
                    type: StakingChoiceType.NO_STAKING,
                },
            }
        }
        case AddressType.ENTERPRISE_SCRIPT: {
            validate(params.spendingPath == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_PATH)
            validate(params.spendingScriptHash != null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            validate(params.stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            
            const scriptHashHex = parseHexStringOfLength(params.spendingScriptHash, SCRIPT_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            
            return {
                type: address.type,
                networkId,
                spendingChoice: {
                    type: SpendingChoiceType.SCRIPT_HASH,
                    scriptHash: scriptHashHex,
                },
                stakingChoice: {
                    type: StakingChoiceType.NO_STAKING,
                },
            }
        }
        case AddressType.REWARD_KEY: {
            validate(params.spendingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.spendingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            validate(params.stakingPath != null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
    
            const stakingPath = parseBIP32Path(params.stakingPath, InvalidDataReason.ADDRESS_INVALID_STAKING_KEY_PATH)
    
            return {
                type: address.type,
                networkId,
                // this is intentional, reward address staking path is actually passed as a spending path at APDU level
                spendingChoice: {
                    type: SpendingChoiceType.PATH,
                    path: stakingPath,
                },
                stakingChoice: {
                    type: StakingChoiceType.NO_STAKING,
                },
            }
        }
        case AddressType.REWARD_SCRIPT: {
            validate(params.spendingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.spendingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            validate(params.stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(params.stakingScriptHash != null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
    
            const scriptHashHex = parseHexStringOfLength(params.stakingScriptHash, SCRIPT_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)

            return {
                type: address.type,
                networkId,
                // this is intentional, reward address staking path is actually passed as a spending path at APDU level
                spendingChoice: {
                    type: SpendingChoiceType.SCRIPT_HASH,
                    scriptHash: scriptHashHex,
                },
                stakingChoice: {
                    type: StakingChoiceType.NO_STAKING,
                },
            }
        }
    default:
        throw new InvalidData(InvalidDataReason.ADDRESS_UNKNOWN_TYPE)
    }
}

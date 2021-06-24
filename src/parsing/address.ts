import { InvalidData } from "../errors"
import { InvalidDataReason } from "../errors/invalidDataReason"
import type { ParsedAddressParams } from "../types/internal"
import { AddressType, KEY_HASH_LENGTH, SCRIPT_HASH_LENGTH, SpendingChoice,
    StakingChoice, SpendingChoiceType, StakingChoiceType } from "../types/internal"
import type { BIP32Path, BlockchainPointer, DeviceOwnedAddress, Network } from "../types/public"
import { parseBIP32Path, parseHexStringOfLength, parseUint32_t, validate } from "../utils/parse"
import { parseNetwork } from "./network"

function extractSpendingChoice(
    addressType: AddressType,
    spendingPath?: BIP32Path,
    spendingScriptHash?: string,
): SpendingChoice {
    switch (addressType) {
        case AddressType.BASE_PAYMENT_KEY_STAKE_KEY:
        case AddressType.BASE_PAYMENT_KEY_STAKE_SCRIPT:
        case AddressType.POINTER_KEY:
        case AddressType.ENTERPRISE_KEY:
        case AddressType.BYRON:
            validate(spendingPath != null, InvalidDataReason.ADDRESS_INVALID_SPENDING_KEY_PATH)
            validate(spendingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            return {
                type: SpendingChoiceType.PATH,
                path: parseBIP32Path(spendingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_KEY_PATH),
            }
        case AddressType.BASE_PAYMENT_SCRIPT_STAKE_KEY:
        case AddressType.BASE_PAYMENT_SCRIPT_STAKE_SCRIPT:
        case AddressType.POINTER_SCRIPT:
        case AddressType.ENTERPRISE_SCRIPT:
            validate(spendingPath == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_KEY_PATH)
            validate(spendingScriptHash != null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            return {
                type: SpendingChoiceType.SCRIPT_HASH,
                scriptHash: parseHexStringOfLength(spendingScriptHash, SCRIPT_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH),
            }
        case AddressType.REWARD_KEY:
        case AddressType.REWARD_SCRIPT:
            validate(spendingPath == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_KEY_PATH)
            validate(spendingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_SPENDING_SCRIPT_HASH)
            return {
                type: SpendingChoiceType.NONE,
            }
            break;
        default:
            throw new InvalidData(InvalidDataReason.ADDRESS_UNKNOWN_TYPE)
    }
}

function extractStakingChoice(
    addressType: AddressType,
    stakingPath?: BIP32Path,
    stakingKeyHashHex?: string,
    stakingBlockchainPointer?: BlockchainPointer,
    stakingScriptHash?: string,
) : StakingChoice {
    switch (addressType) {
        case AddressType.BASE_PAYMENT_KEY_STAKE_KEY:
        case AddressType.BASE_PAYMENT_SCRIPT_STAKE_KEY:
        case AddressType.REWARD_KEY:
            validate(stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(stakingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            const stakingHashPresent = stakingKeyHashHex != null
            const stakingPathPresent = stakingPath != null
            validate((stakingHashPresent && !stakingPathPresent) || (!stakingHashPresent && stakingPathPresent), InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            if (stakingHashPresent) {
                const hashHex = parseHexStringOfLength(stakingKeyHashHex!, KEY_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_STAKING_KEY_HASH)
                return {
                        type: StakingChoiceType.STAKING_KEY_HASH,
                        hashHex,
                }
            }
            const codedStakingPath = parseBIP32Path(stakingPath, InvalidDataReason.ADDRESS_INVALID_SPENDING_KEY_PATH)
            return {
                type: StakingChoiceType.STAKING_KEY_PATH,
                path: codedStakingPath,
            }            
        case AddressType.BASE_PAYMENT_SCRIPT_STAKE_SCRIPT:
        case AddressType.BASE_PAYMENT_KEY_STAKE_SCRIPT:
        case AddressType.REWARD_SCRIPT:
            validate(stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(stakingScriptHash != null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            const stakingHash = parseHexStringOfLength(stakingScriptHash, SCRIPT_HASH_LENGTH, InvalidDataReason.ADDRESS_INVALID_STAKING_SCRIPT_HASH)
            return {
                type: StakingChoiceType.STAKING_SCRIPT_HASH,
                hashHex: stakingHash,
            }
        case AddressType.POINTER_KEY:
        case AddressType.POINTER_SCRIPT:
            validate(stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(stakingBlockchainPointer != null, InvalidDataReason.ADDRESS_INVALID_BLOCKCHAIN_POINTER)
            validate(stakingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            const pointer = stakingBlockchainPointer!
            return {
                type: StakingChoiceType.BLOCKCHAIN_POINTER,
                pointer: {
                    blockIndex: parseUint32_t(pointer.blockIndex, InvalidDataReason.ADDRESS_INVALID_BLOCKCHAIN_POINTER),
                    txIndex: parseUint32_t(pointer.txIndex, InvalidDataReason.ADDRESS_INVALID_BLOCKCHAIN_POINTER),
                    certificateIndex: parseUint32_t(pointer.certificateIndex, InvalidDataReason.ADDRESS_INVALID_BLOCKCHAIN_POINTER),
                }
            }
        case AddressType.BYRON:
        case AddressType.ENTERPRISE_KEY:
        case AddressType.ENTERPRISE_SCRIPT:
            validate(stakingPath == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(stakingKeyHashHex == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            validate(stakingBlockchainPointer == null, InvalidDataReason.ADDRESS_INVALID_BLOCKCHAIN_POINTER)
            validate(stakingScriptHash == null, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            return {
                type: StakingChoiceType.NO_STAKING,
            }
        default:
            throw new InvalidData(InvalidDataReason.ADDRESS_UNKNOWN_TYPE)
    }    
}

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

    // will be cast to 'any' since the extract functions guarantee the type match
    const spendingChoice = extractSpendingChoice(address.type, params.spendingPath, params.spendingScriptHash)
    const stakingChoice = extractStakingChoice(address.type, params.stakingPath, params.stakingKeyHashHex, params.stakingBlockchainPointer, params.stakingScriptHash)
    if (address.type === AddressType.BYRON) {
        return {
            type: address.type,
            protocolMagic: parsedNetwork.protocolMagic,
            spendingChoice: spendingChoice as any,
            stakingChoice: stakingChoice as any,
        }
    } else {
        const networkId = parsedNetwork.networkId
        return {
            type: address.type,
            networkId,
            spendingChoice: spendingChoice as any,
            stakingChoice: stakingChoice as any,
        }
    }
}

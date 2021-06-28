import { validate } from "../../utils/parse"
import { ParsedAddressParams, SpendingDataSource, SpendingDataSourceType, StakingDataSource, Uint8_t, Version } from "../../types/internal"
import { AddressType, StakingDataSourceType } from "../../types/internal"
import { hex_to_buf, path_to_buf, uint8_to_buf, uint32_to_buf } from "../../utils/serialize"
import { getCompatibility } from "../getVersion"
import { InvalidDataReason } from "../../errors/invalidDataReason"

function serializeSpendingChoice(spendingChoice: SpendingDataSource): Buffer {
    switch (spendingChoice.type) {
    case SpendingDataSourceType.PATH:
        return path_to_buf(spendingChoice.path)
    case SpendingDataSourceType.SCRIPT_HASH:
        return hex_to_buf(spendingChoice.scriptHash)
    case SpendingDataSourceType.NONE:
        return Buffer.alloc(0)
    }
}

function serializeStakingChoice(stakingChoice: StakingDataSource): Buffer {
    const stakingChoicesEncoding = {
        [StakingDataSourceType.NONE]: 0x11,
        [StakingDataSourceType.KEY_PATH]: 0x22,
        [StakingDataSourceType.KEY_HASH]: 0x33,
        [StakingDataSourceType.BLOCKCHAIN_POINTER]: 0x44,
        [StakingDataSourceType.SCRIPT_HASH]: 0x55,
    } as const

    switch (stakingChoice.type) {
    case StakingDataSourceType.NONE: {
        return Buffer.concat([
            uint8_to_buf(stakingChoicesEncoding[stakingChoice.type] as Uint8_t),
        ])
    }
    case StakingDataSourceType.KEY_HASH:
    case StakingDataSourceType.SCRIPT_HASH: {
        return Buffer.concat([
            uint8_to_buf(stakingChoicesEncoding[stakingChoice.type] as Uint8_t),
            hex_to_buf(stakingChoice.hashHex),
        ])
    }
    case StakingDataSourceType.KEY_PATH: {
        return Buffer.concat([
            uint8_to_buf(stakingChoicesEncoding[stakingChoice.type] as Uint8_t),
            path_to_buf(stakingChoice.path),
        ])
    }
    case StakingDataSourceType.BLOCKCHAIN_POINTER: {
        return Buffer.concat([
            uint8_to_buf(stakingChoicesEncoding[stakingChoice.type] as Uint8_t),
            uint32_to_buf(stakingChoice.pointer.blockIndex),
            uint32_to_buf(stakingChoice.pointer.txIndex),
            uint32_to_buf(stakingChoice.pointer.certificateIndex),
        ])
    }
    }
}

export function serializeAddressParams(
    params: ParsedAddressParams,
    version: Version,
): Buffer {
    let spending: SpendingDataSource = params.spendingDataSource
    let staking: StakingDataSource = params.stakingDataSource
    if (!getCompatibility(version).supportsMultisig) {
        if (AddressType.REWARD_KEY == params.type) {
            validate (StakingDataSourceType.KEY_PATH == staking.type, InvalidDataReason.ADDRESS_INVALID_STAKING_INFO)
            spending = {
                type: SpendingDataSourceType.PATH,
                path: staking.path,
            }
            staking = {
                type: StakingDataSourceType.NONE,
            }
        } else if (AddressType.REWARD_SCRIPT == params.type) {
            // TODO we do not support this (sending hashes in the spending part) on ledger at all
        }
    }
    return Buffer.concat([
        uint8_to_buf(params.type as Uint8_t),
        params.type === AddressType.BYRON
            ? uint32_to_buf(params.protocolMagic)
            : uint8_to_buf(params.networkId),
        serializeSpendingChoice(spending),
        serializeStakingChoice(staking),
    ])
}
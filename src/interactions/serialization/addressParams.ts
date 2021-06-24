import { ParsedAddressParams, SpendingChoice, SpendingDataSourceType, StakingChoice, Uint8_t } from "../../types/internal"
import { AddressType, StakingDataSource } from "../../types/internal"
import { hex_to_buf, path_to_buf, uint8_to_buf, uint32_to_buf } from "../../utils/serialize"

function serializeSpendingChoice(spendingChoice: SpendingChoice): Buffer {
    switch (spendingChoice.type) {
    case SpendingDataSourceType.PATH:
        return path_to_buf(spendingChoice.path)
    case SpendingDataSourceType.SCRIPT_HASH:
        return hex_to_buf(spendingChoice.scriptHash)
    case SpendingDataSourceType.NONE:
        return Buffer.alloc(0)
    }
}

function serializeStakingChoice(stakingChoice: StakingChoice): Buffer {
    const stakingChoicesEncoding = {
        [StakingDataSource.NONE]: 0x11,
        [StakingDataSource.KEY_PATH]: 0x22,
        [StakingDataSource.KEY_HASH]: 0x33,
        [StakingDataSource.BLOCKCHAIN_POINTER]: 0x44,
        [StakingDataSource.SCRIPT_HASH]: 0x55,
    } as const

    switch (stakingChoice.type) {
    case StakingDataSource.NONE: {
        return Buffer.concat([
            uint8_to_buf(stakingChoicesEncoding[stakingChoice.type] as Uint8_t),
        ])
    }
    case StakingDataSource.KEY_HASH:
    case StakingDataSource.SCRIPT_HASH: {
        return Buffer.concat([
            uint8_to_buf(stakingChoicesEncoding[stakingChoice.type] as Uint8_t),
            hex_to_buf(stakingChoice.hashHex),
        ])
    }
    case StakingDataSource.KEY_PATH: {
        return Buffer.concat([
            uint8_to_buf(stakingChoicesEncoding[stakingChoice.type] as Uint8_t),
            path_to_buf(stakingChoice.path),
        ])
    }
    case StakingDataSource.BLOCKCHAIN_POINTER: {
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
    params: ParsedAddressParams
): Buffer {
    return Buffer.concat([
        uint8_to_buf(params.type as Uint8_t),
        params.type === AddressType.BYRON
            ? uint32_to_buf(params.protocolMagic)
            : uint8_to_buf(params.networkId),
        serializeSpendingChoice(params.spendingChoice),
        serializeStakingChoice(params.stakingChoice),
    ])
}
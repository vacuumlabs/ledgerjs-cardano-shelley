import type { GovernanceVotingPublicKey, ParsedGovernanceVotingDelegation, ParsedGovernanceVotingRegistrationParams, ParsedOutputDestination,Uint8_t,Uint32_t, Uint64_str,ValidBIP32Path } from "../../types/internal"
import type { Version } from "../../types/public"
import { GovernanceVotingDelegationType } from "../../types/public"
import { GovernanceVotingRegistrationFormat } from "../../types/public"
import { assert, unreachable } from "../../utils/assert"
import { hex_to_buf, path_to_buf, serializeOptionFlag,uint8_to_buf,uint32_to_buf,uint64_to_buf } from "../../utils/serialize"
import { serializeTxOutputDestination } from "./txOutput"

export function serializeGovernanceVotingRegistrationInit(params: ParsedGovernanceVotingRegistrationParams): Buffer {
    const governanceRegistrationFormatEncoding = {
        [GovernanceVotingRegistrationFormat.CIP_15]: 0x01,
        [GovernanceVotingRegistrationFormat.CIP_36]: 0x02,
    } as const
    const formatBuffer = uint8_to_buf(governanceRegistrationFormatEncoding[params.format] as Uint8_t)

    const numDelegations = params.delegations != null
        ? params.delegations.length
        : 0
    const numDelegationsBuffer = uint32_to_buf(numDelegations as Uint32_t)

    return Buffer.concat([
        formatBuffer, // 1 B
        numDelegationsBuffer, // 4 B
    ])
}

function delegationTypeBuffer(type: GovernanceVotingDelegationType): Buffer {
    const delegationTypeEncoding = {
        [GovernanceVotingDelegationType.KEY]: 0x01,
        [GovernanceVotingDelegationType.PATH]: 0x02,
    } as const
    return uint8_to_buf(delegationTypeEncoding[type] as Uint8_t)
}

export function serializeGovernanceVotingRegistrationVotingKey(
    votingPublicKey: GovernanceVotingPublicKey | null,
    votingPublicKeyPath: ValidBIP32Path | null,
): Buffer {
    if (votingPublicKey != null) {
        assert(votingPublicKeyPath == null, "redundant governance registration voting key path")
        return Buffer.concat([
            delegationTypeBuffer(GovernanceVotingDelegationType.KEY),
            hex_to_buf(votingPublicKey),
        ])
    } else {
        assert(votingPublicKeyPath != null, "missing governance registration voting key")
        return Buffer.concat([
            delegationTypeBuffer(GovernanceVotingDelegationType.PATH),
            path_to_buf(votingPublicKeyPath!),
        ])
    }
}

export function serializeGovernanceVotingRegistrationDelegation(delegation: ParsedGovernanceVotingDelegation): Buffer {
    const typeBuffer = delegationTypeBuffer(delegation.type)

    const weightBuffer = uint32_to_buf(delegation.weight)

    switch (delegation.type) {
    case GovernanceVotingDelegationType.KEY:
        return Buffer.concat([
            typeBuffer,
            hex_to_buf(delegation.votingPublicKey),
            weightBuffer,
        ])

    case GovernanceVotingDelegationType.PATH:
        return Buffer.concat([
            typeBuffer,
            path_to_buf(delegation.votingKeyPath),
            weightBuffer,
        ])

    default:
        unreachable(delegation)
    }
}

export function serializeGovernanceVotingRegistrationStakingPath(stakingPath: ValidBIP32Path): Buffer {
    return Buffer.concat([
        path_to_buf(stakingPath),
    ])
}

export function serializeGovernanceVotingRegistrationRewardsDestination(
    rewardsDestination: ParsedOutputDestination,
    version: Version,
): Buffer {
    return serializeTxOutputDestination(rewardsDestination, version)
}

export function serializeGovernanceVotingRegistrationNonce(nonce: Uint64_str): Buffer {
    return Buffer.concat([
        uint64_to_buf(nonce),
    ])
}

export function serializeGovernanceVotingRegistrationVotingPurpose(votingPurpose: Uint64_str | null): Buffer {
    const includeVotingPurposeBuffer = serializeOptionFlag(votingPurpose != null)

    const votingPurposeBuffer = votingPurpose != null
        ? uint64_to_buf(votingPurpose)
        : Buffer.from([])

    return Buffer.concat([
        includeVotingPurposeBuffer, // 1 B
        votingPurposeBuffer, // 0 or 8 B
    ])
}

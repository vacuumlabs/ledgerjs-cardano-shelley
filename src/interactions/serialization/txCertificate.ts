import { InvalidDataReason } from "../../errors/invalidDataReason"
import type { ParsedCertificate, ParsedStakeCredential, Uint8_t } from "../../types/internal"
import { StakeCredentialType } from "../../types/internal"
import { CertificateType } from "../../types/internal"
import { unreachable } from "../../utils/assert"
import { validate } from "../../utils/parse"
import { hex_to_buf, path_to_buf, uint8_to_buf, uint64_to_buf } from "../../utils/serialize"

export function serializeTxCertificatePreMultisig(
    certificate: ParsedCertificate,
) {
    switch (certificate.type) {
    case CertificateType.STAKE_REGISTRATION:
    case CertificateType.STAKE_DEREGISTRATION: {
        validate(StakeCredentialType.KEY_PATH == certificate.stakeCredential.type, InvalidDataReason.CERTIFICATE_INVALID_STAKE_CREDENTIAL)
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
            path_to_buf(certificate.stakeCredential.path),
        ])
    }
    case CertificateType.STAKE_DELEGATION: {
        validate(StakeCredentialType.KEY_PATH == certificate.stakeCredential.type, InvalidDataReason.CERTIFICATE_INVALID_STAKE_CREDENTIAL)
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
            path_to_buf(certificate.stakeCredential.path),
            hex_to_buf(certificate.poolKeyHashHex),
        ])
    }
    case CertificateType.STAKE_POOL_REGISTRATION: {
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
        ])
    }
    case CertificateType.STAKE_POOL_RETIREMENT: {
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
            path_to_buf(certificate.path),
            uint64_to_buf(certificate.retirementEpoch),
        ])
    }
    default:
        unreachable(certificate)
    }
}

function serializeStakeCredential(
    stakeCredential: ParsedStakeCredential
): Buffer {
    if (StakeCredentialType.KEY_PATH == stakeCredential.type) {
        return Buffer.concat([
            uint8_to_buf(stakeCredential.type as Uint8_t),
            path_to_buf(stakeCredential.path),
        ])
    } else {
        return Buffer.concat([
            uint8_to_buf(stakeCredential.type as Uint8_t),
            hex_to_buf(stakeCredential.scriptHash),
        ])
    }
}

export function serializeTxCertificate(
    certificate: ParsedCertificate,
) {
    switch (certificate.type) {
    case CertificateType.STAKE_REGISTRATION:
    case CertificateType.STAKE_DEREGISTRATION: {
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
            serializeStakeCredential(certificate.stakeCredential),
        ])
    }
    case CertificateType.STAKE_DELEGATION: {
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
            serializeStakeCredential(certificate.stakeCredential),
            hex_to_buf(certificate.poolKeyHashHex),
        ])
    }
    case CertificateType.STAKE_POOL_REGISTRATION: {
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
        ])
    }
    case CertificateType.STAKE_POOL_RETIREMENT: {
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
            path_to_buf(certificate.path),
            uint64_to_buf(certificate.retirementEpoch),
        ])
    }
    default:
        unreachable(certificate)
    }
}

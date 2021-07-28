import { InvalidDataReason } from "../../errors/invalidDataReason"
import { validate } from "../../utils/parse"
import { StakeCredentialType, ParsedCertificate, Uint8_t } from "../../types/internal"
import { CertificateType } from "../../types/internal"
import { unreachable } from "../../utils/assert"
import { hex_to_buf, path_to_buf, uint8_to_buf, uint64_to_buf, stake_credential_to_buf } from "../../utils/serialize"

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

export function serializeTxCertificate(
    certificate: ParsedCertificate,
) {
    switch (certificate.type) {
    case CertificateType.STAKE_REGISTRATION:
    case CertificateType.STAKE_DEREGISTRATION: {
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
            stake_credential_to_buf(certificate.stakeCredential),
        ])
    }
    case CertificateType.STAKE_DELEGATION: {
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
            stake_credential_to_buf(certificate.stakeCredential),
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

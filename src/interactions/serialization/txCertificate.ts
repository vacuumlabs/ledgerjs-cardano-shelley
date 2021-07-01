import { InvalidDataReason } from "../../errors/invalidDataReason"
import { validate } from "../../utils/parse"
import { CertificateIdentifier2, CertificateIdentifierType, ParsedCertificate, Uint8_t } from "../../types/internal"
import { CertificateType } from "../../types/internal"
import { unreachable } from "../../utils/assert"
import { hex_to_buf, path_to_buf, uint8_to_buf, uint64_to_buf } from "../../utils/serialize"

export function serializeTxCertificatePreMultisig(
    certificate: ParsedCertificate,
) {
    switch (certificate.type) {
    case CertificateType.STAKE_REGISTRATION:
    case CertificateType.STAKE_DEREGISTRATION: {
        validate(CertificateIdentifierType.KEY_PATH == certificate.identifier.type, InvalidDataReason.CERTIFICATE_INVALID_IDENTIFIER)
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
            path_to_buf(certificate.identifier.path),
        ])
    }
    case CertificateType.STAKE_DELEGATION: {
        validate(CertificateIdentifierType.KEY_PATH == certificate.identifier.type, InvalidDataReason.CERTIFICATE_INVALID_IDENTIFIER)
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
            path_to_buf(certificate.identifier.path),
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

function serializeIdentifier(
    identifier: CertificateIdentifier2
): Buffer {
    if (CertificateIdentifierType.KEY_PATH == identifier.type) {
        return Buffer.concat([
            uint8_to_buf(identifier.type as Uint8_t),
            path_to_buf(identifier.path),
        ])
    } else {
        return Buffer.concat([
            uint8_to_buf(identifier.type as Uint8_t),
            hex_to_buf(identifier.scriptHash),
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
            serializeIdentifier(certificate.identifier),
        ])
    }
    case CertificateType.STAKE_DELEGATION: {
        return Buffer.concat([
            uint8_to_buf(certificate.type as Uint8_t),
            serializeIdentifier(certificate.identifier),
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

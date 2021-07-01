import path from "node:path"
import { InvalidData } from "../errors"
import { InvalidDataReason } from "../errors/invalidDataReason"
import type { ParsedCertificate } from "../types/internal"
import { CertificateType, CertificateIdentifierType, CertificateIdentifier2, KEY_HASH_LENGTH, SCRIPT_HASH_LENGTH } from "../types/internal"
import type { Certificate, CertificateIdentifier } from "../types/public"
import { parseBIP32Path, parseHexStringOfLength, parseUint64_str, validate } from "../utils/parse"
import { parsePoolParams } from "./poolRegistration"

function parseIdentifier(identifier: CertificateIdentifier): CertificateIdentifier2 {
    const pathProvided = identifier.path != null
    const scriptHashProvided = identifier.scriptHash != null
    validate((pathProvided && !scriptHashProvided) || (!pathProvided && scriptHashProvided),
        InvalidDataReason.CERTIFICATE_INVALID_IDENTIFIER)
    if (pathProvided) {
        return {
            type: CertificateIdentifierType.KEY_PATH,
            path: parseBIP32Path(identifier.path, InvalidDataReason.CERTIFICATE_INVALID_PATH),
        }
    } else {
        return {
            type: CertificateIdentifierType.SCRIPT_HASH,
            scriptHash: parseHexStringOfLength(identifier.scriptHash, SCRIPT_HASH_LENGTH, InvalidDataReason.CERTIFICATE_INVALID_SCRIPT_HASH)
        }
    }
}

export function parseCertificate(cert: Certificate): ParsedCertificate {
    switch (cert.type) {
    case CertificateType.STAKE_REGISTRATION:
    case CertificateType.STAKE_DEREGISTRATION: {
        validate((cert.params as any).poolKeyHashHex == null, InvalidDataReason.CERTIFICATE_SUPERFLUOUS_POOL_KEY_HASH)
        return {
            type: cert.type,
            identifier: parseIdentifier(cert.params.identifier)
        }
    }
    case CertificateType.STAKE_DELEGATION: {
        return {
            type: cert.type,
            identifier: parseIdentifier(cert.params.identifier),
            poolKeyHashHex: parseHexStringOfLength(cert.params.poolKeyHashHex, KEY_HASH_LENGTH, InvalidDataReason.CERTIFICATE_INVALID_POOL_KEY_HASH),
        }
    }
    case CertificateType.STAKE_POOL_REGISTRATION: {
        return {
            type: cert.type,
            pool: parsePoolParams(cert.params),
        }
    }
    case CertificateType.STAKE_POOL_RETIREMENT: {
        return {
            type: cert.type,
            path: parseBIP32Path(cert.params.poolKeyPath, InvalidDataReason.CERTIFICATE_INVALID_PATH),
            retirementEpoch: parseUint64_str(cert.params.retirementEpoch, {}, InvalidDataReason.POOL_RETIREMENT_INVALID_RETIREMENT_EPOCH),
        }
    }

    default:
        throw new InvalidData(InvalidDataReason.CERTIFICATE_INVALID_TYPE)
    }
}

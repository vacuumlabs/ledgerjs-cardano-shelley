import { InvalidData } from "../errors"
import { InvalidDataReason } from "../errors/invalidDataReason"
import type { ParsedCertificate , ParsedStakeCredential} from "../types/internal"
import { CertificateType, KEY_HASH_LENGTH, SCRIPT_HASH_LENGTH,StakeCredentialType } from "../types/internal"
import type { Certificate, StakeCredential } from "../types/public"
import { parseBIP32Path, parseHexStringOfLength, parseUint64_str, validate } from "../utils/parse"
import { parsePoolParams } from "./poolRegistration"

function parseStakeCredential(stakeCredential: StakeCredential): ParsedStakeCredential {
    const pathProvided = stakeCredential.path != null
    const scriptHashProvided = stakeCredential.scriptHash != null
    validate((pathProvided && !scriptHashProvided) || (!pathProvided && scriptHashProvided),
        InvalidDataReason.CERTIFICATE_INVALID_STAKE_CREDENTIAL)
    if (pathProvided) {
        return {
            type: StakeCredentialType.KEY_PATH,
            path: parseBIP32Path(stakeCredential.path, InvalidDataReason.CERTIFICATE_INVALID_PATH),
        }
    } else {
        return {
            type: StakeCredentialType.SCRIPT_HASH,
            scriptHash: parseHexStringOfLength(stakeCredential.scriptHash, SCRIPT_HASH_LENGTH, InvalidDataReason.CERTIFICATE_INVALID_SCRIPT_HASH),
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
            stakeCredential: parseStakeCredential(cert.params.stakeCredential),
        }
    }
    case CertificateType.STAKE_DELEGATION: {
        return {
            type: cert.type,
            stakeCredential: parseStakeCredential(cert.params.stakeCredential),
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

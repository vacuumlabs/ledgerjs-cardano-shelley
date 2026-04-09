import {ErrorBase} from './errorBase'

/**
 * Raw error codes returned by APDU protocol. Note that this is *not* an exhaustive list.
 * @category Errors
 */
export const DeviceStatusCodes = {
  ERR_STILL_IN_CALL: 0x6e04 as const, // internal
  ERR_INVALID_DATA: 0x6e07 as const,
  ERR_INVALID_BIP_PATH: 0x6e08 as const,
  ERR_REJECTED_BY_USER: 0x6e09 as const,
  ERR_REJECTED_BY_POLICY: 0x6982 as const,
  ERR_DEVICE_LOCKED: 0x6e11 as const,
  ERR_UNSUPPORTED_ADDRESS_TYPE: 0x6e12 as const,
  ERR_INVALID_PROTOCOL_MAGIC: 0x6b38 as const,
  ERR_INVALID_NETWORK_ID: 0x6b37 as const,
  // Not thrown by ledger-app-cardano itself but other apps
  ERR_CLA_NOT_SUPPORTED: 0x6e00 as const,
  ERR_TX_PARSING_FAIL_CERTIFICATES: 0x6b24 as const,
  ERR_TX_PARSING_FAIL_CANONICAL_ORDER: 0x6b3b as const,
  ERR_TX_PARSING_FAIL_MINT: 0x6b29 as const,
  ERR_TX_PARSING_FAIL_WITHDRAWALS: 0x6b25 as const,
}

// Human-readable version of errors reported by APDU protocol
export const DeviceStatusMessages: Record<number, string> = {
  [DeviceStatusCodes.ERR_INVALID_DATA]: 'Invalid data supplied to Ledger',
  [DeviceStatusCodes.ERR_INVALID_BIP_PATH]:
    'Invalid derivation path supplied to Ledger',
  [DeviceStatusCodes.ERR_REJECTED_BY_USER]: 'Action rejected by user',
  [DeviceStatusCodes.ERR_REJECTED_BY_POLICY]:
    "Action rejected by Ledger's security policy",
  [DeviceStatusCodes.ERR_DEVICE_LOCKED]: 'Device is locked',
  [DeviceStatusCodes.ERR_CLA_NOT_SUPPORTED]: 'Wrong Ledger app',
  [DeviceStatusCodes.ERR_UNSUPPORTED_ADDRESS_TYPE]: 'Unsupported address type',
  [DeviceStatusCodes.ERR_INVALID_PROTOCOL_MAGIC]: 'invalid protocol magic',
  [DeviceStatusCodes.ERR_TX_PARSING_FAIL_CERTIFICATES]:
    'TX parsing failed - certificates',
  [DeviceStatusCodes.ERR_TX_PARSING_FAIL_CANONICAL_ORDER]:
    'TX parsing failed - canonical ordering',
  [DeviceStatusCodes.ERR_TX_PARSING_FAIL_MINT]: 'TX parsing failed - mint',
  [DeviceStatusCodes.ERR_TX_PARSING_FAIL_WITHDRAWALS]:
    'TX parsing failed - withdrawals',
}

const GH_DEVICE_ERRORS_LINK =
  'https://github.com/cardano-foundation/ledger-app-cardano/blob/master/src/errors.h'

const getDeviceErrorDescription = (statusCode: number) => {
  const statusCodeHex = `0x${statusCode.toString(16)}`
  const defaultMsg = `General error ${statusCodeHex}. Please consult ${GH_DEVICE_ERRORS_LINK}`

  return DeviceStatusMessages[statusCode] ?? defaultMsg
}

/**
 * Error wrapping APDU device error codes with human-readable message.
 * Use [[code]] for accessing underlying status code.
 * @category Errors
 */
export class DeviceStatusError extends ErrorBase {
  public code: number

  public constructor(code: number) {
    super(getDeviceErrorDescription(code))
    this.code = code
  }
}

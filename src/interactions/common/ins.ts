export const enum INS {
  GET_VERSION = 0x00,
  GET_SERIAL = 0x01,

  GET_EXT_PUBLIC_KEY = 0x10,
  DERIVE_ADDRESS = 0x11,

  SIGN_TX = 0x21,

  RUN_TESTS = 0xf0,
}

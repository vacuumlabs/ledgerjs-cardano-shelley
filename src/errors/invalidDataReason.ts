/**
 * Reason for throwing [[InvalidData]] error.
 * @category Errors
 */
export enum InvalidDataReason {
  GET_EXT_PUB_KEY_PATHS_NOT_ARRAY = 'ext pub key paths not an array',
  INVALID_PATH = 'invalid path',

  NETWORK_INVALID_PROTOCOL_MAGIC = 'invalid protocol magic',
  NETWORK_INVALID_NETWORK_ID = 'invalid network id',
  NETWORK_ID_INCLUDE_INVALID = 'invalid value for includeNetworkId',

  INPUTS_NOT_ARRAY = 'inputs not an array',
  INPUT_INVALID_TX_HASH = 'invalid tx hash in an input',
  INPUT_INVALID_PATH = 'invalid input path',
  INPUT_INVALID_UTXO_INDEX = 'invalid input utxo index',

  OUTPUTS_NOT_ARRAY = 'outputs not an array',
  OUTPUT_INVALID_FORMAT = 'invalid output format',
  OUTPUT_INVALID_AMOUNT = 'invalid amount in an output',
  OUTPUT_INVALID_ADDRESS = 'invalid address in an output',
  OUTPUT_INVALID_ADDRESS_PARAMS = 'change address must have path as payment part',
  OUTPUT_INVALID_DATUM_HASH = 'invalid datum hash',
  OUTPUT_INVALID_INLINE_DATUM = 'invalid inline datum',
  OUTPUT_INVALID_REFERENCE_SCRIPT_HEX = 'invalid script hex',
  OUTPUT_INCONSISTENT_DATUM = 'datum is not consistent with output type',
  OUTPUT_INCONSISTENT_REFERENCE_SCRIPT = 'reference script is not consistent with output type',

  MULTIASSET_INVALID_POLICY_NAME = 'invalid policy id in a multiasset token bundle',
  MULTIASSET_INVALID_TOKEN_BUNDLE_NOT_ARRAY = 'invalid multiasset token bundle - asset groups not an array',
  MULTIASSET_INVALID_TOKEN_BUNDLE_TOO_LARGE = 'invalid multiasset token bundle - too many asset groups',
  MULTIASSET_INVALID_TOKEN_BUNDLE_ORDERING = 'invalid multiasset token bundle - incorrect ordering of asset groups',
  MULTIASSET_INVALID_TOKEN_BUNDLE_NOT_UNIQUE = 'invalid multiasset token bundle - policyIds not unique',
  MULTIASSET_INVALID_TOKEN_BUNDLE_EMPTY = 'invalid multiasset token bundle - token bundle is not allowed to be empty',
  MULTIASSET_INVALID_TOKEN_AMOUNT = 'invalid token amount in an asset group in a multiasset token bundle',
  MULTIASSET_INVALID_ASSET_NAME = 'invalid asset name in an asset group in a multiasset token bundle',
  MULTIASSET_INVALID_ASSET_GROUP_NOT_ARRAY = 'invalid asset group in multiasset token bundle - tokens not an array',
  MULTIASSET_INVALID_ASSET_GROUP_TOO_LARGE = 'invalid asset group in multiasset token bundle - too many tokens',
  MULTIASSET_INVALID_ASSET_GROUP_EMPTY = 'invalid asset group in multiasset token bundle - zero tokens',
  MULTIASSET_INVALID_ASSET_GROUP_ORDERING = 'invalid asset group in multiasset token bundle - incorrect ordering of tokens',
  MULTIASSET_INVALID_ASSET_GROUP_NOT_UNIQUE = 'invalid asset group in multiasset token bundle - token names not unique',

  ADDRESS_UNKNOWN_TYPE = 'unknown address type',
  ADDRESS_INVALID_SPENDING_INFO = 'invalid address spending information',
  ADDRESS_INVALID_SPENDING_KEY_PATH = 'invalid address spending key path',
  ADDRESS_INVALID_SPENDING_SCRIPT_HASH = 'invalid address spending script hash',
  ADDRESS_INVALID_BLOCKCHAIN_POINTER = 'invalid address blockchain pointer',
  ADDRESS_INVALID_STAKING_KEY_PATH = 'invalid address staking key path',
  ADDRESS_INVALID_STAKING_KEY_HASH = 'invalid address staking key hash',
  ADDRESS_INVALID_STAKING_SCRIPT_HASH = 'invalid address staking script hash',
  ADDRESS_INVALID_STAKING_INFO = 'Invalid staking info in an output',
  ADDRESS_INVALID_REWARD_ADDRESS = 'invalid reward address for this version of ledger',

  FEE_INVALID = 'invalid fee',

  TTL_INVALID = 'invalid ttl',

  CERTIFICATES_NOT_ARRAY = 'certificates not an array',

  CERTIFICATE_INVALID_TYPE = 'invalid certificate type',
  CERTIFICATE_INVALID_PATH = 'one of the certificates contains an invalid path',
  CERTIFICATE_INVALID_STAKE_CREDENTIAL = 'one of the certificates contains an invalid stake credential',
  CERTIFICATE_INVALID_COMMITTEE_CREDENTIAL = 'one of the certificates contains invalid constitutional committee credential',
  CERTIFICATE_INVALID_DREP_CREDENTIAL = 'one of the certificates contains an invalid DRep credential',
  CERTIFICATE_INVALID_POOL_KEY_HASH = 'one of the certificates contains an invalid pool key hash',
  CERTIFICATE_SUPERFLUOUS_POOL_KEY_HASH = 'superfluous pool key hash in a certificate',
  CERTIFICATE_INVALID_DEPOSIT = 'one of the certificates contains an invalid deposit',
  CERTIFICATE_INVALID_DREP = 'one of the certificates contains an invalid DRep',
  ANCHOR_INVALID_URL = 'anchor with an invalid URL',
  ANCHOR_INVALID_HASH = 'anchor with an invalid data hash',

  POOL_REGISTRATION_INVALID_VRF_KEY_HASH = 'invalid vrf key hash in a pool registration certificate',
  POOL_REGISTRATION_INVALID_PLEDGE = 'invalid pledge in a pool registration certificate',
  POOL_REGISTRATION_INVALID_COST = 'invalid cost in a pool registration certificate',
  POOL_REGISTRATION_INVALID_MARGIN = 'invalid margin in a pool registration certificate',
  POOL_REGISTRATION_INVALID_MARGIN_DENOMINATOR = 'pool margin denominator must be a value between 1 and 10^15',
  POOL_REGISTRATION_OWNERS_TOO_MANY = 'too many owners in a pool registration certificate',

  POOL_KEY_INVALID_TYPE = 'invalid pool key type',
  POOL_KEY_INVALID_PATH = 'invalid pool key path in a pool registration certificate',
  POOL_KEY_INVALID_KEY_HASH = 'invalid pool key hash in a pool registration certificate',

  POOL_OWNER_INVALID_TYPE = 'invalid owner type',
  POOL_OWNER_INVALID_PATH = 'invalid owner path in a pool registration certificate',
  POOL_OWNER_INVALID_KEY_HASH = 'invalid owner key hash in a pool registration certificate',
  POOL_REGISTRATION_RELAYS_TOO_MANY = 'too many pool relays in a pool registration certificate',

  POOL_REWARD_ACCOUNT_INVALID_TYPE = 'invalid pool reward account type',
  POOL_REWARD_ACCOUNT_INVALID_PATH = 'invalid pool reward account key path in a pool registration certificate',
  POOL_REWARD_ACCOUNT_INVALID_HEX = 'invalid pool reward account hex in a pool registration certificate',

  POOL_RETIREMENT_INVALID_RETIREMENT_EPOCH = 'invalid pool retirement epoch',

  RELAY_INVALID_TYPE = 'invalid type of a relay in a pool registration certificate',
  RELAY_INVALID_PORT = 'invalid port in a relay in a pool registration certificate',
  RELAY_INVALID_IPV4 = 'invalid ipv4 in a relay in a pool registration certificate',
  RELAY_INVALID_IPV6 = 'invalid ipv6 in a relay in a pool registration certificate',
  RELAY_INVALID_DNS = 'invalid dns record in a relay in a pool registration certificate',

  POOL_REGISTRATION_METADATA_INVALID_URL = 'invalid metadata in a pool registration certificate= invalid url',
  POOL_REGISTRATION_METADATA_INVALID_HASH = 'invalid metadata in a pool registration certificate= invalid hash',

  WITHDRAWALS_NOT_ARRAY = 'withdrawals not an array',

  WITHDRAWAL_INVALID_AMOUNT = 'invalid withdrawal amount',
  WITHDRAWAL_INVALID_PATH = 'invalid withdrawal path',
  WITHDRAWAL_INVALID_STAKE_CREDENTIAL = 'withdrawal stake credential contains both a path and a scripthash or neither',

  AUXILIARY_DATA_UNKNOWN_TYPE = 'unknown auxiliary data type',
  AUXILIARY_DATA_INVALID_HASH = 'invalid auxiliary data hash',

  METADATA_UNKNOWN_TYPE = 'unknown metadata type',

  CVOTE_REGISTRATION_INCONSISTENT_WITH_CIP15 = 'CIP36 registration params inconsistent with CIP-15',
  CVOTE_REGISTRATION_INCONSISTENT_WITH_CIP36 = 'CIP36 registration params inconsistent with CIP-36',
  CVOTE_REGISTRATION_BOTH_KEY_AND_PATH = 'CIP36 vote key given both as a key and as a derivation path',
  CVOTE_REGISTRATION_MISSING_VOTE_KEY = 'CIP36 vote key missing',
  CVOTE_REGISTRATION_INVALID_VOTE_KEY = 'invalid CIP36 registration vote key',
  CVOTE_REGISTRATION_INVALID_VOTE_KEY_PATH = 'invalid CIP36 registration vote key path',
  CVOTE_REGISTRATION_INVALID_STAKING_KEY_PATH = 'invalid CIP36 registration staking key path',
  CVOTE_REGISTRATION_INVALID_NONCE = 'invalid CIP36 registration nonce',
  CVOTE_REGISTRATION_INVALID_VOTING_PURPOSE = 'invalid CIP36 registration voting purpose',
  CVOTE_REGISTRATION_DELEGATIONS_NOT_ARRAY = 'CIP36 registration delegations not an array',
  CVOTE_DELEGATION_UNKNOWN_FORMAT = 'invalid CIP36 delegation format',
  CVOTE_DELEGATION_UNKNOWN_DELEGATION_TYPE = 'invalid CIP36 delegation type',
  CVOTE_DELEGATION_INVALID_WEIGHT = 'invalid CIP36 delegation weight',
  CVOTE_DELEGATION_INVALID_PATH = 'invalid CIP36 delegation path',
  CVOTE_DELEGATION_INVALID_KEY = 'invalid CIP36 delegation key',

  VALIDITY_INTERVAL_START_INVALID = 'invalid validity interval start',

  SCRIPT_DATA_HASH_WRONG_LENGTH = 'script data hash not 32 bytes long',

  COLLATERAL_INPUTS_NOT_ARRAY = 'collateral inputs not an array',

  REQUIRED_SIGNERS_NOT_ARRAY = 'required signers not an array',
  VKEY_HASH_WRONG_LENGTH = 'vkey hash not 28 bytes long',
  UNKNOWN_REQUIRED_SIGNER_TYPE = 'unknown required signer type',
  REQUIRED_SIGNER_INVALID_PATH = 'invalid path for required signer',

  COLLATERAL_INPUT_CONTAINS_DATUM = 'collateral return output contains datum',
  COLLATERAL_INPUT_CONTAINS_REFERENCE_SCRIPT = 'collateral return output contains reference script',

  TOTAL_COLLATERAL_NOT_VALID = 'total collateral not valid',

  REFERENCE_INPUTS_NOT_ARRAY = 'reference inputs not an array',

  VOTING_PROCEDURES_NOT_ARRAY = 'voting procedures not an array',
  VOTER_VOTES_NOT_ARRAY = "voter's votes not an array",
  VOTER_INVALID = 'invalid voter in voting procedures',
  GOV_ACTION_ID_INVALID_TX_HASH = 'invalid governance action id tx hash',
  GOV_ACTION_ID_INVALID_INDEX = 'invalid governance action id index',
  VOTING_PROCEDURES_INVALID_NUMBER_OF_VOTERS = 'there must be exactly 1 voter in voting procedures',
  VOTING_PROCEDURES_INVALID_NUMBER_OF_VOTES = 'there must be exactly 1 voting procedure per voter',

  TREASURY_NOT_VALID = 'treasury amount not valid',

  DONATION_NOT_VALID = 'treasury donation not valid',

  SIGN_MODE_UNKNOWN = 'unknown signing mode',

  SIGN_MODE_ORDINARY__POOL_REGISTRATION_NOT_ALLOWED = 'pool registration not allowed in TransactionSigningMode.ORDINARY_TRANSACTION',
  SIGN_MODE_ORDINARY__CERTIFICATE_STAKE_CREDENTIAL_ONLY_AS_PATH = 'certificate stake credential must be given as a staking path in TransactionSigningMode.ORDINARY_TRANSACTION',
  SIGN_MODE_ORDINARY__CERTIFICATE_COMMITTEE_COLD_CREDENTIAL_ONLY_AS_PATH = 'certificate constitutional committee cold credential must be given as a path in TransactionSigningMode.ORDINARY_TRANSACTION',
  SIGN_MODE_ORDINARY__CERTIFICATE_DREP_CREDENTIAL_ONLY_AS_PATH = 'certificate DRep credential must be given as a path in TransactionSigningMode.ORDINARY_TRANSACTION',
  SIGN_MODE_ORDINARY__WITHDRAWAL_ONLY_AS_PATH = 'withdrawal must be given as a path in TransactionSigningMode.ORDINARY_TRANSACTION',
  SIGN_MODE_ORDINARY__COLLATERAL_INPUTS_NOT_ALLOWED = 'collateral inputs not allowed in TransactionSigningMode.ORDINARY_TRANSACTION',
  SIGN_MODE_ORDINARY__COLLATERAL_OUTPUT_NOT_ALLOWED = 'collateral output not allowed in TransactionSigningMode.ORDINARY_TRANSACTION',
  SIGN_MODE_ORDINARY__TOTAL_COLLATERAL_NOT_ALLOWED = 'total collateral not allowed in TransactionSigningMode.ORDINARY_TRANSACTION',
  SIGN_MODE_ORDINARY__REFERENCE_INPUTS_NOT_ALLOWED = 'reference inputs not allowed in TransactionSigningMode.ORDINARY_TRANSACTION',
  SIGN_MODE_ORDINARY__VOTER_ONLY_AS_PATH = 'voter credential in voting procedures must be given as a path in TransactionSigningMode.ORDINARY_TRANSACTION',

  SIGN_MODE_MULTISIG__POOL_REGISTRATION_NOT_ALLOWED = 'pool registration not allowed in TransactionSigningMode.MULTISIG_TRANSACTION',
  SIGN_MODE_MULTISIG__POOL_RETIREMENT_NOT_ALLOWED = 'pool retirement not allowed in TransactionSigningMode.MULTISIG_TRANSACTION',
  SIGN_MODE_MULTISIG__DEVICE_OWNED_ADDRESS_NOT_ALLOWED = 'outputs given by path not allowed in TransactionSigningMode.MULTISIG_TRANSACTION',
  SIGN_MODE_MULTISIG__CERTIFICATE_CREDENTIAL_ONLY_AS_SCRIPT = 'certificate credential must be given as a script hash in TransactionSigningMode.MULTISIG_TRANSACTION',
  SIGN_MODE_MULTISIG__WITHDRAWAL_ONLY_AS_SCRIPT = 'withdrawal must be given as a script hash in TransactionSigningMode.MULTISIG_TRANSACTION',
  SIGN_MODE_MULTISIG__COLLATERAL_INPUTS_NOT_ALLOWED = 'collateral inputs not allowed in TransactionSigningMode.MULTISIG_TRANSACTION',
  SIGN_MODE_MULTISIG__COLLATERAL_OUTPUT_NOT_ALLOWED = 'collateral output not allowed in TransactionSigningMode.MULTISIG_TRANSACTION',
  SIGN_MODE_MULTISIG__TOTAL_COLLATERAL_NOT_ALLOWED = 'total collateral not allowed in TransactionSigningMode.MULTISIG_TRANSACTION',
  SIGN_MODE_MULTISIG__REFERENCE_INPUTS_NOT_ALLOWED = 'reference inputs not allowed in TransactionSigningMode.MULTISIG_TRANSACTION',

  SIGN_MODE_POOL_OWNER__INPUT_WITH_PATH_NOT_ALLOWED = 'inputs with path not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__DEVICE_OWNED_ADDRESS_NOT_ALLOWED = 'outputs given by path are not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__DATUM_NOT_ALLOWED = 'datum in outputs not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__REFERENCE_SCRIPT_NOT_ALLOWED = 'reference script in outputs not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__SINGLE_POOL_REG_CERTIFICATE_REQUIRED = 'single pool registration certificate is expected in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__THIRD_PARTY_POOL_KEY_REQUIRED = 'third party pool key is required in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__SINGLE_DEVICE_OWNER_REQUIRED = 'single device-owned pool owner is expected in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__WITHDRAWALS_NOT_ALLOWED = 'withdrawals not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__MINT_NOT_ALLOWED = 'mint not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__SCRIPT_DATA_HASH_NOT_ALLOWED = 'script data hash not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__COLLATERAL_INPUTS_NOT_ALLOWED = 'collateral inputs not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__COLLATERAL_OUTPUT_NOT_ALLOWED = 'reference inputs not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__TOTAL_COLLATERAL_NOT_ALLOWED = 'total collateral not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__REQUIRED_SIGNERS_NOT_ALLOWED = 'required signers not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__REFERENCE_INPUTS_NOT_ALLOWED = 'reference inputs not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__VOTING_PROCEDURES_NOT_ALLOWED = 'voting procedures not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__TREASURY_NOT_ALLOWED = 'treasury amount not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',
  SIGN_MODE_POOL_OWNER__DONATION_NOT_ALLOWED = 'treasury donation not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OWNER',

  SIGN_MODE_POOL_OPERATOR__DATUM_NOT_ALLOWED = 'datum in outputs not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__REFERENCE_SCRIPT_NOT_ALLOWED = 'reference script in outputs not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__SINGLE_POOL_REG_CERTIFICATE_REQUIRED = 'single pool registration certificate is expected in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__DEVICE_OWNED_POOL_KEY_REQUIRED = 'device owned pool key is required in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__DEVICE_OWNED_POOL_OWNER_NOT_ALLOWED = 'device-owned pool owner not expected in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__WITHDRAWALS_NOT_ALLOWED = 'withdrawals not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__MINT_NOT_ALLOWED = 'mint not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__SCRIPT_DATA_HASH_NOT_ALLOWED = 'script data hash not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__COLLATERAL_INPUTS_NOT_ALLOWED = 'collateral inputs not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__COLLATERAL_OUTPUT_NOT_ALLOWED = 'collateral output not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__TOTAL_COLLATERAL_NOT_ALLOWED = 'total collateral not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__REQUIRED_SIGNERS_NOT_ALLOWED = 'required signers not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__REFERENCE_INPUTS_NOT_ALLOWED = 'reference inputs not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__VOTING_PROCEDURES_NOT_ALLOWED = 'voting procedures not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__TREASURY_NOT_ALLOWED = 'treasury amount not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',
  SIGN_MODE_POOL_OPERATOR__DONATION_NOT_ALLOWED = 'treasury donation not allowed in TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR',

  SIGN_MODE_PLUTUS__DEVICE_OWNED_ADDRESS_NOT_ALLOWED = 'outputs given by path not allowed in TransactionSigningMode.PLUTUS_TRANSACTION',
  SIGN_MODE_PLUTUS__POOL_REGISTRATION_NOT_ALLOWED = 'pool registration not allowed in TransactionSigningMode.PLUTUS_TRANSACTION',

  ADDITIONAL_WITNESSES_NOT_ARRAY = 'additional witnesses not an array',

  OPERATIONAL_CERTIFICATE_INVALID_KES_KEY = 'invalid operational certificate kes key',
  OPERATIONAL_CERTIFICATE_INVALID_KES_PERIOD = 'invalid operational certificate kes period',
  OPERATIONAL_CERTIFICATE_INVALID_ISSUE_COUNTER = 'invalid operational certificate issue counter',
  OPERATIONAL_CERTIFICATE_INVALID_COLD_KEY_PATH = 'invalid operational certificate cold key path',

  CVOTE_INVALID_VOTECAST_DATA = 'invalid votecast data for CIP36 vote',
  CVOTE_INVALID_WITNESS = 'invalid witness for CIP36 vote',

  DERIVE_NATIVE_SCRIPT_HASH_INVALID_DATA = 'invalid native script input',
  DERIVE_NATIVE_SCRIPT_HASH_INVALID_KEY_PATH = 'invalid key path param',
  DERIVE_NATIVE_SCRIPT_HASH_INVALID_KEY_HASH = 'invalid key hash param',
  DERIVE_NATIVE_SCRIPT_HASH_SCRIPTS_NOT_AN_ARRAY = 'invalid scripts - scripts is not an array',
  DERIVE_NATIVE_SCRIPT_HASH_INVALID_REQUIRED_COUNT = 'invalid required count',
  DERIVE_NATIVE_SCRIPT_HASH_INVALID_TOKEN_LOCKING_SLOT = 'invalid token locking slot',
  DERIVE_NATIVE_SCRIPT_HASH_REQUIRED_COUNT_HIGHER_THAN_NUMBER_OF_SCRIPTS = 'invalid required count - higher than number of total scripts',
  DERIVE_NATIVE_SCRIPT_HASH_UNKNOWN_TYPE = 'unknown script type',
  DERIVE_NATIVE_SCRIPT_HASH_INVALID_DISPLAY_FORMAT = 'invalid native script hash display format',

  /**
   * For errors that we don't want to check on the LedgerJS side,
   * typically resulting from a detailed analysis of key derivation paths
   */
  LEDGER_POLICY = "Action rejected by Ledger's security policy",

  INVALID_B2_HASH = 'invalid blake2 hashing',
}

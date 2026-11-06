export const MAX_LOVELACE_SUPPLY_STR = '45 000 000 000.000000'.replace(
  /[ .]/g,
  '',
)
export const POOL_MARGIN_DENOMINATOR_MAX_STR =
  '1 000 000 000 000 000 000'.replace(/ /g, '')
export const UINT16_MAX = 0xffff
export const POOL_REGISTRATION_OWNERS_MAX = UINT16_MAX
export const POOL_REGISTRATION_RELAYS_MAX = UINT16_MAX
export const ASSET_GROUPS_MAX = UINT16_MAX
export const TOKENS_IN_GROUP_MAX = UINT16_MAX
// The device bounds major_protocol_version to the Conway CDDL range 0..12
export const PROTOCOL_MAJOR_VERSION_MAX = 12
// The device bounds unit_interval denominators (committee threshold, unit_interval protocol
// parameters) to 10^15
export const UNIT_INTERVAL_DENOMINATOR_MAX_STR =
  '1 000 000 000 000 000'.replace(/ /g, '')

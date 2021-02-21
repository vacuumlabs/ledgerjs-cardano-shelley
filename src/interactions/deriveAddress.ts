import type {
  AddressParams,
  DeriveAddressResponse,
  SendFn,
} from "../Ada";
import cardano from "../cardano";
import { parseAddressParams } from "../parsing";
import { INS } from "./common/ins";

export async function deriveAddress(
  _send: SendFn,
  addressParams: AddressParams,
): Promise<DeriveAddressResponse> {
  const P1_RETURN = 0x01;
  const P2_UNUSED = 0x00;

  const parsed = parseAddressParams(addressParams)
  const data = cardano.serializeAddressParams(parsed);

  const response = await _send({
    ins: INS.DERIVE_ADDRESS,
    p1: P1_RETURN,
    p2: P2_UNUSED,
    data: data,
  });

  return {
    addressHex: response.toString("hex"),
  };
}

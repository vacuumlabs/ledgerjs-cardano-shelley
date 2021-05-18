// @ts-ignore
import SpeculosTransport from "@ledgerhq/hw-transport-node-speculos";

import Ada from "../src/Ada";

// standard address of speculos described in https://speculos.ledger.com/user/clients.html
const apduPort = 9999;

export async function getTransport() {
  return await SpeculosTransport.open({ apduPort });
}

export async function getAda() {
  const transport = await SpeculosTransport.open({ apduPort });

  const ada = new Ada(transport);
  (ada as any).t = transport;
  return Promise.resolve(ada);
}

const ProtocolMagics = {
  MAINNET: 764824073,
  TESTNET: 42,
};

const NetworkIds = {
  TESTNET: 0x00,
  MAINNET: 0x01,
};

export const Networks = {
  Mainnet: {
    networkId: NetworkIds.MAINNET,
    protocolMagic: ProtocolMagics.MAINNET,
  },
  Testnet: {
    networkId: NetworkIds.TESTNET,
    protocolMagic: ProtocolMagics.TESTNET,
  },
  Fake: {
    networkId: 0x03,
    protocolMagic: 47,
  }
}
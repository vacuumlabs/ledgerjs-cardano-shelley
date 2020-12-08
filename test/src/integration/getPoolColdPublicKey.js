import { expect } from "chai";
import { getAda, str_to_path } from "../test_utils";

describe("getPoolColdPublicKey", async () => {
  let ada = {};

  beforeEach(async () => {
    ada = await getAda();
  });

  afterEach(async () => {
    await ada.t.close();
  });

  it("Should successfully get a single pool cold public key", async () => {
    const test = async path => {
      const result = await ada.getPoolColdPublicKey(
        str_to_path(path)
      );

      expect(result.publicKeyHex).to.equal("c5d853357072ac8223861852441a4d80a765738732d77f03e10e7df2cad8f4d7");
    };

    await test("1854'/1815'/0/0'");
  });
});

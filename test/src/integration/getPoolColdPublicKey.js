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

      expect(result.publicKeyHex).to.equal("e7dea141318d36a600c72ac61d2ced63047ccf290d184eaa91783bac94857c7d");
    };

    await test("1853'/1815'/0/0'");
  });
});

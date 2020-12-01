import { expect } from "chai";
import { getAda, str_to_path } from "../test_utils";

describe("getExtendedPublicKey", async () => {
  let ada = {};

  beforeEach(async () => {
    ada = await getAda();
  });

  afterEach(async () => {
    await ada.t.close();
  });

  it("Should successfully get a single extended public key", async () => {
    const test = async path => {
      const result = await ada.getColdPublicKey(
        str_to_path("1852'/1852'/0'")
      );

      expect(result.publicKeyHex).to.equal("deadbeef");
    };
  });
});

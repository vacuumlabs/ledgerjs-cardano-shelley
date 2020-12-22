import { expect } from "chai";
import { getAda, str_to_path } from "../test_utils";

describe("getExtendedPoolColdPublicKey", async () => {
  let ada = {};

  beforeEach(async () => {
    ada = await getAda();
  });

  afterEach(async () => {
    await ada.t.close();
  });

  it("Should successfully get a single pool cold public key", async () => {
    const test = async path => {
      const result = await ada.getExtendedPoolColdPublicKey(
        str_to_path(path)
      );

      expect(result.publicKeyHex).to.equal("e7dea141318d36a600c72ac61d2ced63047ccf290d184eaa91783bac94857c7d");
      expect(result.chainCodeHex).to.equal("ce1415094a8192bf54e3dc1fb24df8f61a5ecdb4a39bdb3498d6073f986c1ebd");
    };

    await test("1853'/1815'/0/0'");
  });

  it("Should reject path not matching cold key structure", async () => {
    const SHOULD_HAVE_THROWN = "should have thrown earlier";
    try {
      await ada.getExtendedPoolColdPublicKey(str_to_path("1852'/1815'/0'/0/0"));

      throw new Error(SHOULD_HAVE_THROWN);
    } catch (error) {
      expect(error.message).not.to.have.string(SHOULD_HAVE_THROWN);
    }
  });
});

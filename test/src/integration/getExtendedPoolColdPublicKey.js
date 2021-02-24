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

      expect(result.publicKeyHex).to.equal("3d7e84dca8b4bc322401a2cc814af7c84d2992a22f99554fe340d7df7910768d");
      expect(result.chainCodeHex).to.equal("1e2a47754207da3069f90241fbf3b8742c367e9028e5f3f85ae3660330b4f5b7");
    };

    await test("1853'/1815'/0'/0'");
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

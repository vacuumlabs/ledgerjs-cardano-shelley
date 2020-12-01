import { getAda, str_to_path } from "../test_utils";
import { expect } from "chai";

const operationalCertificates = {
  basicPoolOperationalCertificate: {
    kesPublicKeyHex: 0,
    kesPeriodStr: "47",
    counterStr: "42",
    coldKeyPath: str_to_path("1852'/1852'/0'")
  },
}

describe("signOperationalCertificate", async () => {
  let ada = {};

  beforeEach(async () => {
    ada = await getAda();
  });

  afterEach(async () => {
    await ada.t.close();
  });

  it("Should correctly sign basic operational certificate", async () => {
    const response = await ada.signOperationalCertificate();

    expect(response.operationalCertificateSignatureHex).to.equal("deadbeef");
  });
});

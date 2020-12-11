import { getAda, str_to_path } from "../test_utils";
import { expect } from "chai";

const operationalCertificates = {
  basicPoolOperationalCertificate: {
    kesPublicKeyHex: "3d24bc547388cf2403fd978fc3d3a93d1f39acf68a9c00e40512084dc05f2822",
    kesPeriodStr: "47",
    counterStr: "42",
    coldKeyPath: str_to_path("1853'/1815'/0/0'")
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
    const testCase = operationalCertificates.basicPoolOperationalCertificate;
    
    const response = await ada.signOperationalCertificate(
      testCase.kesPublicKeyHex,
      testCase.kesPeriodStr,
      testCase.counterStr,
      testCase.coldKeyPath,
    );

    expect(response.operationalCertificateSignatureHex).to.equal("d049315824428952bb0222cd3ccaf68c04fbfef54df13486a916180a387e2a775d4fa15bca43263021c27bcba8f2d967dcd53ab6a8250ef67f9aef2b3d761c0d");
  });
});

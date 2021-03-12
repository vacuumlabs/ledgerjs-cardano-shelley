import { getAda, str_to_path } from "../test_utils";
import { expect } from "chai";

const operationalCertificates = {
  basicPoolOperationalCertificate: {
    kesPublicKeyHex: "3d24bc547388cf2403fd978fc3d3a93d1f39acf68a9c00e40512084dc05f2822",
    kesPeriodStr: "47",
    issueCounterStr: "42",
    coldKeyPath: str_to_path("1853'/1815'/0'/0'")
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
      testCase.issueCounterStr,
      testCase.coldKeyPath,
    );

    expect(response.operationalCertificateSignatureHex).to.equal("ce8d7cab55217ed17f1cceb8cb487dcbe6172fdb5794cc26f78c2f1d2495598e72beb6209f113562f9488ef6e81e3e8f758ea072c3cf9c17095868f2e9213f0a");
  });
});

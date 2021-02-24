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

    expect(response.operationalCertificateSignatureHex).to.equal("b3d545de0d89ca8c337b7a1544419adb322a9c5e488a802fe9578f165202e59f3cf73bcc5ed533e05088c66deabae3c221090800d2681d4ff7cc2bf32bb73706");
  });
});

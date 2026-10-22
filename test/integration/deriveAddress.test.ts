import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'

import type {Ada} from '../../src/Ada'
import {DeviceVersionUnsupported, utils} from '../../src/Ada'
import {getAda, resolveRejectError} from '../test_utils'
import type {RejectError} from '../test_utils'
import {
  byronTestCases,
  rejectTestCases,
  shelleyTestCases,
} from './__fixtures__/deriveAddress'

chai.use(chaiAsPromised)

const address_hex_to_base58 = (addressHex: string) =>
  utils.base58_encode(Buffer.from(addressHex, 'hex'))

describe('deriveAddress', () => {
  let ada: Ada = {} as Ada

  beforeEach(async () => {
    ada = await getAda()
  })

  afterEach(async () => {
    await ada.transport.close()
  })

  describe('Should successfully derive Byron address', () => {
    for (const {
      testName,
      network,
      addressParams,
      result: expectedResult,
    } of byronTestCases) {
      it(testName, async () => {
        const isAppXS = (await ada.getVersion()).version.flags.isAppXS
        const promise = ada.deriveAddress({
          network,
          address: addressParams,
        })

        if (isAppXS) {
          await expect(promise).to.be.rejectedWith(DeviceVersionUnsupported)
        } else {
          expect(address_hex_to_base58((await promise).addressHex)).to.equal(
            expectedResult,
          )
        }
      })
    }
  })

  describe('Should successfully derive Shelley address', () => {
    for (const {
      testName,
      network,
      addressParams,
      result: expectedResult,
    } of shelleyTestCases) {
      it(testName, async () => {
        const {addressHex} = await ada.deriveAddress({
          network,
          address: addressParams,
        })

        expect(
          utils.bech32_encodeAddress(Buffer.from(addressHex, 'hex')),
        ).to.equal(expectedResult)
      })
    }
  }).timeout(60000)

  describe('Should reject address derive', () => {
    for (const {
      testName,
      network,
      addressParams,
      err,
      appVersion,
    } of rejectTestCases) {
      it(testName, async () => {
        const {version} = await ada.getVersion()
        const isAppXS = version.flags.isAppXS
        const resolvedErr = resolveRejectError(version, err)
        expect(resolvedErr, 'missing err for this app version').to.not.equal(
          undefined,
        )
        const {errCls, errMsg} = resolvedErr as RejectError

        const promise = ada.deriveAddress({
          network,
          address: addressParams,
        })

        if (isAppXS && (appVersion?.unsupportedInAppXS ?? false)) {
          await expect(promise).to.be.rejectedWith(DeviceVersionUnsupported)
        } else {
          await expect(promise).to.be.rejectedWith(errCls, errMsg)
        }
      })
    }
  })

  describe('Should successfully show Byron address', () => {
    for (const {testName, network, addressParams} of byronTestCases) {
      it(testName, async () => {
        const isAppXS = (await ada.getVersion()).version.flags.isAppXS
        const promise = ada.showAddress({
          network,
          address: addressParams,
        })

        if (isAppXS) {
          await expect(promise).to.be.rejectedWith(DeviceVersionUnsupported)
        } else {
          expect(await promise).to.equal(undefined)
        }
      })
    }
  })

  describe('Should successfully show Shelley address', () => {
    for (const {testName, network, addressParams} of shelleyTestCases) {
      it(testName, async () => {
        const result = await ada.showAddress({network, address: addressParams})
        expect(result).to.equal(undefined)
      })
    }
  }).timeout(60000)

  describe('Should reject address show', () => {
    for (const {
      testName,
      network,
      addressParams,
      err,
      appVersion,
    } of rejectTestCases) {
      it(testName, async () => {
        const {version} = await ada.getVersion()
        const isAppXS = version.flags.isAppXS
        const resolvedErr = resolveRejectError(version, err)
        expect(resolvedErr, 'missing err for this app version').to.not.equal(
          undefined,
        )
        const {errCls, errMsg} = resolvedErr as RejectError

        const promise = ada.showAddress({
          network,
          address: addressParams,
        })

        if (isAppXS && (appVersion?.unsupportedInAppXS ?? false)) {
          await expect(promise).to.be.rejectedWith(DeviceVersionUnsupported)
        } else {
          await expect(promise).to.be.rejectedWith(errCls, errMsg)
        }
      })
    }
  })
})

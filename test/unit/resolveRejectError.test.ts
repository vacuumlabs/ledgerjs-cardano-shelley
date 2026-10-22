import {expect} from 'chai'

import type {Version} from '../../src/types/public'
import {resolveRejectError} from '../test_utils'
import type {RejectError} from '../test_utils'

const mkVersion = (major: number, minor = 0, patch = 0): Version => ({
  major,
  minor,
  patch,
  flags: {isDebug: true, isAppXS: false},
})

const mkError = (errMsg: string): RejectError => ({errCls: Error, errMsg})

describe('resolveRejectError', () => {
  const v7 = mkError('v7')
  const v8 = mkError('v8')
  const v8_1 = mkError('v8.1')

  it('picks the entry of the major version', () => {
    const err = {v7, v8}
    expect(resolveRejectError(mkVersion(7, 3, 1), err)).to.equal(v7)
    expect(resolveRejectError(mkVersion(8, 0, 9), err)).to.equal(v8)
  })

  it('applies an entry up to the next one', () => {
    const err = {v7, v8, 'v8.1': v8_1}
    expect(resolveRejectError(mkVersion(8, 0, 9), err)).to.equal(v8)
    expect(resolveRejectError(mkVersion(8, 1, 0), err)).to.equal(v8_1)
    expect(resolveRejectError(mkVersion(8, 2, 0), err)).to.equal(v8_1)
    expect(resolveRejectError(mkVersion(9, 0, 0), err)).to.equal(v8_1)
  })

  it('does not depend on the order of the entries', () => {
    const err = {'v8.1': v8_1, v8, v7}
    expect(resolveRejectError(mkVersion(7, 3, 1), err)).to.equal(v7)
    expect(resolveRejectError(mkVersion(8, 0, 9), err)).to.equal(v8)
    expect(resolveRejectError(mkVersion(8, 1, 0), err)).to.equal(v8_1)
  })

  it('returns undefined for a version older than every entry', () => {
    const err = {v8}
    expect(resolveRejectError(mkVersion(7, 3, 1), err)).to.equal(undefined)
  })

  it('rejects an invalid version key', () => {
    const err = {'v8.1.2': v8}
    expect(() => resolveRejectError(mkVersion(8, 1, 2), err)).to.throw(
      'Invalid app version in err: v8.1.2',
    )
  })
})

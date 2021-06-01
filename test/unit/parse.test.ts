import basex from "base-x"
import {expect} from "chai"

import {InvalidDataReason} from "../../src/errors"
import {assert} from "../../src/utils/assert"
import {parseInt64_str, parseUint64_str} from "../../src/utils/parse"

describe('test parsing of integers', () => {
    it('parse int64 correctly', () => {
        let nmb = "1235543"
        let result = parseInt64_str(nmb, {}, InvalidDataReason.INPUT_INVALID_TX_HASH)
        expect(result).to.equal("1235543")
    })

    it("parse negative int64 correctly", () => {
        let nmb = "-123456"
        let result = parseInt64_str(nmb, {}, InvalidDataReason.INPUT_INVALID_TX_HASH)
        expect(result).to.equal("-123456")
    })

    it("throw error when trying to parse negative number as Uint", () => {
        let nmb = "-123456"
        //let result = parseUint64_str(nmb, {}, InvalidDataReason.INPUT_INVALID_TX_HASH)
        expect(() => parseUint64_str(nmb, {}, InvalidDataReason.INPUT_INVALID_TX_HASH)).to.throw(InvalidDataReason.INPUT_INVALID_TX_HASH)
    })

    it("decode shit", () => {
        const bs10 = basex("-0123456789")
        let nmb = "-123456"
        let decoded = bs10.decode(nmb)
        console.log(decoded)

        expect(bs10.encode(decoded)).to.equal(nmb)
    })

    it("decode shit 3", () => {
        const bs10 = basex("0123456789")
        let nmb = "123456"
        let decoded = bs10.decode(nmb)
        console.log(decoded)

        expect(bs10.encode(decoded)).to.equal(nmb)
    })

    it("decode shit 2", () => {
        const bs10 = basex("-0123456789")
        let nmb = "123456"
        let decoded = bs10.decode(nmb)
        console.log(decoded)

        expect(bs10.encode(decoded)).to.equal(nmb)
    })

    it("decode shit 4", () => {
        const bs10 = basex("-0123456789")
        let nmb = "-9223372036854775808"
        let decoded = bs10.decode(nmb)
        console.log(decoded, "; length: ", decoded.length)
        assert(decoded.length <= 8, "excessive data")

        expect(bs10.encode(decoded)).to.equal(nmb)
    })
})
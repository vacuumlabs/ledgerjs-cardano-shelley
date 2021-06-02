import { Int64BE, Uint64BE } from "int64-buffer"
import {expect} from "chai"

import {InvalidDataReason} from "../../src/errors"
import {assert} from "../../src/utils/assert"
import {parseInt64_str, parseUint64_str} from "../../src/utils/parse"

describe('test parsing of integers', () => {
    it("decode signed 1", () => {
        let numberString = "-123456"
        let int64Obj = new Int64BE(numberString, 10)
        let bufferRep = int64Obj.toBuffer()
        assert(bufferRep.length <= 8, "excessive data")
        console.log(bufferRep)

        expect(int64Obj.toString()).to.equal(numberString)
    })

    it("decode signed 2", () => {
        let numberString = "9223372036854775807"
        let int64Obj = new Int64BE(numberString, 10)
        let bufferRep = int64Obj.toBuffer()
        assert(bufferRep.length <= 8, "excessive data")
        console.log(bufferRep)

        expect(int64Obj.toString()).to.equal(numberString)
    })

    it("decode signed 3", () => {
        let numberString = "0"
        let int64Obj = new Int64BE(numberString, 10)
        let bufferRep = int64Obj.toBuffer()
        assert(bufferRep.length <= 8, "excessive data")
        console.log(bufferRep)

        expect(int64Obj.toString()).to.equal(numberString)
    })

    it("decode signed 4", () => {
        let numberString = "-9223372036854775808"
        let int64Obj = new Int64BE(numberString, 10)
        let bufferRep = int64Obj.toBuffer()
        assert(bufferRep.length <= 8, "excessive data")
        console.log(bufferRep)

        expect(int64Obj.toString()).to.equal(numberString)
    })

    it("decode unsigned 1", () => {
        let numberString = "0"
        let int64Obj = new Uint64BE(numberString, 10)
        let bufferRep = int64Obj.toBuffer()
        assert(bufferRep.length <= 8, "excessive data")
        console.log(bufferRep)

        expect(int64Obj.toString()).to.equal(numberString)
    })

    it("decode unsigned 2", () => {
        let numberString = "9223372036854775807"
        let int64Obj = new Uint64BE(numberString, 10)
        let bufferRep = int64Obj.toBuffer()
        assert(bufferRep.length <= 8, "excessive data")
        console.log(bufferRep)

        expect(int64Obj.toString()).to.equal(numberString)
    })

    it("decode unsigned 3", () => {
        let numberString = "18446744073709551615"
        let int64Obj = new Uint64BE(numberString, 10)
        let bufferRep = int64Obj.toBuffer()
        assert(bufferRep.length <= 8, "excessive data")
        console.log(bufferRep)

        expect(int64Obj.toString()).to.equal(numberString)
    })

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
})
import {expect} from 'chai'

import {testsConwayProposalProcedures} from '../../integration/__fixtures__/signTx'
import {serializeTransactionRaw} from '../../../src/interactions/v8/serialization/tx'
import {InvalidDataReason} from '../../../src/errors'
import {parseSignTransactionRequest} from '../../../src/parsing/transaction'
import {GovActionType} from '../../../src/types/public'
import type {
  GovAction,
  ProtocolParamUpdate,
  Version,
} from '../../../src/types/public'
import {buildSignTxInit} from '../../../src/interactions/v8/commandBuilder'
import {gatherWitnessPaths} from '../../../src/interactions/common/witnessPaths'
import {
  parsedProposalHardForkInitiationSignTxRequest,
  parsedProposalInfoSignTxRequest,
  parsedProposalNewConstitutionSignTxRequest,
  parsedProposalNoConfidenceSignTxRequest,
  parsedProposalParameterChangeCanonicalSignTxRequest,
  parsedProposalParameterChangeSignTxRequest,
  parsedProposalTreasuryWithdrawalsSignTxRequest,
  parsedProposalUpdateCommitteeSignTxRequest,
  proposalHardForkInitiationRawTxHex,
  proposalInfoRawTxHex,
  proposalNewConstitutionRawTxHex,
  proposalNoConfidenceRawTxHex,
  proposalParameterChangeCanonicalRawTxHex,
  proposalParameterChangeRawTxHex,
  proposalTreasuryWithdrawalsRawTxHex,
  proposalUpdateCommitteeRawTxHex,
} from '../__fixtures__/v8/signTx'

describe('v8 proposal procedures serialization', () => {
  it('covers every governance action type', () => {
    const types = testsConwayProposalProcedures.map(
      (fixture) => fixture.tx.proposalProcedures?.[0].govAction.type,
    )
    for (const govActionType of [
      GovActionType.PARAMETER_CHANGE,
      GovActionType.HARD_FORK_INITIATION,
      GovActionType.TREASURY_WITHDRAWALS,
      GovActionType.NO_CONFIDENCE,
      GovActionType.UPDATE_COMMITTEE,
      GovActionType.NEW_CONSTITUTION,
      GovActionType.INFO,
    ]) {
      expect(types).to.include(govActionType)
    }
  })

  it('serializes the info action raw tx like the Python fixture', () => {
    expect(
      serializeTransactionRaw(parsedProposalInfoSignTxRequest.tx).toString(
        'hex',
      ),
    ).to.equal(proposalInfoRawTxHex)
  })

  it('serializes the hard fork initiation raw tx like the Python fixture', () => {
    expect(
      serializeTransactionRaw(
        parsedProposalHardForkInitiationSignTxRequest.tx,
      ).toString('hex'),
    ).to.equal(proposalHardForkInitiationRawTxHex)
  })

  it('serializes the new constitution raw tx like the Python fixture', () => {
    expect(
      serializeTransactionRaw(
        parsedProposalNewConstitutionSignTxRequest.tx,
      ).toString('hex'),
    ).to.equal(proposalNewConstitutionRawTxHex)
  })

  it('serializes the update committee raw tx like the Python fixture', () => {
    expect(
      serializeTransactionRaw(
        parsedProposalUpdateCommitteeSignTxRequest.tx,
      ).toString('hex'),
    ).to.equal(proposalUpdateCommitteeRawTxHex)
  })

  it('serializes the treasury withdrawals raw tx like the Python fixture', () => {
    expect(
      serializeTransactionRaw(
        parsedProposalTreasuryWithdrawalsSignTxRequest.tx,
      ).toString('hex'),
    ).to.equal(proposalTreasuryWithdrawalsRawTxHex)
  })

  it('serializes the no confidence raw tx like the Python fixture', () => {
    expect(
      serializeTransactionRaw(
        parsedProposalNoConfidenceSignTxRequest.tx,
      ).toString('hex'),
    ).to.equal(proposalNoConfidenceRawTxHex)
  })

  it('serializes the parameter change raw tx like the Python fixture', () => {
    expect(
      serializeTransactionRaw(
        parsedProposalParameterChangeSignTxRequest.tx,
      ).toString('hex'),
    ).to.equal(proposalParameterChangeRawTxHex)
  })

  it('serializes the canonical parameter change raw tx like the Python fixture', () => {
    expect(
      serializeTransactionRaw(
        parsedProposalParameterChangeCanonicalSignTxRequest.tx,
      ).toString('hex'),
    ).to.equal(proposalParameterChangeCanonicalRawTxHex)
  })
})

describe('v8 proposal procedures init gating', () => {
  const v81: Version = {
    major: 8,
    minor: 1,
    patch: 0,
    flags: {isDebug: false, isAppXS: false},
  }
  const v82: Version = {
    major: 8,
    minor: 2,
    patch: 0,
    flags: {isDebug: false, isAppXS: false},
  }

  it('sends the proposal count only to apps that read it', () => {
    const fixture = testsConwayProposalProcedures[0]
    const parsed = parseSignTransactionRequest({
      tx: fixture.tx,
      signingMode: fixture.signingMode,
      additionalWitnessPaths: fixture.additionalWitnessPaths,
      options: fixture.options,
    })
    const witnessPaths = gatherWitnessPaths(parsed)

    const init81 = buildSignTxInit(v81, parsed, witnessPaths).data
    const init82 = buildSignTxInit(v82, parsed, witnessPaths).data

    // App 8.1 and earlier predate proposal support and would misread the count as the treasury flag.
    expect(init82.length).to.equal(init81.length + 2)

    let offset = 0
    while (init81[offset] === init82[offset]) offset++
    expect(init82.subarray(offset, offset + 2).toString('hex')).to.equal('0001')
    expect(
      Buffer.concat([
        init82.subarray(0, offset),
        init82.subarray(offset + 2),
      ]).toString('hex'),
    ).to.equal(init81.toString('hex'))
  })
})

describe('v8 proposal procedures validation of device limits', () => {
  const findFixture = (govActionType: GovActionType) => {
    const fixture = testsConwayProposalProcedures.find(
      (candidate) =>
        candidate.tx.proposalProcedures?.[0].govAction.type === govActionType,
    )
    if (fixture == null) throw new Error(`no fixture for ${govActionType}`)
    return fixture
  }

  const parseWithGovAction = (
    govActionType: GovActionType,
    patch: (govAction: GovAction) => GovAction,
  ) => {
    const fixture = findFixture(govActionType)
    const [proposal, ...rest] = fixture.tx.proposalProcedures ?? []
    return parseSignTransactionRequest({
      tx: {
        ...fixture.tx,
        proposalProcedures: [
          {...proposal, govAction: patch(proposal.govAction)},
          ...rest,
        ],
      },
      signingMode: fixture.signingMode,
      additionalWitnessPaths: fixture.additionalWitnessPaths,
      options: fixture.options,
    })
  }

  const withProtocolMajor = (major: number) => (govAction: GovAction) =>
    govAction.type === GovActionType.HARD_FORK_INITIATION
      ? {...govAction, protocolVersion: {...govAction.protocolVersion, major}}
      : govAction

  it('accepts protocol major version 12', () => {
    expect(() =>
      parseWithGovAction(
        GovActionType.HARD_FORK_INITIATION,
        withProtocolMajor(12),
      ),
    ).not.to.throw()
  })

  it('rejects protocol major version above 12', () => {
    expect(() =>
      parseWithGovAction(
        GovActionType.HARD_FORK_INITIATION,
        withProtocolMajor(13),
      ),
    ).to.throw(InvalidDataReason.GOV_ACTION_INVALID_PROTOCOL_VERSION)
  })

  const withThreshold =
    (numerator: string, denominator: string) => (govAction: GovAction) =>
      govAction.type === GovActionType.UPDATE_COMMITTEE
        ? {...govAction, threshold: {numerator, denominator}}
        : govAction

  it('accepts committee threshold at the denominator limit', () => {
    expect(() =>
      parseWithGovAction(
        GovActionType.UPDATE_COMMITTEE,
        withThreshold('1000000000000000', '1000000000000000'),
      ),
    ).not.to.throw()
  })

  for (const [name, numerator, denominator] of [
    ['above 1', '3', '2'],
    ['with denominator above the limit', '1', '1000000000000001'],
    ['with zero denominator', '0', '0'],
  ]) {
    it(`rejects committee threshold ${name}`, () => {
      expect(() =>
        parseWithGovAction(
          GovActionType.UPDATE_COMMITTEE,
          withThreshold(numerator, denominator),
        ),
      ).to.throw(InvalidDataReason.GOV_ACTION_INVALID_COMMITTEE_THRESHOLD)
    })
  }

  const withProtocolParamUpdate =
    (protocolParamUpdate: ProtocolParamUpdate) => (govAction: GovAction) =>
      govAction.type === GovActionType.PARAMETER_CHANGE
        ? {...govAction, protocolParamUpdate}
        : govAction

  it('accepts nonnegative_interval protocol parameter above 1', () => {
    expect(() =>
      parseWithGovAction(
        GovActionType.PARAMETER_CHANGE,
        withProtocolParamUpdate({
          poolPledgeInfluence: {
            numerator: '18446744073709551615',
            denominator: '1',
          },
        }),
      ),
    ).not.to.throw()
  })

  it('accepts unit_interval protocol parameter at the denominator limit', () => {
    expect(() =>
      parseWithGovAction(
        GovActionType.PARAMETER_CHANGE,
        withProtocolParamUpdate({
          treasuryGrowthRate: {
            numerator: '1000000000000000',
            denominator: '1000000000000000',
          },
        }),
      ),
    ).not.to.throw()
  })

  it('rejects unit_interval protocol parameter above 1', () => {
    expect(() =>
      parseWithGovAction(
        GovActionType.PARAMETER_CHANGE,
        withProtocolParamUpdate({
          treasuryGrowthRate: {numerator: '3', denominator: '2'},
        }),
      ),
    ).to.throw(InvalidDataReason.GOV_ACTION_INVALID_PROTOCOL_PARAM_UPDATE)
  })

  it('rejects parameter change without protocol parameters', () => {
    expect(() =>
      parseWithGovAction(
        GovActionType.PARAMETER_CHANGE,
        withProtocolParamUpdate({}),
      ),
    ).to.throw(InvalidDataReason.GOV_ACTION_INVALID_PROTOCOL_PARAM_UPDATE)
  })
})

// Test-only helper: walks through Speculos review screens (Stax) via its REST API
// so that integration tests run without manual confirmation.
// It only navigates and approves; screen content is not checked here.

const apiUrl = process.argv[2]
if (!apiUrl) {
  console.error('usage: speculos-autonav.mjs <speculos-api-url>')
  process.exit(1)
}
const log = process.env.AUTONAV_LOG
  ? (...args) => console.log('[autonav]', ...args)
  : () => {}

// Stax geometry, taken from ragger (firmware/touch/positions.py)
const CENTER = {x: 200, y: 336}
const CONFIRM_BUTTON = {x: 200, y: 515} // UseCaseReview.confirm / UseCaseChoice.confirm
const LONG_PRESS_SECONDS = 3.0 // the SDK needs at least 2.4 s

// Stax layout as Speculos OCR reports it. Screen text is not trusted alone,
// because review values (e.g. a signed message) can contain any text.
// - Tags and values are left-aligned at BORDER_MARGIN, with height 31 or 40.
// - Button labels have height 32. The action buttons (confirm, choice
//   buttons) are at the bottom; "Show as QR" and "More" are higher up.
//   OCR reports wrong x/w for button labels, so only y and h are used.
// - "Hold to sign" is left-aligned at the bottom and is the only
//   left-aligned text on its page.
// - Status, spinner and home screens have only centered, non-button text.
const SCREEN_CENTER_X = 200
const BORDER_MARGIN = 24
const BUTTON_TEXT_HEIGHT = 32
const ACTION_AREA_Y = 480
const CENTER_TOLERANCE = 2

// home menu, spinner and final status screens: nothing to do
const IDLE_TEXTS = [
  /^This app enables/i,
  /^Processing/i,
  /signed$/i,
  /rejected$/i,
  /verified$/i,
  /exported$/i,
]
const LONG_PRESS_TEXTS = [/^Hold to (sign|confirm)/i]
const CONFIRM_TEXTS = [
  /^Confirm$/i,
  /^Continue( anyway)?$/i,
  /^Approve$/i,
  /^Accept/i,
  /^Export$/i,
  /^Allow$/i,
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function request(path, options) {
  const response = await fetch(`${apiUrl}${path}`, options)
  if (!response.ok) {
    throw new Error(
      `${options?.method ?? 'GET'} ${path}: HTTP ${response.status}`,
    )
  }
  return response
}

async function getScreen() {
  const path = '/events?currentscreenonly=true'
  const {events} = await (await request(path)).json()
  if (!Array.isArray(events)) {
    throw new Error(`GET ${path}: response has no events array`)
  }
  return events.filter((event) => event.text && event.text.trim() !== '')
}

async function finger(data) {
  await request('/finger', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({action: 'press-and-release', ...data}),
  })
}

const matches = (event, patterns) =>
  patterns.some((pattern) => pattern.test(event.text.trim()))

const isLeftAligned = (event) => event.x === BORDER_MARGIN

const isCentered = (event) =>
  Math.abs(event.x + event.w / 2 - SCREEN_CENTER_X) <= CENTER_TOLERANCE

const isActionButton = (event) =>
  event.h === BUTTON_TEXT_HEIGHT && event.y >= ACTION_AREA_Y

const findConfirmButton = (events) =>
  events.find((event) => isActionButton(event) && matches(event, CONFIRM_TEXTS))

const isLongPressScreen = (events) => {
  const leftAligned = events.filter(isLeftAligned)
  return (
    leftAligned.length === 1 &&
    leftAligned[0].y >= ACTION_AREA_Y &&
    matches(leftAligned[0], LONG_PRESS_TEXTS)
  )
}

const isIdleScreen = (events) =>
  events.every(
    (event) => isCentered(event) && event.h !== BUTTON_TEXT_HEIGHT,
  ) && events.some((event) => matches(event, IDLE_TEXTS))

const screenKey = (events) =>
  JSON.stringify(events.map((event) => event.text.trim()))

const geometryOf = (events) =>
  JSON.stringify(events.map(({text, x, y, w, h}) => [text.trim(), x, y, w, h]))

let lastLogged = null

// Acts on the current screen; returns the screen it acted on, or null if it did nothing.
async function step() {
  const events = await getScreen()
  if (events.length === 0) return null
  const texts = screenKey(events)
  if (texts !== lastLogged) {
    log('screen', geometryOf(events))
    lastLogged = texts
  }

  if (isLongPressScreen(events)) {
    log('long press', texts)
    await finger({...CONFIRM_BUTTON, delay: LONG_PRESS_SECONDS})
    return texts
  }
  const confirm = findConfirmButton(events)
  if (confirm) {
    log(`tap "${confirm.text.trim()}"`, texts)
    // buttons span the screen width; the OCR x/w of their labels is not reliable
    await finger({
      x: SCREEN_CENTER_X,
      y: confirm.y + Math.floor(confirm.h / 2),
      delay: 0.1,
    })
    return texts
  }
  if (isIdleScreen(events)) return null

  log('swipe', texts)
  await finger({...CENTER, x2: CENTER.x - 10, y2: CENTER.y, delay: 0.1})
  return texts
}

// Never act twice on the same screen: wait until it changes (a second tap
// could otherwise land on the next screen).
async function waitForScreenChange(previous, timeoutMs = 3000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    await sleep(100)
    if (screenKey(await getScreen()) !== previous) return
  }
  log('screen did not change, acting again')
}

// The runner starts the navigator only after the API port listens and stops
// it before Speculos, so a failed request is a real problem. Report it on
// stderr (the runner lists it in its summary) and keep going, so that the
// following tests still run. A test that is left waiting fails on its mocha
// timeout.
const RETRY_MS = 500

const describeError = (error) =>
  error.cause
    ? `${error.message} (${error.cause.code ?? error.cause})`
    : error.message

let failures = 0
for (;;) {
  try {
    const actedOn = await step()
    if (failures > 0) {
      console.error(`[autonav] recovered after ${failures} failed attempt(s)`)
      failures = 0
    }
    if (actedOn === null) await sleep(200)
    else await waitForScreenChange(actedOn)
  } catch (error) {
    if (failures === 0) {
      console.error('[autonav] request failed:', describeError(error))
    }
    failures += 1
    await sleep(RETRY_MS)
  }
}

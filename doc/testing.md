# Testing

## Test suites

### Unit tests (`test/unit/`)

No device needed. Fast. Run after any change to parsing or serialization logic.

```bash
yarn test-unit
```

What they cover:

- `address.test.ts`, `parse.test.ts` — address encoding and parser utilities
- `txOptionsEncoding.test.ts` — transaction options encoding
- `v8/` — v8 APDU command builder and sender behavior, per-operation dispatch:
  - `commandBuilder.opcert.test.ts`, `commandSender.opcert.test.ts`
  - `signTx.test.ts`, `signTxAllElements.test.ts`
  - `signCVote.test.ts`, `signMessage.test.ts`, `deriveAddress.test.ts`
  - `credential.test.ts`, `dispatch.signOperationalCertificate.test.ts`

Unit test fixtures live in `test/unit/__fixtures__/`. The v8 fixtures (`test/unit/__fixtures__/v8/`) import shared transaction data from `test/integration/__fixtures__/` to avoid duplication.

### Integration tests (`test/integration/`)

Require a connected Ledger device or Speculos emulator. Test the full stack end-to-end against the real app.

```bash
yarn test-integration          # real device
yarn test-speculos             # Speculos emulator (started automatically)
yarn test-speculos --display   # same, with Speculos GUI visible
yarn test-speculos --auto      # same, review screens confirmed automatically (app v8)
yarn test-speculos --auto -n 4 # same, sharded over 4 Speculos instances
yarn test-speculos --grep signTx   # run only matching tests
APP_ELF=/path/to/app.elf yarn test-speculos   # override elf path
```

Integration fixtures live in `test/integration/__fixtures__/`. They are data-driven: each fixture file exports arrays of test cases with `tx`, `signingMode`, `expectedResult`, etc.

### Device self-test

Runs tests embedded in the device app itself. Requires a development build of the app.

```bash
yarn device-self-test
yarn device-self-test-speculos
```

## Speculos setup

`yarn test-speculos` uses Speculos from the sibling repo `../ledger-app-cardano-dev`. The default elf is `../ledger-app-cardano-dev/build/stax/bin/app.elf`. To use a different app repo, set `APP_REPO=/path/to/app-repo`; both the elf and venv paths are derived from it. Set up the venv once:

```bash
cd ../ledger-app-cardano-dev
python3 -m venv tests/venv
source tests/venv/bin/activate
pip install -r tests/requirements.txt
```

### App version and headless mode

- **App v7 and earlier:** A debug build compiled with headless mode enabled auto-confirms all prompts — fully automated testing is possible. Use such a build with `yarn test-speculos`. The `--display headless` flag only hides the GUI window; it does **not** enable auto-confirmation (that is a compile-time property of the elf).
- **App v8 and later:** Headless auto-confirmation was removed. Use `yarn test-speculos --auto` for fully automated runs (see below), or `--display` to confirm the screens manually.
- **Debug build required:** the integration suite expects a debug build of the app (`make DEBUG=1`). `getVersion` checks `isDebug`, and test cases with `requiresExpertMode` enable expert mode through a debug-only command (a release build answers `0x6d00`).

### Automatic navigation (`--auto`)

With `--auto`, `scripts/test-speculos.sh` enables the Speculos REST API and starts `scripts/speculos-autonav.mjs` next to each Speculos instance. The navigator reads the current screen and walks through it like a user: it swipes through review pages, taps confirmation buttons (including "Continue anyway" on warnings) and long-presses "Hold to sign". Touch positions are taken from ragger and match Stax.

- Buttons and status screens are found by text **and** by their position and text height on the Stax layout, because review values can contain any text. For example, a message with the text "Confirm" is swiped past, not tapped. If the SDK changes the layout, compare the `AUTONAV_LOG=1` output (text, x, y, w, h of each event) with the constants in the script.
- It checks what the tests check (APDU bytes, tx hash, witnesses). It does **not** check what the screens show: it accepts every warning and signs everything. Screen content is covered by the ragger golden snapshots in the app repo.
- Every test runs once and the run always continues to the end. A screen the navigator does not recognize leaves the test waiting, so with `--auto` the default test timeout is 2 minutes instead of 1 hour (a `--timeout` on the command line overrides it). Rerun a test that timed out with `AUTONAV_LOG=1` to print every screen and action:

  ```bash
  AUTONAV_LOG=1 yarn test-speculos --auto --grep "<test name>"
  ```

- If a request to the Speculos API fails, the navigator prints the error and keeps running. The summary lists these errors under `autonav errors`, together with a navigator that exited early, and the run then fails even if all tests pass.
- When a test leaves the app stuck on a screen, every later test in that Speculos instance fails with `0x6901`. Only the first failure matters.
- The API listens on port 5000 (+1 per instance; override with `SPECULOS_API_PORT`), the same default as ragger. Do not run ragger tests at the same time, or move both ports:

  ```bash
  SPECULOS_APDU_PORT=19999 SPECULOS_API_PORT=15000 yarn test-speculos --auto
  ```

## Lint and build

```bash
yarn lint     # ESLint + Prettier (treat warnings as failures)
yarn build    # compile TypeScript to dist/
```

1. install and build speculos
    1. clone speculos' source code from https://github.com/LedgerHQ/speculos
    2. follow the installation and build instructions from https://speculos.ledger.com/installation/build.html
    3. test your installation by running `./speculos.py apps/btc.elf` in the folder with the speculos source code
2. adjust ledgerjs to communicate with speculos instead of hw ledger (or simply checkout [this PR](https://github.com/vacuumlabs/ledgerjs-cardano-shelley/pull/108/files) with all required changes)
    1. add the dependency `"@ledgerhq/hw-transport-node-speculos": "^5.51.1",` to `package.json`
    2. create transport layer in `getAda()` function in  `test/test_utils.ts` with `await SpeculosTransport.open({ 9999 });` instead of `TransportNodeHid.create(1000);`
3. run tests
    1. start speculos with ledger-app via by executing `./speculos.py /PATH-TO-LEDGER-APP/bin/app.elf` in the folder with the speculos source code
    2. run the ledgerjs-tests via e.g. `yarn test-integration --grep <test-name>`

# Spalk Tech Test

This repo contains sample files and outputs for the Spalk tech test

The source is written in TypeScript, using `node v20.15.1`, & `npm 10.7.0`

## Current Issues
`test_sucess.ts` is missing the first ID: `0x0`
`test_failure` is returning `packet 20884` instead of `packet 20535`

### Installation
`npm install`

#### Run test_seccess
`cat test_success.ts | npm run start`

#### Run test_failure
`cat test_failure.ts | npm run start`

### Run unit tests
`npm run test`
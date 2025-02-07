
# Spalk Tech Test

This repo contains sample files and outputs for the Spalk tech test

The source is written in TypeScript, using `node v20.15.1`, & `npm 10.7.0`

### Current Issues
`test_failure` is returning `packet 20884` instead of `packet 20535` *(see failure log at bottom of readme for details)*

#### Installation
`npm install`

#### Run test_seccess
`cat test_success.ts | npm run start`

#### Run test_failure
`cat test_failure.ts | npm run start`

#### Run unit tests
`npm run test`

### TODO:
Add unit tests to Github Actions

#### failure log - packets expected, vs found err
```
_packetCount: 20531, id: 33, packet[0]: 71
_packetCount: 20532, id: 36, packet[0]: 71
_packetCount: 20533, id: 33, packet[0]: 71
_packetCount: 20534, id: 33, packet[0]: 71
_packetCount: 20535, id: 33, packet[0]: 71
_packetCount: 20536, id: 37, packet[0]: 71
_packetCount: 20537, id: 33, packet[0]: 71
_packetCount: 20538, id: 33, packet[0]: 71
_packetCount: 20539, id: 33, packet[0]: 71

_packetCount: 20881, id: 33, packet[0]: 71
_packetCount: 20882, id: 33, packet[0]: 71
_packetCount: 20883, id: 33, packet[0]: 71
_packetCount: 20884, id: null, packet[0]: 50
_packetCount: 20885, id: 33, packet[0]: 71
_packetCount: 20886, id: 33, packet[0]: 71
_packetCount: 20887, id: 33, packet[0]: 71
_packetCount: 20888, id: 34, packet[0]: 71
_packetCount: 20889, id: 33, packet[0]: 71
```
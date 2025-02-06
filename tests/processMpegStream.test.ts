import fs from 'fs';
import path from 'path';

import processMpegStream from '../processMpegStream';

const SUCCESS_IDs = fs.readFileSync(path.resolve(__dirname, '../success_output.txt'), {
  encoding: 'utf8'
}).split('\n');

const FAILURE_OUTPUT = fs.readFileSync(path.resolve(__dirname, '../failure_output.txt'), {
  encoding: 'utf8'
})

describe('testing test_sucess.ts example file', () => {
  test('Should return success_output IDs successfully', async () => {
    const stream = fs.createReadStream(path.resolve(__dirname, '../test_success.ts'));
    const results = await processMpegStream(stream, 188);

    expect(results.map(id => `0x${id.toString(16)}`)).toEqual(SUCCESS_IDs)
  }, 20 * 1000);
});

describe('testing test_failure.ts example file', () => {
  test('Should return failure_output successfully', async () => {
    const stream = fs.createReadStream(path.resolve(__dirname, '../test_failure.ts'));

    try {
      const results = await processMpegStream(stream, 188);
    } catch (e) {
      expect(`${e}`).toEqual(FAILURE_OUTPUT)
    }
  }, 20 * 1000);
});
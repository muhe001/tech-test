import fs from 'fs';
import path from 'path';

import processMpegStream from '../processMpegStream';

const SUCCESS_IDs = fs.readFileSync(path.resolve(__dirname, '../success_output.txt'), {
  encoding: 'utf8'
}).split('\n')

describe('testing test_sucess.ts example file', () => {
  test('Should return success_output IDs successfully', async () => {
    const stream = fs.createReadStream(path.resolve(__dirname, '../test_success.ts'));
    const results = await processMpegStream(stream, 188);

    expect(results.map(id => `0x${id.toString(16)}`)).toEqual(SUCCESS_IDs)
  }, 20 * 1000);
});
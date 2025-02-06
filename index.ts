import processMpegStream from './processMpegStream';

const stream = process.stdin;

processMpegStream(stream, 188).then(results => {
  console.log(`results: ${results}`);
  process.exit(0)
}).catch(err => {
  console.error(err);
  process.exit(1)
})
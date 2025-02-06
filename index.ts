import processMpegStream from './processMpegStream';

const stream = process.stdin;

processMpegStream(stream, 188).then(results => {
  results.forEach(id => console.log(`0x${id.toString(16)}`));
  process.exit(0)
}).catch(err => {
  console.error(err);
  process.exit(1)
})
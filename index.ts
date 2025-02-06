import processMpegStream from './processMpegStream';

const stream = process.stdin;

processMpegStream(stream, 188).then(results => {
  results.forEach(id => console.log(id));
  process.exit(0)
}).catch(err => {
  console.log(`${err}`);
  process.exit(1)
})
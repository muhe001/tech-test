export default function processMpegIDs(
  stream: NodeJS.ReadableStream, 
  bytesInPacket: number
): Promise<number[]> {
  return new Promise<number[]>((resolve, reject) => {
    stream.on('data', processPacketsInData(bytesInPacket, reject));
    stream.on('end', preocessEnd(resolve))
  });
}

let isFirst = true;

function processPacketsInData(
  bytesInPacket: number,
  reject: (reason?: any) => void
): (chunk: Buffer) => void {
  return (chunk) => {
    if (isFirst) console.log(`chunk is ${chunk.length} bytes`)
    isFirst = false;
  }
}

function preocessEnd(resolve: (value: number[] | PromiseLike<number[]>) => void): () => void {
  return () => {
    resolve([]);
  }
}
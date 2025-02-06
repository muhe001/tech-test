export default function processMpegIDs(
  stream: NodeJS.ReadableStream, 
  bytesInPacket: number
): Promise<number[]> {
  return new Promise<number[]>((resolve, reject) => {
    stream.on('data', processPacketsInData(bytesInPacket, reject));
    stream.on('end', preocessEnd(resolve))
  });
}

let _isFirst = true; // keep track of first packet - may not have "sync byte"
let _remainderChunks: number[] = []; // cahce for unprocessed buffer chunks
const _packetIDs = new Set<number>(); // chace for packet IDs

function processPacketsInData(
  bytesInPacket: number,
  reject: (reason?: any) => void
): (chunk: Buffer) => void {
  return (chunk) => {
    const chunkArr = [ ..._remainderChunks, ...chunk ];
    const numOfBytes = chunkArr.length;

    // if we dont have enough data to parse a packet, add to _remainderChunks cache
    if (numOfBytes < bytesInPacket) {
      _remainderChunks = chunkArr;
     return;
    }

    if (_isFirst) console.log(`chunk is ${numOfBytes} bytes`)
    
    _isFirst = false;

    const numOfPackets = Math.floor(numOfBytes / bytesInPacket);

    for (let i=0; i < numOfPackets; i++) {
      const startIndex = i * bytesInPacket;
      const endIndex = startIndex + bytesInPacket - 1;
      const packet = chunkArr.slice(startIndex, endIndex);

      const id = getPacketId(packet, reject);
      _packetIDs.add(id);
    }

    // any left over bytes set to remainerCache for next buffer chunk
    const remainder = numOfBytes % bytesInPacket;
    _remainderChunks = chunkArr.slice(remainder * -1)
  }
}

function preocessEnd(resolve: (value: number[] | PromiseLike<number[]>) => void): () => void {
  return () => {
    const values: number[] = Array.from(_packetIDs).sort((a, b ) => a-b).slice(0,20);
    resolve(values);
  }
}

function getPacketId(packet: number[], reject: (reason?: any) => void): number {
  const id1 = packet[1].toString(2).padStart(8, '0').substring(8 - 5)
  const id2 = packet[2].toString(2).padStart(8, '0')
  
  const id = parseInt(`${id1}${id2}`, 2);

  return id;
}
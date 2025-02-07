const SYNC_BYTE = 71 //  0x47

// cache as we process the stream
let _isFirst: boolean; // keep track of first packet - may not have "sync byte"
let _remainderChunks: number[]; // cache for unprocessed buffer chunks
let _packetIDs: Set<string> // cache for packet IDs
let _packetCount: number; // TODO: determin if output is zero indexed or not

/**
 * 
 * @param stream 
 * @param bytesInPacket 
 * @returns Promise
 * 
 * generic module for obtaining packet Ids for a MPEG readableStream
 */
export default function processMpegIDs(
  stream: NodeJS.ReadableStream, 
  bytesInPacket: number
): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    // initialise processing cache
    _isFirst = true
    _remainderChunks = [];
    _packetIDs =  new Set<string>();
    _packetCount = 0;

  // handele stream events
    stream.on('data', processPacketsInData(bytesInPacket, reject));
    stream.on('end', preocessEnd(resolve))
  });
}

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

    const numOfPackets = Math.floor(numOfBytes / bytesInPacket);

    for (let i=0; i < numOfPackets; i++) {
      const startIndex = i * bytesInPacket;
      const endIndex = startIndex + bytesInPacket - 1;
      const packet = chunkArr.slice(startIndex, endIndex);

      const id = getPacketId(packet, bytesInPacket, _isFirst, reject);
      if (id) _packetIDs.add(id);
      _packetCount++;

      if (_isFirst) _isFirst = false;
    }

    // any left over bytes set to remainerCache for next buffer chunk
    const remainder = numOfBytes % bytesInPacket;
    _remainderChunks = chunkArr.slice(remainder * -1)
  }
}

function preocessEnd(resolve: (value: string[] | PromiseLike<string[]>) => void): () => void {
  return () => {
    const values: string[] = Array.from(_packetIDs).sort((a, b ) => parseInt(a, 16) - parseInt(b, 16))
    resolve(values);
  }
}

function getPacketId(packet: number[], packetSize: number, isFirst: boolean, reject: (reason?: any) => void): string | void {
  let isFirstWithoutSyncByte = false;

  const hasSyncByte = packet[0] === SYNC_BYTE;

  if (isFirst && !hasSyncByte) {
    isFirstWithoutSyncByte =  true;
  }
  if (!isFirst && !hasSyncByte) {
    return reject(new Error(`No sync byte present in packet ${_packetCount}, offset ${_packetCount * packetSize}`))
  }

  /**
   * TODO: confirm assumption
   * 
   * if First and has no syncByte then id is first & second bytes
   */
  const id1 = packet[isFirstWithoutSyncByte ? 0 : 1].toString(2).padStart(8, '0').substring(8 - 5)
  const id2 = packet[isFirstWithoutSyncByte ? 1: 2].toString(2).padStart(8, '0')
  
  const id = parseInt(`${id1}${id2}`, 2);

  return `0x${id.toString(16)}`;
}
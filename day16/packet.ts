type BitArray = Array<0 | 1>;

export const hexToBitArray = (hex: string): BitArray => {
  let int = parseInt(hex, 16);
  const result: BitArray = [];
  while (int > 0) {
    result.unshift((int % 2) as 0 | 1);
    int = int >> 1;
  }
  return result;
};

export const toBitArray = (bitString: string) =>
  [...bitString].map((char) => {
    if (char === "1") return 1;
    if (char === "0") return 0;
    throw new Error("non-bit character in bit string");
  });

export const toInt = (bits: BitArray): number => {
  return bits
    .map((bit, power) => bit * 2 ** (bits.length - power - 1))
    .reduce((acc, curr) => acc + curr, 0);
};

export const parseLiteralValuePacket = (packet: string) => {
  if (packet.length < 11 && packet.length % 5 !== 6)
    throw new Error("Type 4 packet with unexpected length");
  if (packet.slice(3, 6) !== "100") throw new Error("Type ID is not 4");
  const bits = toBitArray(packet);
  let lastBitGroup = false;
  let pointer = 6; // first non-header bit position
  const literalValueBits: BitArray = [];
  while (!lastBitGroup) {
    lastBitGroup = bits[pointer] === 0;
    literalValueBits.push(bits[pointer + 1]);
    literalValueBits.push(bits[pointer + 2]);
    literalValueBits.push(bits[pointer + 3]);
    literalValueBits.push(bits[pointer + 4]);
    pointer += 5;
  }
  return {
    version: toInt(toBitArray(packet.slice(0, 3))),
    value: toInt(literalValueBits),
  };
};

export const parseOperatorPacket = (bits: BitArray) => {
  // TODO
};

export const solvePart1 = (filePath: string): number => {
  // TODO
  return 0;
};

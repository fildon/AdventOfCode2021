import { getInputStrings } from "../utils/inputparsing.ts";

type BitArray = Array<0 | 1>;

export const hexToBitArray = (hex: string): BitArray => {
  return [...hex].flatMap(
    (char) =>
      ({
        0: [0, 0, 0, 0],
        1: [0, 0, 0, 1],
        2: [0, 0, 1, 0],
        3: [0, 0, 1, 1],
        4: [0, 1, 0, 0],
        5: [0, 1, 0, 1],
        6: [0, 1, 1, 0],
        7: [0, 1, 1, 1],
        8: [1, 0, 0, 0],
        9: [1, 0, 0, 1],
        A: [1, 0, 1, 0],
        B: [1, 0, 1, 1],
        C: [1, 1, 0, 0],
        D: [1, 1, 0, 1],
        E: [1, 1, 1, 0],
        F: [1, 1, 1, 1],
      }[char] as BitArray)
  );
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

type LiteralValuePacket = {
  typeID: 4;
  version: number;
  value: number;
};

type OperatorPacket = {
  typeID: 0 | 1 | 2 | 3 | 5 | 6 | 7;
  version: number;
  children: Array<Packet>;
};

type Packet = LiteralValuePacket | OperatorPacket;

export const parseLiteralValuePacket = (
  transmission: string,
  startingPointer = 0
): {
  packet: LiteralValuePacket;
  pointer: number;
} => {
  const packet = transmission.slice(startingPointer);
  if (packet.slice(3, 6) !== "100") throw new Error("Type ID is not 4");
  const bits = toBitArray(packet);
  let lastBitGroup = false;
  let relativePointer = 6; // first non-header bit position
  const literalValueBits: BitArray = [];
  while (!lastBitGroup) {
    lastBitGroup = bits[relativePointer] === 0;
    literalValueBits.push(bits[relativePointer + 1]);
    literalValueBits.push(bits[relativePointer + 2]);
    literalValueBits.push(bits[relativePointer + 3]);
    literalValueBits.push(bits[relativePointer + 4]);
    relativePointer += 5;
  }
  return {
    packet: {
      typeID: 4,
      version: toInt(toBitArray(packet.slice(0, 3))),
      value: toInt(literalValueBits),
    },
    pointer: startingPointer + relativePointer,
  };
};

export const parseOperatorPacket = (
  transmission: string,
  startingPointer = 0
): { packet: OperatorPacket; pointer: number } => {
  const packet = transmission.slice(startingPointer);
  const bits = toBitArray(packet);

  const lengthType = bits[6] === 0 ? "bits" : "packets";

  const endOfLengthInfo = lengthType === "bits" ? 22 : 18;

  const length = toInt(bits.slice(7, endOfLengthInfo));

  let relativePointer = endOfLengthInfo;
  const children: Array<Packet> = [];

  while (
    (lengthType === "bits"
      ? relativePointer - endOfLengthInfo // bits consumed so far
      : children.length) < length // subpackets consumed so far
  ) {
    const { packet: child, pointer: newPointer } = parsePacket(
      transmission,
      startingPointer + relativePointer
    );
    children.push(child);
    relativePointer = newPointer - startingPointer;
  }

  return {
    packet: {
      typeID: toInt(
        toBitArray(transmission.slice(startingPointer + 3, startingPointer + 6))
      ) as 0 | 1 | 2 | 3 | 5 | 6 | 7,
      version: toInt(bits.slice(0, 3)),
      children,
    },
    pointer: startingPointer + relativePointer,
  };
};

export const parsePacket = (
  transmission: string,
  startingPointer = 0
): { packet: Packet; pointer: number } => {
  const type = toInt(
    toBitArray(transmission.slice(startingPointer + 3, startingPointer + 6))
  );

  if (type === 4) return parseLiteralValuePacket(transmission, startingPointer);
  return parseOperatorPacket(transmission, startingPointer);
};

const countVersion = (packet: Packet): number => {
  if (packet.typeID === 4) return packet.version;
  return (
    packet.version +
    packet.children
      .map((child) => countVersion(child))
      .reduce((acc, curr) => acc + curr, 0)
  );
};

export const solvePart1 = (filePath: string): number => {
  const hex = getInputStrings(filePath)[0];
  const packetTree = parsePacket(hexToBitArray(hex).join("")).packet;
  return countVersion(packetTree);
};

const evaluatePacket = (packet: Packet): number => {
  // sum
  if (packet.typeID === 0)
    return packet.children
      .map((child) => evaluatePacket(child))
      .reduce((acc, curr) => acc + curr, 0);
  // product
  if (packet.typeID === 1)
    return packet.children
      .map((child) => evaluatePacket(child))
      .reduce((acc, curr) => acc * curr, 1);
  // minimum
  if (packet.typeID === 2)
    return packet.children
      .map((child) => evaluatePacket(child))
      .reduce((acc, curr) => Math.min(acc, curr));
  // maximum
  if (packet.typeID === 3)
    return packet.children
      .map((child) => evaluatePacket(child))
      .reduce((acc, curr) => Math.max(acc, curr));
  // literal value
  if (packet.typeID === 4) return packet.value;
  // greater than
  if (packet.typeID === 5)
    return evaluatePacket(packet.children[0]) >
      evaluatePacket(packet.children[1])
      ? 1
      : 0;
  // less than
  if (packet.typeID === 6)
    return evaluatePacket(packet.children[0]) <
      evaluatePacket(packet.children[1])
      ? 1
      : 0;
  // equal to
  if (packet.typeID === 7)
    return evaluatePacket(packet.children[0]) ===
      evaluatePacket(packet.children[1])
      ? 1
      : 0;
  throw new Error("lol get a better switch syntax");
};

export const solvePart2Hex = (hex: string): number => {
  const packetTree = parsePacket(hexToBitArray(hex).join("")).packet;
  return evaluatePacket(packetTree);
};

export const solvePart2 = (filePath: string): number => {
  return solvePart2Hex(getInputStrings(filePath)[0]);
};

import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  hexToBitArray,
  parseLiteralValuePacket,
  parseOperatorPacket,
  parsePacket,
  solvePart1,
  solvePart2,
  solvePart2Hex,
  toBitArray,
  toInt,
} from "./packet.ts";

Deno.test("day16/converts hex to binary", () => {
  assertEquals(
    hexToBitArray("D2FE28"),
    [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0],
  );
  assertEquals(
    hexToBitArray("8A004A801A8002F478"),
    [
      1,
      0,
      0,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
    ],
  );
});

Deno.test("day16/to bit array", () => {
  assertEquals(toBitArray(""), []);
  assertEquals(toBitArray("0"), [0]);
  assertEquals(toBitArray("1"), [1]);
  assertEquals(toBitArray("10"), [1, 0]);
  assertEquals(toBitArray("11"), [1, 1]);
  assertEquals(toBitArray("011"), [0, 1, 1]);
  assertThrows(() => toBitArray("not a bit string"));
});

Deno.test("day16/bitArray to integer", () => {
  assertEquals(toInt([]), 0);
  assertEquals(toInt([0]), 0);
  assertEquals(toInt([1]), 1);
  assertEquals(toInt([0, 0]), 0);
  assertEquals(toInt([0, 1]), 1);
  assertEquals(toInt([1, 0]), 2);
  assertEquals(toInt([1, 1]), 3);
});

Deno.test("day16/parses literal value packet", () => {
  // These packets do not have type 4
  assertThrows(() => parseLiteralValuePacket("00000000000"));
  assertThrows(() => parseLiteralValuePacket("00000100000"));
  assertThrows(() => parseLiteralValuePacket("00001000000"));
  assertThrows(() => parseLiteralValuePacket("00001100000"));
  assertThrows(() => parseLiteralValuePacket("00010100000"));
  assertThrows(() => parseLiteralValuePacket("00011000000"));
  assertThrows(() => parseLiteralValuePacket("00011100000"));
  // Shortest valid input
  assertEquals(parseLiteralValuePacket("00010001000"), {
    packet: {
      typeID: 4,
      version: 0,
      value: 8,
    },
    pointer: 11,
  });
  // Example from puzzle text
  assertEquals(parseLiteralValuePacket("110100101111111000101000"), {
    packet: {
      typeID: 4,
      version: 6,
      value: 2021,
    },
    pointer: 21,
  });
});

Deno.test({
  name: "day16/parses operator packet",
  fn: () => {
    assertEquals(
      parseOperatorPacket(
        "00111000000000000110111101000101001010010001001000000000",
      ),
      {
        packet: {
          typeID: 6,
          version: 1,
          children: [
            {
              typeID: 4,
              version: 6,
              value: 10,
            },
            { typeID: 4, version: 2, value: 20 },
          ],
        },
        pointer: 49,
      },
    );
    assertEquals(parsePacket(hexToBitArray("8A004A801A8002F478").join("")), {
      packet: {
        typeID: 2,
        version: 4,
        children: [
          {
            typeID: 2,
            version: 1,
            children: [
              {
                typeID: 2,
                version: 5,
                children: [
                  {
                    typeID: 4,
                    version: 6,
                    value: 15,
                  },
                ],
              },
            ],
          },
        ],
      },
      pointer: 69,
    });
    assertEquals(
      parsePacket(hexToBitArray("620080001611562C8802118E34").join("")),
      {
        packet: {
          typeID: 0,
          version: 3,
          children: [
            {
              typeID: 0,
              version: 0,
              children: [
                {
                  typeID: 4,
                  version: 0,
                  value: 10,
                },
                {
                  typeID: 4,
                  version: 5,
                  value: 11,
                },
              ],
            },
            {
              typeID: 0,
              version: 1,
              children: [
                {
                  typeID: 4,
                  version: 0,
                  value: 12,
                },
                {
                  typeID: 4,
                  version: 3,
                  value: 13,
                },
              ],
            },
          ],
        },
        pointer: 102,
      },
    );
    assertEquals(
      parsePacket(hexToBitArray("C0015000016115A2E0802F182340").join("")),
      {
        packet: {
          typeID: 0,
          version: 6,
          children: [
            {
              typeID: 0,
              version: 0,
              children: [
                {
                  typeID: 4,
                  value: 10,
                  version: 0,
                },
                {
                  typeID: 4,
                  value: 11,
                  version: 6,
                },
              ],
            },
            {
              typeID: 0,
              version: 4,
              children: [
                {
                  typeID: 4,
                  value: 12,
                  version: 7,
                },
                {
                  typeID: 4,
                  value: 13,
                  version: 0,
                },
              ],
            },
          ],
        },
        pointer: 106,
      },
    );
    assertEquals(
      parsePacket(hexToBitArray("A0016C880162017C3686B18A3D4780").join("")),
      {
        packet: {
          typeID: 0,
          version: 5,
          children: [
            {
              typeID: 0,
              version: 1,
              children: [
                {
                  typeID: 0,
                  version: 3,
                  children: [
                    {
                      typeID: 4,
                      value: 6,
                      version: 7,
                    },
                    {
                      typeID: 4,
                      value: 6,
                      version: 6,
                    },
                    {
                      typeID: 4,
                      value: 12,
                      version: 5,
                    },
                    {
                      typeID: 4,
                      value: 15,
                      version: 2,
                    },
                    {
                      typeID: 4,
                      value: 15,
                      version: 2,
                    },
                  ],
                },
              ],
            },
          ],
        },
        pointer: 113,
      },
    );
  },
});

Deno.test({
  name: "day16/solves part 1",
  fn: () => {
    assertEquals(solvePart1("day16/testinput1.txt"), 16);
    assertEquals(solvePart1("day16/testinput2.txt"), 12);
    assertEquals(solvePart1("day16/testinput3.txt"), 23);
    assertEquals(solvePart1("day16/testinput4.txt"), 31);
    assertEquals(solvePart1("day16/input.txt"), 977);
  },
});

Deno.test({
  name: "day16/solves part 2",
  fn: () => {
    assertEquals(solvePart2Hex("C200B40A82"), 3);
    assertEquals(solvePart2Hex("04005AC33890"), 54);
    assertEquals(solvePart2Hex("880086C3E88112"), 7);
    assertEquals(solvePart2Hex("CE00C43D881120"), 9);
    assertEquals(solvePart2Hex("D8005AC2A8F0"), 1);
    assertEquals(solvePart2Hex("F600BC2D8F"), 0);
    assertEquals(solvePart2Hex("9C005AC2F8F0"), 0);
    assertEquals(solvePart2Hex("9C0141080250320F1802104A08"), 1);
    assertEquals(solvePart2("day16/input.txt"), 101501020883);
  },
});

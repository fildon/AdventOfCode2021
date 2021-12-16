import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.117.0/testing/asserts.ts";
import {
  hexToBitArray,
  toBitArray,
  toInt,
  parseLiteralValuePacket,
  parseOperatorPacket,
  solvePart1,
} from "./packet.ts";

Deno.test("day16/converts hex to binary", () => {
  assertEquals(
    hexToBitArray("D2FE28"),
    [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0]
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

Deno.test("day16/parses packet type 4", () => {
  // These packets do not have a valid length
  assertThrows(() => parseLiteralValuePacket(""));
  assertThrows(() => parseLiteralValuePacket("0"));
  assertThrows(() => parseLiteralValuePacket("00"));
  assertThrows(() => parseLiteralValuePacket("000"));
  assertThrows(() => parseLiteralValuePacket("0001"));
  assertThrows(() => parseLiteralValuePacket("00010"));
  assertThrows(() => parseLiteralValuePacket("000100"));
  assertThrows(() => parseLiteralValuePacket("0001000"));
  assertThrows(() => parseLiteralValuePacket("00010000"));
  assertThrows(() => parseLiteralValuePacket("000100000"));
  assertThrows(() => parseLiteralValuePacket("0001000000"));
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
    version: 0,
    value: 8,
  });
  // Example from puzzle text
  assertEquals(parseLiteralValuePacket("110100101111111000101000"), {
    version: 6,
    value: 2021,
  });
});

Deno.test({
  name: "day16/parses operator packet",
  ignore: true, // TODO
  fn: () => {
    // TODO
    assertEquals(
      parseOperatorPacket(
        toBitArray("00111000000000000110111101000101001010010001001000000000")
      ),
      0
    );
  },
});

Deno.test({
  name: "day16/solves part 1",
  ignore: true, // TODO
  fn: () => {
    assertEquals(solvePart1("day16/testinput1.txt"), 16);
    assertEquals(solvePart1("day16/testinput2.txt"), 12);
    assertEquals(solvePart1("day16/testinput3.txt"), 23);
    assertEquals(solvePart1("day16/testinput4.txt"), 31);
  },
});

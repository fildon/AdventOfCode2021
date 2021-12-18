import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { findMiddle, parseToTree } from "./snailfish.ts";

Deno.test("day18/finds middle comma", () => {
  assertEquals(findMiddle("[1,2]"), 2);
  assertEquals(findMiddle("[[1,2],3]"), 6);
  assertEquals(findMiddle("[9,[8,7]]"), 2);
  assertEquals(findMiddle("[[1,9],[8,5]]"), 6);
});

Deno.test("day18/parse from string", () => {
  assertEquals(parseToTree("[1,2]"), {
    left: {
      value: 1,
    },
    right: {
      value: 2,
    },
  });
  assertEquals(parseToTree("[[1,9],[8,5]]"), {
    left: {
      left: {
        value: 1,
      },
      right: { value: 9 },
    },
    right: {
      left: { value: 8 },
      right: { value: 5 },
    },
  });
});

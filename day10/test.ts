import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

import {
  getMedianValue,
  parseInputLine,
  part1GetScore,
  part2GetScoreOfLine,
} from "./bracketParsing.ts";

Deno.test("day10/part1 - getScore", () => {
  assertEquals(part1GetScore([]), 0);
  assertEquals(part1GetScore(["}", ")", "]", ")", ">"]), 26397);
});

Deno.test("day10/part2 - parseInputLine - invalid cases", () => {
  assertEquals(parseInputLine("{([(<{}[<>[]}>{[]{[(<()>"), {
    valid: false,
    illegalSymbol: "}",
  });
  assertEquals(parseInputLine("[[<[([]))<([[{}[[()]]]"), {
    valid: false,
    illegalSymbol: ")",
  });
  assertEquals(parseInputLine("[{[{({}]{}}([{[{{{}}([]"), {
    valid: false,
    illegalSymbol: "]",
  });
  assertEquals(parseInputLine("[<(<(<(<{}))><([]([]()"), {
    valid: false,
    illegalSymbol: ")",
  });
  assertEquals(parseInputLine("<{([([[(<>()){}]>(<<{{"), {
    valid: false,
    illegalSymbol: ">",
  });
});

Deno.test("day10/part2 - parseInputLine - valid cases", () => {
  assertEquals(parseInputLine("[({(<(())[]>[[{[]{<()<>>"), {
    valid: true,
    completionSequence: [..."}}]])})]"],
  });
  assertEquals(parseInputLine("[(()[<>])]({[<{<<[]>>("), {
    valid: true,
    completionSequence: [...")}>]})"],
  });
  assertEquals(parseInputLine("(((({<>}<{<{<>}{[]{[]{}"), {
    valid: true,
    completionSequence: [..."}}>}>))))"],
  });
  assertEquals(parseInputLine("{<[[]]>}<{[{[{[]{()[[[]"), {
    valid: true,
    completionSequence: [..."]]}}]}]}>"],
  });
  assertEquals(parseInputLine("<{([{{}}[<[[[<>{}]]]>[]]"), {
    valid: true,
    completionSequence: [..."])}>"],
  });
});

Deno.test("day10/part2 - part2GetScoreOfLine", () => {
  assertEquals(
    part2GetScoreOfLine(["}", "}", "]", "]", ")", "}", ")", "]"]),
    288957,
  );
  assertEquals(part2GetScoreOfLine([")", "}", ">", "]", "}", ")"]), 5566);
  assertEquals(
    part2GetScoreOfLine(["}", "}", ">", "}", ">", ")", ")", ")", ")"]),
    1480781,
  );
  assertEquals(
    part2GetScoreOfLine(["]", "]", "}", "}", "]", "}", "]", "}", ">"]),
    995444,
  );
  assertEquals(part2GetScoreOfLine(["]", ")", "}", ">"]), 294);
});

Deno.test("day10/part2 - getMedianValue", () => {
  assertEquals(getMedianValue([288957, 5566, 1480781, 995444, 294]), 288957);
});

# Advent of Code 2021

This repository contains my solutions to the puzzles in
[Advent of Code 2021](https://adventofcode.com/2021)

## Prerequisites

- [Deno](https://deno.land/)

Additionally I recommend using the
[Deno VSCode extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
to provide intellisense, particularly when it comes to import paths with
explicit file extensions.

## Executing solutions

Each day has a folder, and each part is a file. To execute a solution run that
file with deno. Additionally the `--allow-read` flag must be passed to allow the
Deno runtime to read puzzle input files.

```shell
deno run --allow-read day01/part1.ts
```

Starting from day12 however solutions are not logged out, instead you should
inspect the corresponding test file to see the solution in a test assertion.

## Testing

Tests are written using Deno's in-built test runner and assertions. You can run
all tests with:

```shell
npm t
```

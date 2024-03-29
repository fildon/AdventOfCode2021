# Advent of Code 2021

This repository contains my solutions to the puzzles in
[Advent of Code 2021](https://adventofcode.com/2021)

## Prerequisites

- [Deno](https://deno.land/)

This repo was written using version 1.16.3. 

Later versions might also work, but have not been tested.

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

Or if you like to run them in watch mode:

```shell
npm t -- --watch
```

Or if you want to run just one day's tests:

```shell
npm t -- day23
```

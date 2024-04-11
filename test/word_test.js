const test = require("node:test");
const { deepEqual } = require("node:assert");

const { tokenize } = require("../");

test("tokenizing letters", () => {
  const words = tokenize("a b c");
  deepEqual(
    ["a", "b", "c"],
    words.map((w) => w.lexeme),
  );
});

test("tokenizing words", () => {
  const words = tokenize("one two three");
  deepEqual(
    ["one", "two", "three"],
    words.map((w) => w.lexeme),
  );
});

test("tokenizing sentences with punctuation", () => {
  const words = tokenize(`
    Lorem ipsum, dolor sit amet.
    Lorem ipsum, dolor sit amet.
  `);
  deepEqual(
    [
      "Lorem",
      "ipsum",
      "dolor",
      "sit",
      "amet",
      "Lorem",
      "ipsum",
      "dolor",
      "sit",
      "amet",
    ],
    words.map((w) => w.lexeme),
  );
});

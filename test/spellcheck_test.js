const test = require("node:test");
const { equal } = require("node:assert");

const { Dictionary } = require("../lib/dictionary");
const { spellcheckContent } = require("../lib/spellcheck");

test("happy path", () => {
  const dict = new Dictionary(["one", "two", "three", "five", "six"]);
  const misspelledWords = spellcheckContent(
    dict,
    `
    one two three
    one two three four
    one two three four five
    one two three four five six
    `,
    "<test>",
  );

  equal(3, misspelledWords.length);

  equal("four", misspelledWords[0].word.lexeme);
  equal(37, misspelledWords[0].word.offset);
  equal(3, misspelledWords[0].span.lineNumber);
  equal(19, misspelledWords[0].span.columnNumber);

  equal("four", misspelledWords[1].word.lexeme);
  equal(60, misspelledWords[1].word.offset);
  equal(4, misspelledWords[1].span.lineNumber);
  equal(19, misspelledWords[1].span.columnNumber);

  equal("four", misspelledWords[2].word.lexeme);
  equal(88, misspelledWords[2].word.offset);
  equal(5, misspelledWords[2].span.lineNumber);
  equal(19, misspelledWords[2].span.columnNumber);
});

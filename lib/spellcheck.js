const { readFile } = require("node:fs/promises");
const { EOL } = require("node:os");

const { tokenize } = require("./word");
const { Dictionary } = require("./dictionary");
const { Span } = require("./span");

class MisspelledWord {
  /**
   * @param {Word} word
   * @param {Array<String>} suggestions
   * @param {Span} span
   */
  constructor(word, suggestions, span) {
    this.word = word;
    this.suggestions = suggestions;
    this.span = span;
  }

  toString() {
    return `    ${this.span.lineNumber}:${this.span.columnNumber} "${
      this.word.lexeme
    }", suggestions: ${this.suggestions.slice(0, 10).join(", ")}

${this.span.showLines()}

`;
  }
}

/**
 * @param {Dictionary} dictionary
 * @param {String} content
 * @return {Array<MisspelledWord>}
 */
function spellcheckContent(dictionary, content, path) {
  const words = tokenize(content);
  const misspelledWords = [];
  for (const word of words) {
    if (word.skipSpellcheck()) {
      continue;
    } else if (dictionary.isMisspelled(word)) {
      misspelledWords.push(
        new MisspelledWord(
          word,
          dictionary.getSuggestions(word),
          new Span(word, content, path),
        ),
      );
    }
  }
  return misspelledWords;
}

/**
 * @param {String} dictionaryPath
 * @param {Array<String>} inputPaths
 */
async function spellcheckFiles(dictionaryPath, inputPaths) {
  const [dictionaryData, ...inputData] = await Promise.all(
    [dictionaryPath, ...inputPaths].map((path) =>
      readFile(path, { encoding: "utf-8" }),
    ),
  );

  const dictionaryWords = dictionaryData.split(EOL);
  const dictionary = new Dictionary(dictionaryWords);
  const inputs = inputPaths.reduce(
    (acc, path, i) => ({ ...acc, [path]: inputData[i] }),
    {},
  );

  for (const inputPath in inputs) {
    process.stdout.write(`Checking ${inputPath}`);
    const misspelledWords = spellcheckContent(
      dictionary,
      inputs[inputPath],
      inputPath,
    );

    if (misspelledWords.length) {
      console.log(`, found ${misspelledWords.length} error(s)\n`);
      for (const misspelledWord of misspelledWords) {
        console.log(misspelledWord.toString());
      }
    } else {
      console.log(`, no errors found`);
    }
  }
}

exports.spellcheckFiles = spellcheckFiles;

const { spellcheckFiles } = require("./lib/spellcheck");
const { Dictionary } = require("./lib/dictionary");
const { WordTrie } = require("./lib/trie");
const { Word, tokenize } = require("./lib/word");

module.exports = {
  Dictionary,
  Word,
  WordTrie,
  spellcheckFiles,
  tokenize,
};

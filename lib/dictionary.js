const { EOL } = require("node:os");
const { WordTrie } = require("./trie");

class Dictionary {
  /**
   * @param {String | Array<String>} knownWords
   */
  constructor(knownWords) {
    this.trie = new WordTrie();
    knownWords =
      typeof knownWords === "string" ? knownWords.split(EOL) : knownWords;
    knownWords.forEach((word) => this.trie.add(word));
  }

  /**
   * @param {Word} word
   * @return {Boolean}
   */
  isMisspelled(word) {
    return !this.trie.contains(word.normalizedLexeme);
  }

  /**
   * @param {String} word
   * @return {Array<String>}
   */
  getSuggestions(word) {
    const suggestions = new Set();
    this.trie
      .neighbors(word.normalizedLexeme)
      .forEach((neighbor) =>
        neighbor.allWords().forEach((word) => suggestions.add(word)),
      );

    return Array.from(suggestions);
  }
}

exports.Dictionary = Dictionary;

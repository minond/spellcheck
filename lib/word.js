class Word {
  /**
   * @param {String} lexeme
   * @param {Array<String>} suggestions
   * @param {Number} offset
   */
  constructor(lexeme, offset) {
    this.lexeme = lexeme;
    this.chars = lexeme.split("");
    this.normalizedLexeme = lexeme
      .toLowerCase()
      .replace(/n't$/, "") // don't, couldn't, etc.
      .replace(/'ve$/, "") // we've
      .replace(/'s$/, "") // possessive
      .replace(/'$/, "") // possessive
      .replace(/[^A-Za-z]+/g, "");
    this.offset = offset;
  }

  /**
   * @return {Boolean}
   */
  skipSpellcheck() {
    return (
      this.isEmpty() ||
      this.isArticle() ||
      this.isAcronym() ||
      this.isEmail() ||
      this.isFile() ||
      this.isProperNoun()
    );
  }

  /**
   * @return {Boolean}
   */
  isEmpty() {
    return !this.normalizedLexeme;
  }

  /**
   * @return {Boolean}
   */
  isProperNoun() {
    return (this.lexeme[0] || "").toUpperCase() == this.lexeme[0];
  }

  /**
   * @return {Boolean}
   */
  isAcronym() {
    return this.chars.reduce((result, char) => {
      return result && char.toUpperCase() == char;
    }, true);
  }

  /**
   * @return {Boolean}
   */
  isArticle() {
    return ["the", "an", "a"].includes(this.normalizedLexeme);
  }

  /**
   * @return {Boolean}
   */
  isEmail() {
    return this.lexeme.includes("@") && this.lexeme.includes(".");
  }

  /**
   * @return {Boolean}
   */
  isFile() {
    return this.lexeme.includes(".");
  }
}

/**
 * @param {String} content
 * @return {Array<Word>}
 */
function tokenize(content) {
  const whitespace = /\s/;
  const isWhitespace = (char) => whitespace.test(char);
  const isSeparator = (char) => [":", "-", "/", "#"].includes(char);
  const isParen = (char) => ["(", ")", "[", "]", "{", "}"].includes(char);
  const isNonAlphaNumeric = (char) =>
    ["@", "-", ",", ".", "`", ":"].includes(char);
  const isPunctuation = (char) => [",", ".", ";"].includes(char);
  const isQuotation = (char) => ["`", '"'].includes(char);

  const words = [];
  for (let i = 0, len = content.length; i < len; i++) {
    const char = content[i];
    if (
      isWhitespace(char) ||
      isNonAlphaNumeric(char) ||
      isPunctuation(char) ||
      isQuotation(char) ||
      isParen(char)
    ) {
      continue;
    }

    let lexeme = char;
    for (let j = i + 1; j < len; j++) {
      let tail = content[j];
      if (
        !tail ||
        isWhitespace(tail) ||
        isSeparator(tail) ||
        isQuotation(tail) ||
        isPunctuation(tail) ||
        isParen(tail)
      ) {
        break;
      } else {
        lexeme += tail;
      }
    }

    words.push(new Word(lexeme, i));
    i += lexeme.length;
  }

  return words;
}

module.exports = { Word, tokenize };

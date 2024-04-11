const { EOL } = require("node:os");

class Span {
  /**
   * @param {Word} word
   * @param {String} content
   * @param {String} path
   */
  constructor(word, content, path) {
    this.word = word;
    this.path = path;
    this.previousLine = "";
    this.line = "";
    this.nextLine = "";
    this.lineNumber = null;
    this.columnNumber = null;

    const lines = content.split(EOL);
    let offset = 0;
    for (let i = 0, len = lines.length; i < len; i++) {
      const line = lines[i];
      if (offset + line.length + 1 >= this.word.offset) {
        this.previousLine = lines[i - 1] || "";
        this.line = line;
        this.nextLine = lines[i + 1] || "";
        this.lineNumber = i + 1;
        this.columnNumber = this.word.offset - offset + 1;
        break;
      }
      offset += line.length + 1;
    }
  }

  /**
   * @return {String}
   */
  highlightWord() {
    return (
      this.line.slice(0, this.columnNumber - 1) +
      "\x1b[4m" +
      "\x1b[1m" +
      "\x1b[31m" +
      this.line.slice(
        this.columnNumber - 1,
        this.columnNumber + this.word.lexeme.length - 1,
      ) +
      "\x1b[0m" +
      this.line.slice(this.columnNumber + this.word.lexeme.length - 1)
    );
  }

  /**
   * @return {String}
   */
  showLines() {
    const padding = 3;
    const lines = [];
    if (this.previousLine) {
      const number = (this.lineNumber - 1).toString().padEnd(padding, " ");
      lines.push(`        ${number} | ${this.previousLine}`);
    }
    const number = this.lineNumber.toString().padEnd(padding, " ");
    lines.push(`        ${number} | ${this.highlightWord()}`);
    if (this.nextLine) {
      const number = (this.lineNumber + 1).toString().padEnd(padding, " ");
      lines.push(`        ${number} | ${this.nextLine}`);
    }
    return lines.join("\n");
  }
}

exports.Span = Span;

class WordTrie {
  constructor() {
    this.roots = [...Array(26).keys()]
      .map((offset) => 97 + offset)
      .map(
        (code) => new Node(String.fromCharCode(code), null, [], false, null),
      );
  }

  /**
   * @param {String} word
   */
  add(word) {
    if (!word) {
      return;
    }

    const letters = word.split("");
    let node = this.root(word);
    for (let i = 1, len = letters.length; i < len; i++) {
      node = node.next(letters[i], i + 1 === len, word);
    }
  }

  /**
   * @param {String} word
   * @param {Boolean} whole, match whole word
   * @return {Boolean}
   */
  contains(word, whole = true) {
    const letters = word.split("");
    let node = this.root(word);
    for (let i = 1, len = letters.length; i < len; i++) {
      let next = node.child(letters[i]);
      if (!next) {
        return false;
      }
      node = next;
    }
    return whole ? node.isTerminal() : !!node;
  }

  /**
   * @param {String} word
   * @return {Array<Node>}
   */
  neighbors(word) {
    const letters = word.split("");
    let node = this.root(word);
    for (let i = 1, len = letters.length; i < len; i++) {
      let next = node.child(letters[i]);
      if (!next) {
        if (node) {
          return [node].concat(node.children);
        } else {
          return node.children;
        }
      }
      node = next;
    }
    return [];
  }

  /**
   * @param {String} charOrWord
   * @return {Node}
   */
  root(charOrWord) {
    return this.roots[charOrWord[0].toLowerCase().charCodeAt(0) - 97];
  }
}

class Node {
  /**
   * @param {String} value
   * @param {Node | null} parent
   * @param {Array<Node>} children
   * @param {Boolean} isTerminal
   * @param {String} word
   */
  constructor(value, parent, children, isTerminal, word) {
    this.value = value;
    this.parent = parent;
    this.children = children;
    this._isTerminal = isTerminal;
    this.words = [];
    if (word && isTerminal) {
      this.words.push(word);
    }
  }

  /**
   * @return {Boolean}
   */
  isTerminal() {
    return this._isTerminal || !this.children.length;
  }

  /**
   * @param {String} value
   * @return {Node | null}
   */
  child(value) {
    return this.children.find((node) => node.value === value);
  }

  /**
   * @param {String} value
   * @param {Boolean} isTerminal
   * @param {String} word
   * @return {Node}
   */
  next(value, isTerminal, word) {
    let next = this.child(value);
    if (next) {
      if (isTerminal) {
        next._isTerminal = true;
        next.words.push(word);
      }
      return next;
    }

    next = new Node(value, this, [], isTerminal, word);
    this.children.push(next);
    return next;
  }

  /**
   * @return {Array<String>}
   */
  allWords() {
    return this.children.reduce(
      (acc, child) => [...acc, ...child.allWords()],
      [...this.words],
    );
  }
}

module.exports = { WordTrie };

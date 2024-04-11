const test = require("node:test");
const { ok } = require("node:assert");

const { WordTrie } = require("../");

test("words can be added and contained", () => {
  const trie = new WordTrie();
  trie.add("cat");
  trie.add("car");
  ok(trie.contains("cat"));
  ok(trie.contains("car"));
  ok(!trie.contains("cap"));
});

test("contained checks for whole words by default", () => {
  const trie = new WordTrie();
  trie.add("cats");
  ok(!trie.contains("cat"));
});

test("contained can find partial matches", () => {
  const trie = new WordTrie();
  trie.add("cats");
  ok(trie.contains("cat", false));
});

test("sibling neighbors are found", () => {
  const trie = new WordTrie();
  trie.add("cat");
  const neighbors = trie.neighbors("cap");
  const words = new Set(neighbors.flatMap((node) => node.allWords()));
  ok(words.has("cat"));
});

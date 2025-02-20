const chunk = require('lodash/chunk');
const { getSection } = require('./utils/get-section');
const mdastToHtml = require('./utils/mdast-to-html');

function plugin() {
  return transformer;

  function transformer(tree, file) {
    const hintNodes = getSection(tree, '--seed-verification--');
    if (hintNodes.length % 2 !== 0)
      throw Error('Verifiers must be in (text, ```testString```) order');

    const tests = chunk(hintNodes, 2).map(getTest);
    file.data.tests = tests;
  }
}

function getTest(hintNodes) {
  const [textNode, testStringNode] = hintNodes;
  const text = mdastToHtml([textNode]);
  const testString = testStringNode.value;

  if (!text) throw Error('text is missing from seed verifier');
  // stub tests (i.e. text, but no testString) are allowed, but the md must
  // have a code block, even if it is empty.
  if (!testString && testString !== '')
    throw Error('testString (code block) is missing from seed verifier');

  return { text, testString };
}

module.exports = plugin;

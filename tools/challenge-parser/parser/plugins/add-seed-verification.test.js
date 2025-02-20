const parseFixture = require('../__fixtures__/parse-fixture');
const addTests = require('./add-seed-verification');

describe('add-tests plugin', () => {
  let brokenHintsAST, simpleAST, missingTestStringAST;
  const plugin = addTests();
  let file = { data: {} };

  beforeAll(async () => {
    simpleAST = await parseFixture('simple.md');
    brokenHintsAST = await parseFixture('with-broken-seed-tests.md');
    missingTestStringAST = await parseFixture('with-missing-verifier.md');
  });

  beforeEach(() => {
    file = { data: {} };
  });

  it('returns a function', () => {
    expect(typeof plugin).toEqual('function');
  });

  it('adds a `tests` property to `file.data`', () => {
    plugin(simpleAST, file);

    expect('tests' in file.data).toBe(true);
  });

  it('adds test objects to the tests array following a schema', () => {
    expect.assertions(5);
    plugin(simpleAST, file);
    const testObject = file.data.tests[0];
    expect(Object.keys(testObject).length).toBe(2);
    expect(testObject).toHaveProperty('testString');
    expect(typeof testObject.testString).toBe('string');
    expect(testObject).toHaveProperty('text');
    expect(typeof testObject.text).toBe('string');
  });

  // TODO: make this a bit more robust and informative
  it('should throw if a test pair is out of order', () => {
    // TODO: update the markdown so it makes this error
    expect(() => plugin(brokenHintsAST, file)).toThrow(
      'Verifiers must be in (text, ```testString```) order'
    );
  });

  it('should throw if a verification string is not found', () => {
    expect(() => plugin(missingTestStringAST, file)).toThrow(
      'testString (code block) is missing from seed verifier'
    );
  });

  it('preserves code whitespace in testStrings', () => {
    plugin(simpleAST, file);
    const testObject = file.data.tests[2];
    expect(testObject.testString).toBe(`// more test code
if(let x of xs) {
  console.log(x);
}`);
  });

  it('does not encode html', () => {
    plugin(simpleAST, file);
    const testObject = file.data.tests[1];
    expect(testObject.text).toBe('<p>Second hint with <code>code</code></p>');
  });

  it('converts test text from md to html', () => {
    plugin(simpleAST, file);
    const testObject = file.data.tests[2];
    expect(testObject.text).toBe(
      '<p>Third <em>hint</em> with <code>code</code>' +
        ' and <code>inline code</code></p>'
    );
  });

  it('should have an output to match the snapshot', () => {
    plugin(simpleAST, file);
    expect(file.data).toMatchSnapshot();
  });
});

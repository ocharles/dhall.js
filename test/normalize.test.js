const fs = require('fs');
const path = require('path');

const parser = require('../lib/parser');
const normalize = require('../src/normalize.js');

function expectNormalize(exprA, exprB) {
  expect(normalize(parser.parse(exprA)))
    .toEqual(parser.parse(exprB));
}

function testNormalize(fileName) {
  test(fileName, done => {
    const filePathA = path.join(__dirname, `../dhall-haskell/tests/normalization/${fileName}A.dhall`);
    const filePathB = path.join(__dirname, `../dhall-haskell/tests/normalization/${fileName}B.dhall`);

    fs.readFile(filePathA, (errA, dataA) => {
      if (errA) throw errA;
      fs.readFile(filePathB, (errB, dataB) => {
        if (errB) throw errB;
        expectNormalize(dataA.toString(), dataB.toString());
        done();
      });
    });
  });
}

test('Simple let', () => {
  expectNormalize('let x : Bool = True in \\ ( y : Bool) -> x', '\\ ( y : Bool ) -> True');
});

test('Beta reduce (bound)', () => {
  expectNormalize('(\\(y : Bool) -> y) True', 'True');
});

test('Beta reduce (free)', () => {
  expectNormalize('(\\(y : Bool) -> x) True', 'x');
});

testNormalize('doubleShow');
testNormalize('naturalShow');
testNormalize('optionalBuildFold');
testNormalize('integerShow');
testNormalize('naturalToInteger');
testNormalize('optionalFold');
testNormalize('naturalPlus');
testNormalize('optionalBuild');
testNormalize('remoteSystems');

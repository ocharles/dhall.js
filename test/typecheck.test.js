const fs = require('fs');
const path = require('path');

const parser = require('../lib/parser');
const normalize = require('../src/normalize.js');


function testTypeChecks(fileName) {
  test.only(fileName, done => {
    const filePathA = path.join(__dirname, `../dhall-haskell/tests/typecheck/${fileName}A.dhall`);
    const filePathB = path.join(__dirname, `../dhall-haskell/tests/typecheck/${fileName}B.dhall`);

    fs.readFile(filePathA, (errA, dataA) => {
      if (errA) throw errA;
      fs.readFile(filePathB, (errB, dataB) => {
        if (errB) throw errB;
        const parsedExprA = parser.parse(dataA.toString());
        const parsedExprB = parser.parse(dataB.toString());
        console.log(dataA.toString());
        console.log(dataB.toString());
        console.log(JSON.stringify(parsedExprA));
        console.log(JSON.stringify(parsedExprB));

        done();
      });
    });
  });
}

testNormalize('alternativesAreTypes');
testNormalize('fieldsAreTypes');

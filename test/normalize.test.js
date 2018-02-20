var fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, 'start.html');

var parser = require('./parser.js'),
    normalize = require('./normalize.js');

function expectNormalize(exprA, exprB) {
    expect(normalize(parser.parse(exprA)))
        .toEqual(parser.parse(exprB));
    
}

function testNormalize(fileName) {
    test(fileName, done => {
        fs.readFile(
            path.join(__dirname, 'dhall-haskell/tests/normalization/' + fileName + 'A.dhall'),
            (err, dataA) => {
                if (err) throw err;
                fs.readFile(
                    path.join(__dirname, 'dhall-haskell/tests/normalization/' + fileName + 'B.dhall'),
                    (err, dataB) => {
                        if (err) throw err;

                        expectNormalize(dataA.toString(), dataB.toString());

                        done();
                    });
            });
    });
}

test('Simple let', () => {
    expectNormalize(
        'let x : Bool = True in \\ ( y : Bool) -> x', '\\ ( y : Bool ) -> True' 
    );
});

test('Beta reduce (bound)', () => {
    expectNormalize(
        '(\\(y : Bool) -> y) True', 'True' 
    );
});

test('Beta reduce (free)', () => {
    expectNormalize(
        '(\\(y : Bool) -> x) True', 'x' 
    );
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

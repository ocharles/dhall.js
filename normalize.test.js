var fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, 'start.html');

var parser = require('./parser.js'),
    normalize = require('./normalize.js');

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
                        expect(normalize(parser.parse(dataA.toString())))
                            .toBe(parser.parse(dataB.toString()));
                        done();
                    });
            });
    });
}

testNormalize('doubleShow');
testNormalize('naturalShow');
testNormalize('optionalBuildFold');
testNormalize('integerShow');
testNormalize('naturalToInteger');
testNormalize('optionalFold');
testNormalize('naturalPlus');
testNormalize('optionalBuild');
testNormalize('remoteSystems');

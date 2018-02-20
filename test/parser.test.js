const fs = require('fs');

const path = require('path');

const filePath = path.join(__dirname, 'start.html');


const parser = require('../lib/parser');

function testParser(fileName) {
    test(fileName, done => {
        fs.readFile(
            path.join(__dirname, `../dhall-haskell/tests/${fileName}.dhall`),
            (err, data) => {
                if (err) throw err;
                expect(parser.parse(data.toString())).toMatchSnapshot(fileName);
                done();
            }
        );
    });
}

testParser('normalization/doubleShowA');
testParser('normalization/doubleShowB');
testParser('normalization/integerShowA');
testParser('normalization/integerShowB');
testParser('normalization/naturalPlusA');
testParser('normalization/naturalPlusB');
testParser('normalization/naturalShowA');
testParser('normalization/naturalShowB');
testParser('normalization/naturalToIntegerA');
testParser('normalization/naturalToIntegerB');
testParser('normalization/optionalBuildA');
testParser('normalization/optionalBuildB');
testParser('normalization/optionalBuildFoldA');
testParser('normalization/optionalBuildFoldB');
testParser('normalization/optionalFoldA');
testParser('normalization/optionalFoldB');
testParser('normalization/remoteSystemsA');
testParser('normalization/remoteSystemsB');
testParser('parser/annotations');
testParser('parser/blockComment');
testParser('parser/builtins');
testParser('parser/constructors');
testParser('parser/double');
testParser('parser/doubleQuotedString');
testParser('parser/environmentVariables');
testParser('parser/escapedDoubleQuotedString');
testParser('parser/escapedSingleQuotedString');
testParser('parser/fields');
testParser('parser/forall');
testParser('parser/functionType');
testParser('parser/identifier');
testParser('parser/ifThenElse');
testParser('parser/interpolatedDoubleQuotedString');
testParser('parser/interpolatedSingleQuotedString');
testParser('parser/label');
testParser('parser/lambda');
testParser('parser/largeExpression');
testParser('parser/let');
testParser('parser/lineComment');
testParser('parser/list');
testParser('parser/merge');
testParser('parser/natural');
testParser('parser/nestedBlockComment');
testParser('parser/operators');
testParser('parser/pathTermination');
testParser('parser/paths');
testParser('parser/quotedLabel');
testParser('parser/record');
testParser('parser/reservedPrefix');
testParser('parser/singleQuotedString');
testParser('parser/unicodeComment');
testParser('parser/unicodeDoubleQuotedString');
testParser('parser/union');
testParser('parser/urls');
testParser('parser/whitespace');
testParser('parser/whitespaceBuffet');

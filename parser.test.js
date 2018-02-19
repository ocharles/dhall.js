var fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, 'start.html');

var parser = require('./parser.js');

function testParser(fileName) {
    test(fileName, done => {
        fs.readFile(
            path.join(__dirname, 'dhall-haskell/tests/parser/' + fileName + '.dhall'),
            (err, data) => {
                if (err) throw err;
                expect(parser.parse(data.toString())).toMatchSnapshot(fileName);
                done();
            });
    });
}

testParser('annotations');
testParser('blockComment');
testParser('builtins');
testParser('constructors');
testParser('double');
testParser('doubleQuotedString');
testParser('environmentVariables');
testParser('escapedDoubleQuotedString');
testParser('escapedSingleQuotedString');
testParser('fields');
testParser('forall');
testParser('functionType');
testParser('identifier');
testParser('ifThenElse');
testParser('interpolatedDoubleQuotedString');
testParser('interpolatedSingleQuotedString');
testParser('label');
testParser('lambda');
testParser('largeExpression');
testParser('let');
testParser('lineComment');
testParser('list');
testParser('merge');
testParser('natural');
testParser('nestedBlockComment');
testParser('operators');
testParser('pathTermination');
testParser('paths');
testParser('quotedLabel');
testParser('record');
testParser('reservedPrefix');
testParser('singleQuotedString');
testParser('unicodeComment');
testParser('unicodeDoubleQuotedString');
testParser('union');
testParser('urls');
testParser('whitespace');
testParser('whitespaceBuffet');

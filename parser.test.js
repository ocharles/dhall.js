var parser = require('./parser.js');

test('ifThenElse', () => {
    expect(parser.parse('if True then 1 else 2')).toMatchSnapshot();
});

var BigNumber = require('bignumber.js');

function normalize(expr) {
    if (expr.type == 'NaturalPlus') {
        a = normalize(expr.a);
        b = normalize(expr.b);
        
        return {
            type: 'NaturalLit',
            n: (new BigNumber(a.n)).plus(new BigNumber(b.n)).toString()
        };
    } else {
        return expr;
    }
}

module.exports = normalize;

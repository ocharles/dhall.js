var BigNumber = require('bignumber.js');

function normalize(expr) {
    if (expr.type == 'NaturalPlus') {
        a = normalize(expr.a);
        b = normalize(expr.b);
        
        return {
            type: 'NaturalLit',
            n: (new BigNumber(a.n)).plus(new BigNumber(b.n)).toString()
        };
    } else if (expr.type == 'RecordLit') {
        Object.keys(expr.fields).forEach(function (k) {
            expr.fields[k] = normalize(expr.fields[k]);
        });
        
        return expr;
        
    } else if (
        expr.type == 'App' 
            && normalize(expr.a).type == 'Double/show' 
            && normalize(expr.b).type == 'DoubleLit'
    ) {
        return {
            type: 'TextLit',
            chunks: normalize(expr.b).n.split('')
        };
    } else {
        return expr;
    }
}

module.exports = normalize;

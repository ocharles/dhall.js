var BigNumber = require('bignumber.js');

function normalize(expr) {
    if (expr.type == 'Type') {
        return expr;
    }

    if (expr.type == 'Kind') {
        return expr;
    }
    
    if (expr.type == 'Var') {
        return expr;
    }

    if (expr.type == 'Bool') {
        return expr;
    }

    if (expr.type == 'True') {
        return expr;
    }

    if (expr.type == 'False') {
        return expr;
    }
    
    if (expr.type == 'BoolIf' && normalize(expr.predicate).type == 'True') {
        return normalize(expr.true);
    }

    if (expr.type == 'BoolIf' && normalize(expr.predicate).type == 'False') {
        return normalize(expr.false);
    }

    if (expr.type == 'BoolIf' && normalize(expr.true).type == 'True' && normalize(expr.false).type == 'False') {
        return normalize(expr.predicate);
    }
    
    if (expr.type == 'BoolIf') {
        expr.predicate = normalize(expr.predicate);
        expr.true = normalize(expr.true);
        expr.false = normalize(expr.false);
        return expr;
    }

    if (expr.type == 'BoolOr' && normalize(expr.a).type == 'False') {
        return normalize(expr.b);
    }

    if (expr.type == 'BoolOr' && normalize(expr.b).type == 'False') {
        return normalize(expr.a);
    }

    if (expr.type == 'BoolOr' && normalize(expr.a).type == 'True') {
        return { type: 'True' };
    }

    if (expr.type == 'BoolOr' && normalize(expr.b).type == 'True') {
        return { type: 'True' };
    }

    if (expr.type == 'BoolOr') {
        expr.a = normalize(expr.a);
        expr.b = normalize(expr.b);
        return expr;
    }

    if (expr.type == 'BoolAnd' && normalize(expr.a).type == 'True') {
        return normalize(expr.b);
    }

    if (expr.type == 'BoolAnd' && normalize(expr.b).type == 'True') {
        return normalize(expr.a);
    }

    if (expr.type == 'BoolAnd' && normalize(expr.a).type == 'False') {
        return { type: 'False' };
    }

    if (expr.type == 'BoolAnd' && normalize(expr.b).type == 'False') {
        return { type: 'False' };
    }

    if (expr.type == 'BoolAnd') {
        expr.a = normalize(expr.a);
        expr.b = normalize(expr.b);
        return expr;
    }
    
    if (expr.type == 'NaturalLit') {
        return expr;
    }

    if (expr.type == 'NaturalPlus') {
        a = normalize(expr.a);
        b = normalize(expr.b);
        
        return {
            type: 'NaturalLit',
            n: (new BigNumber(a.n)).plus(new BigNumber(b.n)).toString()
        };
    }

    if (
        expr.type == 'App' 
            && normalize(expr.a).type == 'Natural/show' 
            && normalize(expr.b).type == 'NaturalLit'
    ) {
        return {
            type: 'TextLit',
            chunks: "+".concat(expr.b.n).split('')
        };
    }
    
    if (expr.type == 'Natural/show') {
        return expr;
    }
    
    if (expr.type == 'RecordLit') {
        Object.keys(expr.fields).forEach(function (k) {
            expr.fields[k] = normalize(expr.fields[k]);
        });
        
        return expr; 
    }
    
    if (expr.type == 'DoubleLit') {
        return expr;
    }
    
    if (
        expr.type == 'App' 
            && normalize(expr.a).type == 'Double/show' 
            && normalize(expr.b).type == 'DoubleLit'
    ) {
        return {
            type: 'TextLit',
            chunks: normalize(expr.b).n.split('')
        };
    }
    
    if (expr.type == 'Double/show') {
        return expr;
    }
    
    throw JSON.stringify(expr);
}

module.exports = normalize;

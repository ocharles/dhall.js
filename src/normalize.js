const BigNumber = require('bignumber.js');

function shift(d, x, m, e) {
  if (x === null) debugger;

  if (e.type === 'Var' && !Number.isInteger(e.var.n)) debugger;

  if (e.type === 'Var' && e.var.label === x && m <= e.var.n) {
    e.var.n += d;
    return e;
  }

  if (e.type === 'Var' && e.var.label === x && m > e.var.n) {
    return e;
  }

  if (e.type === 'Var' && e.var.label !== x) {
    return e;
  }

  if (e.type === 'Lambda' && e.var === x) {
    const A1 = shift(d, x, m, e.varType);
    const b1 = shift(d, x, m + 1, e.body);
    e.varType = A1;
    e.body = b1;
    return e;
  }

  if (e.type === 'Lambda' && e.var !== x) {
    const A1 = shift(d, x, m, e.varType);
    const b1 = shift(d, x, m, e.body);
    e.varType = A1;
    e.body = b1;
    return e;
  }

  if (e.type === 'Forall' && e.name !== x) {
    const A1 = shift(d, x, m, e.a);
    const B1 = shift(d, x, m, e.b);
    e.a = A1;
    e.b = B1;
    return e;
  }

  if (e.type === 'Let' && e.var === x && e.varType) {
    const A1 = shift(d, x, m, e.varType);
    const a1 = shift(d, x, m, e.val);
    const b1 = shift(d, x, m + 1, e.body);
    e.varType = A1;
    e.val = a1;
    e.body = b1;
    return e;
  }

  if (e.type === 'Let' && e.var === x) {
    const a1 = shift(d, x, m, e.val);
    const b1 = shift(d, x, m + 1, e.body);
    e.val = a1;
    e.body = b1;
    return e;
  }

  if (e.type === 'Let' && e.varType) {
    const A1 = shift(d, x, m, e.varType);
    const a1 = shift(d, x, m, e.val);
    const b1 = shift(d, x, m, e.body);
    e.varType = A1;
    e.val = a1;
    e.body = b1;
    return e;
  }

  if (e.type === 'Let') {
    const a1 = shift(d, x, m, e.val);
    const b1 = shift(d, x, m, e.body);
    e.val = a1;
    e.body = b1;
    return e;
  }

  if (e.type === 'Record') {
    Object.keys(e.fields).forEach(k => {
      e.fields[k] = shift(d, x, m, e.fields[k]);
    });
    return e;
  }

  if (e.type === 'Bool') {
    return e;
  }

  if (e.type === 'Text') {
    return e;
  }

  if (e.type === 'True') {
    return e;
  }

  if (e.type === 'Import') {
    return e;
  }

  if (e.type === 'List') {
    return e;
  }

  if (e.type === 'Natural') {
    return e;
  }

  if (e.type === 'Integer') {
    return e;
  }

  if (e.type === 'IntegerLit') {
    return e;
  }

  if (e.type === 'NaturalLit') {
    return e;
  }

  if (e.type === 'Optional') {
    return e;
  }

  if (e.type === 'OptionalLit' && e.value !== null) {
    e.value = shift(d, x, m, e.value);
    return e;
  }

  if (e.type === 'OptionalLit') {
    return e;
  }

  if (e.type === 'Optional/fold') {
    return e;
  }

  if (e.type === 'Integer/show') {
    return e;
  }

  if (e.type === 'Natural/toInteger') {
    return e;
  }

  // TODO
  if (e.type === 'TextLit') {
    return e;
  }

  if (e.type === 'App') {
    e.a = shift(d, x, m, e.a);
    e.b = shift(d, x, m, e.b);
    return e;
  }

  if (e.type === 'Field') {
    e.expr = shift(d, x, m, e.expr);
    return e;
  }

  throw `shift${JSON.stringify([d, x, m, e])}`;
}

function subst(v, e, a) {
  if (e.type === 'Var' && e.var.n === v.n && e.var.label === v.label) {
    return a;
  }

  if (e.type === 'Var') {
    return e;
  }

  if (e.type === 'Forall' && e.name !== v.label) {
    const A1 = subst(v, e.a, a);
    const e1 = shift(1, v.label, 0, a);
    const B1 = subst({ label: v.label, n: v.n + 1 }, e.b, e1);
    e.a = A1;
    e.b = B1;
    return e;
  }

  if (e.type === 'Lambda' && e.label === v.label) {
    const A1 = subst(v, e.varType, a);
    const e1 = shift(1, v.label, 0, a);
    const b1 = subst({ label: v.label, n: v.n + 1 }, e.body, e1);
    e.varType = A1;
    e.body = b1;
    return e;
  }

  if (e.type === 'Lambda' && e.label !== v.label) {
    const A1 = subst(v, e.varType, a);
    const e1 = shift(1, e.var, 0, a);
    const b1 = subst(v, e.body, e1);
    e.varType = A1;
    e.body = b1;
    return e;
  }

  if (e.type === 'Let' && e.label === v.label && e.varType) {
    const A1 = subst(v, e.varType, a);
    const a1 = subst(v, e.val, a);
    const e1 = shift(1, v.label, 0, a);
    const b1 = subst({ label: v.label, n: v.n + 1 }, e.body, e1);
    return {
      type: 'Let',
      label: e.label,
      varType: A1,
      val: a1,
      body: b1,
    };
  }

  if (e.type === 'Let' && e.label !== v.label && e.varType) {
    const A1 = subst(v, e.varType, a);
    const a1 = subst(v, e.val, a);
    const e1 = shift(1, e.label, 0, a);
    const b1 = subst(v, e.body, e1);
    return {
      type: 'Let',
      label: e.label,
      varType: A1,
      val: a1,
      body: b1,
    };
  }

  if (e.type === 'Let' && e.label === v.label) {
    const a1 = subst(v, e.val, a);
    const e1 = shift(1, v.label, 0, a);
    const b1 = subst({ label: v.label, n: v.n + 1 }, e.body, e1);
    return {
      type: 'Let',
      label: e.label,
      varType: null,
      val: a1,
      body: b1,
    };
  }

  if (e.type === 'Let' && e.label !== v.label) {
    const a1 = subst(v, e.val, a);
    const e1 = shift(1, e.label, 0, a);
    const b1 = subst(v, e.body, e1);
    return {
      type: 'Let',
      label: e.label,
      varType: null,
      val: a1,
      body: b1,
    };
  }

  if (e.type === 'App') {
    e.a = subst(v, e.a, a);
    e.b = subst(v, e.b, a);
    return e;
  }

  if (e.type === 'Record' && Object.keys(e.fields).length === 0) {
    return e;
  }

  if (e.type === 'Record') {
    Object.keys(e.fields).forEach(k => {
      e.fields[k] = subst(v, e.fields[k], a);
    });
    return e;
  }

  if (e.type === 'Field') {
    e.expr = subst(v, e.expr, a);
    return e;
  }

  // TODO
  if (e.type === 'TextLit') {
    return e;
  }

  if (e.type === 'Bool') {
    return e;
  }

  if (e.type === 'True') {
    return e;
  }

  if (e.type === 'Integer/show') {
    return e;
  }

  if (e.type === 'List') {
    return e;
  }

  if (e.type === 'Natural') {
    return e;
  }

  if (e.type === 'Integer') {
    return e;
  }

  if (e.type === 'IntegerLit') {
    return e;
  }

  if (e.type === 'NaturalLit') {
    return e;
  }

  if (e.type === 'Natural/toInteger') {
    return e;
  }

  if (e.type === 'Optional') {
    return e;
  }

  if (e.type === 'OptionalLit' && e.value !== null) {
    e.value = subst(v, e.value, a);
    return e;
  }

  if (e.type === 'Optional/fold') {
    return e;
  }

  if (e.type === 'Text') {
    return e;
  }

  if (e.type === 'Import') {
    return e;
  }

  throw `subst${JSON.stringify([v, e, a])}`;
}

function normalize(expr) {
  if (expr.type === 'Type') {
    return expr;
  }

  if (expr.type === 'Kind') {
    return expr;
  }

  if (expr.type === 'Var') {
    return expr;
  }

  if (expr.type === 'Bool') {
    return expr;
  }

  if (expr.type === 'True') {
    return expr;
  }

  if (expr.type === 'False') {
    return expr;
  }

  if (expr.type === 'BoolIf' && normalize(expr.predicate).type === 'True') {
    return normalize(expr.true);
  }

  if (expr.type === 'BoolIf' && normalize(expr.predicate).type === 'False') {
    return normalize(expr.false);
  }

  if (expr.type === 'BoolIf' && normalize(expr.true).type === 'True' && normalize(expr.false).type === 'False') {
    return normalize(expr.predicate);
  }

  if (expr.type === 'BoolIf') {
    expr.predicate = normalize(expr.predicate);
    expr.true = normalize(expr.true);
    expr.false = normalize(expr.false);
    return expr;
  }

  if (expr.type === 'BoolOr' && normalize(expr.a).type === 'False') {
    return normalize(expr.b);
  }

  if (expr.type === 'BoolOr' && normalize(expr.b).type === 'False') {
    return normalize(expr.a);
  }

  if (expr.type === 'BoolOr' && normalize(expr.a).type === 'True') {
    return { type: 'True' };
  }

  if (expr.type === 'BoolOr' && normalize(expr.b).type === 'True') {
    return { type: 'True' };
  }

  if (expr.type === 'BoolOr') {
    expr.a = normalize(expr.a);
    expr.b = normalize(expr.b);
    return expr;
  }

  if (expr.type === 'BoolAnd' && normalize(expr.a).type === 'True') {
    return normalize(expr.b);
  }

  if (expr.type === 'BoolAnd' && normalize(expr.b).type === 'True') {
    return normalize(expr.a);
  }

  if (expr.type === 'BoolAnd' && normalize(expr.a).type === 'False') {
    return { type: 'False' };
  }

  if (expr.type === 'BoolAnd' && normalize(expr.b).type === 'False') {
    return { type: 'False' };
  }

  if (expr.type === 'BoolAnd') {
    expr.a = normalize(expr.a);
    expr.b = normalize(expr.b);
    return expr;
  }

  if (expr.type === 'NaturalLit') {
    return expr;
  }

  if (expr.type === 'NaturalPlus') {
    a = normalize(expr.a);
    b = normalize(expr.b);

    return {
      type: 'NaturalLit',
      n: (new BigNumber(a.n)).plus(new BigNumber(b.n)).toString(),
    };
  }

  if (
    expr.type === 'App'
            && normalize(expr.a).type === 'Natural/toInteger'
            && normalize(expr.b).type === 'NaturalLit'
  ) {
    return {
      type: 'IntegerLit',
      n: (new BigNumber(normalize(expr.b).n)).toString(),
    };
  }

  if (
    expr.type === 'App'
            && normalize(expr.a).type === 'Natural/show'
            && normalize(expr.b).type === 'NaturalLit'
  ) {
    return {
      type: 'TextLit',
      chunks: '+'.concat(expr.b.n).split(''),
    };
  }

  if (expr.type === 'Natural/toInteger') {
    return expr;
  }

  if (expr.type === 'Natural/show') {
    return expr;
  }

  if (expr.type === 'Text') {
    return expr;
  }

  if (expr.type === 'App'
        && normalize(expr.a).type === 'App'
        && normalize(expr.a).a.type === 'Optional/build'
  ) {
    const A = normalize(expr.a).b;
    return normalize({
      type: 'App',
      a: {
        type: 'App',
        a: {
          type: 'App',
          a: expr.b,
          b: {
            type: 'App',
            a: {
              type: 'Optional',
            },
            b: A,
          },
        },
        b: {
          type: 'Lambda',
          var: 'a',
          varType: A,
          body: {
            type: 'OptionalLit',
            value: {
              type: 'Var',
              var: {
                label: 'a',
                n: 0,
              },
            },
          },
        },
      },
      b: {
        type: 'OptionalLit',
        value: null,
      },
    });
  }

  // TODO More checks the premises hold
  if (expr.type === 'App'
        && normalize(expr.a).type === 'App'
        && normalize(expr.a).a.type === 'App'
        && normalize(expr.a).a.a.type === 'App'
        && normalize(expr.a).a.a.a.type === 'App'
        && normalize(expr.a).a.a.a.a.type === 'Optional/fold'
        && normalize(expr.a).a.a.value !== null
  ) {
    expr = normalize({
      type: 'App',
      a: normalize(expr.a).b,
      b: normalize(expr.a).a.a.b.value,
    });
    console.log(expr);
    return expr;
  }

  // TODO More checks the premises hold
  if (expr.type === 'App'
        && normalize(expr.a).type === 'App'
        && normalize(expr.a).a.type === 'App'
        && normalize(expr.a).a.a.type === 'App'
        && normalize(expr.a).a.a.a.type === 'App'
        && normalize(expr.a).a.a.a.a.type === 'Optional/fold'
        && normalize(expr.a).a.a.value === null
  ) {
    return normalize(expr.b);
  }

  if (expr.type === 'OptionalLit') {
    expr.value = expr.value === null ? null : normalize(expr.value);
    return expr;
  }

  if (expr.type === 'Optional/build') {
    return expr;
  }

  if (expr.type === 'Optional/fold') {
    return expr;
  }

  if (expr.type === 'RecordLit') {
    Object.keys(expr.fields).forEach(k => {
      expr.fields[k] = normalize(expr.fields[k]);
    });

    return expr;
  }

  if (expr.type === 'Record') {
    Object.keys(expr.fields).forEach(k => {
      expr.fields[k] = normalize(expr.fields[k]);
    });

    return expr;
  }

  if (expr.type === 'Integer') {
    return expr;
  }

  if (expr.type === 'IntegerLit') {
    return expr;
  }

  if (expr.type === 'List') {
    return expr;
  }

  if (expr.type === 'Natural') {
    return expr;
  }

  if (expr.type === 'Optional') {
    return expr;
  }

  if (expr.type === 'TextLit') {
    return expr;
  }

  if (expr.type === 'App'
        && normalize(expr.a).type === 'Integer/show'
  ) {
    return {
      type: 'TextLit',
      chunks: normalize(expr.b).n.split(''),
    };
  }

  if (expr.type === 'Integer/show') {
    return expr;
  }

  if (expr.type === 'DoubleLit') {
    return expr;
  }

  if (
    expr.type === 'App'
            && normalize(expr.a).type === 'Double/show'
            && normalize(expr.b).type === 'DoubleLit'
  ) {
    return {
      type: 'TextLit',
      chunks: normalize(expr.b).n.split(''),
    };
  }

  if (expr.type === 'Double/show') {
    return expr;
  }

  if (expr.type === 'Lambda') {
    expr.varType = normalize(expr.varType);
    expr.body = normalize(expr.body);
    return expr;
  }

  if (expr.type === 'Forall') {
    expr.a = normalize(expr.a);
    expr.b = normalize(expr.b);
    return expr;
  }

  if (
    expr.type === 'App'
            && normalize(expr.a).type === 'Lambda'
  ) {
    expr.a = normalize(expr.a);

    const a1 = shift(1, expr.a.var, 0, expr.b);
    const b1 = subst({ label: expr.a.var, n: 0 }, expr.a.body, a1);
    const b2 = shift(-1, expr.a.var, 0, b1);
    const b3 = normalize(b2);

    return b3;
  }

  if (expr.type === 'App') {
    expr.a = normalize(expr.a);
    expr.b = normalize(expr.b);
    return expr;
  }

  if (expr.type === 'Let') {
    const a1 = shift(1, expr.label, 0, expr.val);
    const b1 = subst({ n: 0, label: expr.label }, expr.body, a1);
    const b2 = shift(-1, expr.label, 0, b1);
    return normalize(b2);
  }

  if (expr.type === 'Import') {
    return expr;
  }

  throw JSON.stringify(expr);
}

module.exports = normalize;

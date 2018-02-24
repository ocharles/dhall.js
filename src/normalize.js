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
  // ───────────
  // Type ⇥ Type

  if (expr.type === 'Type') {
    return expr;
  }

  // ───────────
  // Kind ⇥ Kind
  if (expr.type === 'Kind') {
    return expr;
  }

  // ─────────
  // x@n ⇥ x@n
  if (expr.type === 'Var') {
    return expr;
  }

  // ───────────
  // Bool ⇥ Bool
  if (expr.type === 'Bool') {
    return expr;
  }

  // ───────────
  // True ⇥ True
  if (expr.type === 'True') {
    return expr;
  }

  // ─────────────
  // False ⇥ False
  if (expr.type === 'False') {
    return expr;
  }

  // t ⇥ True   l₀ ⇥ l₁
  // ────────────────────────
  // if t then l₀ else r ⇥ l₁
  if (expr.type === 'BoolIf' && normalize(expr.predicate).type === 'True') {
    return normalize(expr.true);
  }

  // t ⇥ False   r₀ ⇥ r₁
  // ────────────────────────
  // if t then l else r₀ ⇥ r₁
  if (expr.type === 'BoolIf' && normalize(expr.predicate).type === 'False') {
    return normalize(expr.false);
  }

  // l ⇥ True   r ⇥ False   t₀ ⇥ t₁
  // ──────────────────────────────
  // if t₀ then l else r ⇥ t₁
  if (expr.type === 'BoolIf' && normalize(expr.true).type === 'True' && normalize(expr.false).type === 'False') {
    return normalize(expr.predicate);
  }

  // t₀ ⇥ t₁   l₀ ⇥ l₁   r₀ ⇥ r₁
  // ─────────────────────────────────────────────
  // if t₀ then l₀ else r₀ ⇥ if t₁ then l₁ else r₁
  if (expr.type === 'BoolIf') {
    expr.predicate = normalize(expr.predicate);
    expr.true = normalize(expr.true);
    expr.false = normalize(expr.false);
    return expr;
  }

  // l ⇥ False   r₀ ⇥ r₁
  // ───────────────────
  // l || r₀ ⇥ r₁
  if (expr.type === 'BoolOr' && normalize(expr.a).type === 'False') {
    return normalize(expr.b);
  }

  // r ⇥ False   l₀ ⇥ l₁
  // ───────────────────
  // l₀ || r ⇥ l₁
  if (expr.type === 'BoolOr' && normalize(expr.b).type === 'False') {
    return normalize(expr.a);
  }

  // l ⇥ True
  // ─────────────
  // l || r ⇥ True
  if (expr.type === 'BoolOr' && normalize(expr.a).type === 'True') {
    return { type: 'True' };
  }

  // r ⇥ True
  // ─────────────
  // l || r ⇥ True
  if (expr.type === 'BoolOr' && normalize(expr.b).type === 'True') {
    return { type: 'True' };
  }

  // l₀ ⇥ l₁   r₀ ⇥ r₁
  // ───────────────────
  // l₀ || r₀ ⇥ l₁ || r₁
  if (expr.type === 'BoolOr') {
    expr.a = normalize(expr.a);
    expr.b = normalize(expr.b);
    return expr;
  }

  // l ⇥ True   r₀ ⇥ r₁
  // ──────────────────
  // l && r₀ ⇥ r₁
  if (expr.type === 'BoolAnd' && normalize(expr.a).type === 'True') {
    return normalize(expr.b);
  }

  // r ⇥ True   l₀ ⇥ l₁
  // ──────────────────
  // l₀ && r ⇥ l₁
  if (expr.type === 'BoolAnd' && normalize(expr.b).type === 'True') {
    return normalize(expr.a);
  }

  // l ⇥ False
  // ──────────────
  // l && r ⇥ False
  if (expr.type === 'BoolAnd' && normalize(expr.a).type === 'False') {
    return { type: 'False' };
  }

  // r ⇥ False
  // ──────────────
  // l && r ⇥ False
  if (expr.type === 'BoolAnd' && normalize(expr.b).type === 'False') {
    return { type: 'False' };
  }

  // l₀ ⇥ l₁   r₀ ⇥ r₁
  // ───────────────────
  // l₀ && r₀ ⇥ l₁ && r₁
  if (expr.type === 'BoolAnd') {
    expr.a = normalize(expr.a);
    expr.b = normalize(expr.b);
    return expr;
  }

  // l ⇥ True   r₀ ⇥ r₁
  // ──────────────────
  // l == r₀ ⇥ r₁
  if (expr.type === 'BoolEQ' && normalize(expr.a) === 'True') {
    return normalize(expr.b);
  }

  // r ⇥ True   l₀ ⇥ l₁
  // ──────────────────
  // l₀ == r ⇥ l₁
  if (expr.type === 'BoolEQ' && normalize(expr.b) === 'True') {
    return normalize(expr.a);
  }

  // l ⇥ False   r ⇥ False
  // ─────────────────────
  // l == r ⇥ True
  if (expr.type === 'BoolEQ' && normalize(expr.a) === 'False' && normalize(expr.a) === 'False') {
    return {
      type: 'True',
    };
  }

  // l₀ ⇥ l₁   r₀ ⇥ r₁
  // ───────────────────
  // l₀ == r₀ ⇥ l₁ == r₁
  if (expr.type === 'BoolEQ') {
    expr.a = normalize(expr.a);
    expr.b = normalize(expr.b);
    return expr;
  }

  // l ⇥ False   r₀ ⇥ r₁
  // ──────────────────
  // l != r₀ ⇥ r₁
  if (expr.type === 'BoolNE' && normalize(expr.a) === 'False') {
    return normalize(expr.b);
  }

  // r ⇥ False   l₀ ⇥ l₁
  // ──────────────────
  // l₀ != r ⇥ l₁
  if (expr.type === 'BoolNE' && normalize(expr.b) === 'False') {
    return normalize(expr.a);
  }

  // l ⇥ True   r ⇥ True
  // ─────────────────────
  // l != r ⇥ True
  if (expr.type === 'BoolNE' && normalize(expr.a) === 'True' && normalize(expr.a) === 'True') {
    return {
      type: 'False',
    };
  }

  // l₀ ⇥ l₁   r₀ ⇥ r₁
  // ───────────────────
  // l₀ != r₀ ⇥ l₁ != r₁
  if (expr.type === 'BoolNE') {
    expr.a = normalize(expr.a);
    expr.b = normalize(expr.b);
    return expr;
  }

  // ─────────────────
  // Natural ⇥ Natural
  if (expr.type === 'Natural') {
    return expr;
  }

  // ───────
  // +n ⇥ +n
  if (expr.type === 'NaturalLit') {
    return expr;
  }

  // f ⇥ Natural/build   a ⇥ Natural/fold b
  // ──────────────────────────────────────
  // f a ⇥ b
  // TODO

  // f ⇥ Natural/fold   a ⇥ Natural/build b
  // ──────────────────────────────────────
  // f a ⇥ b
  // TODO

  // f ⇥ Natural/build   g Natural (λ(x : Natural) → x + +1) +0 ⇥ b
  // ──────────────────────────────────────────────────────────────
  // f g ⇥ b
  // TODO

  // f ⇥ Natural/fold +0 B g   b ⇥ t₁
  // ────────────────────────────────
  // f b ⇥ t₁
  // TODO

  // f ⇥ Natural/fold (+1 + n) B g
  // g (Natural/fold n B g b) ⇥ t₁
  // ─────────────────────────────  ; "+1 + n" means "a `Natural` literal greater
  // f b ⇥ t₁                       ; than `+0`"
  // TODO

  // l ⇥ +0   r₀ ⇥ r₁
  // ────────────────
  // l + r₀ ⇥ r₁
  // TODO

  // r ⇥ +0   l₀ ⇥ l₁
  // ────────────────
  // l₀ + r ⇥ l₁
  // TODO

  // l ⇥ +m   r ⇥ +n
  // ───────────────  ; "+m + +n" means "use machine addition"
  // l + r ⇥ +m + +n
  // TODO Lacking premise checks
  if (expr.type === 'NaturalPlus') {
    const a = normalize(expr.a);
    const b = normalize(expr.b);

    return {
      type: 'NaturalLit',
      n: (new BigNumber(a.n)).plus(new BigNumber(b.n)).toString(),
    };
  }

  // l₀ ⇥ l₁   r₀ ⇥ r₁
  // ─────────────────  ; If no other rule matches
  // l₀ + r₀ ⇥ l₁ + r₁
  // TODO

  // l ⇥ +0
  // ──────────
  // l * r ⇥ +0
  // TODO

  // r ⇥ +0
  // ──────────
  // l * r ⇥ +0
  // TODO

  // l ⇥ +1   r₀ ⇥ r₁
  // ────────────────
  // l * r₀ ⇥ r₁
  // TODO

  // r ⇥ +1   l₀ ⇥ l₁
  // ────────────────
  // l₀ * r ⇥ l₁
  // TODO
  //
  // l ⇥ +m   r ⇥ +n
  // ───────────────  ; "+m * +n" means "use machine multiplication"
  // l + r ⇥ +m * +n
  // TODO

  // l₀ ⇥ l₁   r₀ ⇥ r₁
  // ─────────────────  ; If no other rule matches
  // l₀ * r₀ ⇥ l₁ * r₁
  // TODO

  // f ⇥ Natural/isZero   a ⇥ +0
  // ───────────────────────────
  // f a ⇥ True
  // TODO

  // f ⇥ Natural/isZero   a ⇥ +1 + n
  // ───────────────────────────────  ; "+1 + n" means "a `Natural` literal
  // f a ⇥ False                      ; greater than `+0`"
  // TODO

  // f ⇥ Natural/even   a ⇥ +0
  // ─────────────────────────
  // f a ⇥ True
  // TODO

  // f ⇥ Natural/even   a ⇥ +1
  // ─────────────────────────
  // f a ⇥ False
  // TODO

  // f ⇥ Natural/even
  // a ⇥ +1 + n
  // Natural/odd n ⇥ b
  // ─────────────────  ; "+1 + n" means "a `Natural` literal greater than `+0`"
  // f a ⇥ b
  // TODO

  // f ⇥ Natural/odd   a ⇥ +0
  // ────────────────────────
  // f a ⇥ False
  // TODO

  // f ⇥ Natural/odd   a ⇥ +1
  // ────────────────────────
  // f a ⇥ True
  // TODO

  // f ⇥ Natural/odd
  // a ⇥ +1 + n
  // Natural/even n ⇥ b
  // ──────────────────  ; "+1 + n" means "a `Natural` literal greater than `+0`"
  // f a ⇥ b
  // TODO

  // f ⇥ Natural/toInteger   a ⇥ +n
  // ──────────────────────────────
  // f a ⇥ n
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

  // f ⇥ Natural/show   a ⇥ +n
  // ─────────────────────────
  // f a ⇥ "+n"
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

  // ─────────────────────────────
  // Natural/build ⇥ Natural/build
  // TODO

  // ───────────────────────────
  // Natural/fold ⇥ Natural/fold
  // TODO

  // ───────────────────────────────
  // Natural/isZero ⇥ Natural/isZero
  // TODO

  // ───────────────────────────
  // Natural/even ⇥ Natural/even
  // TODO

  // ─────────────────────────
  // Natural/odd ⇥ Natural/odd
  // TODO

  // ─────────────────────────────────────
  // Natural/toInteger ⇥ Natural/toInteger
  if (expr.type === 'Natural/toInteger') {
    return expr;
  }

  // ───────────────────────────
  // Natural/show ⇥ Natural/show
  if (expr.type === 'Natural/show') {
    return expr;
  }

  // ───────────
  // Text ⇥ Text
  if (expr.type === 'Text') {
    return expr;
  }

  // ─────────
  // "…" ⇥ "…"
  // TODO

  if (expr.type === 'TextLit') {
    return expr;
  }

  // l ⇥ "…"₀   r ⇥ "…"₁
  // ─────────────────────  ; "…"₀ ++ "…"₁ means "use machine concatenation"
  // l ++ r ⇥ "…"₀ ++ "…"₁
  // TODO

  // l ⇥ ""   r₀ ⇥ r₁
  // ────────────────
  // l ++ r₀ ⇥ r₁
  // TODO

  // r ⇥ ""   l₀ ⇥ l₁
  // ────────────────
  // l₀ ++ r ⇥ l₁
  // TODO

  // l₀ ⇥ l₁   r₀ ⇥ r₁
  // ───────────────────  ; If no other rule matches
  // l₀ ++ r₀ ⇥ l₁ ++ r₁
  // TODO

  // ───────────
  // List ⇥ List
  if (expr.type === 'List') {
    return expr;
  }

  // T₀ ⇥ T₁
  // ──────────────────────────
  // [] : List T₀ ⇥ [] : List T₁
  // TODO

  // t₀ ⇥ t₁   [ ts₀… ] ⇥ [ ts₁… ]
  // ─────────────────────────────
  // [ t₀, ts₀… ] ⇥ [ t₁, ts₁… ]
  // TODO

  // f ⇥ List/fold A₀   a ⇥ List/build A₁ b
  // ──────────────────────────────────────
  // f a ⇥ b
  // TODO

  // f ⇥ List/build A₀   a ⇥ List/fold A₁ b
  // ──────────────────────────────────────
  // f a ⇥ b
  // TODO

  // f ⇥ List/build A
  // g (List A) (λ(a : A) → λ(as : List A) → [ a ] # as) ([] : List A) ⇥ b
  // ───────────────────────────────────────────────────────────────────────
  // f g ⇥ b
  // TODO

  // f ⇥ List/fold A₀ ([] : List A₁) B g   b₀ ⇥ b₁
  // ─────────────────────────────────────────────
  // f b₀ ⇥ b₁
  // TODO

  // f ⇥ List/fold A₀ [ a, as… ] B g   g a (List/fold A₀ [ as… ] B g b₀) ⇥ b₁
  // ────────────────────────────────────────────────────────────────────────
  // f b₀ ⇥ b₁
  // TODO

  // ls₀ ⇥ [ ls₁… ]
  // rs₀ ⇥ [ rs₁… ]
  // [ ls₁… ] # [ rs₁… ] ⇥ t
  // ───────────────────────   ;  "[ ls₁… ] # [ rs₁… ]" means "use machine
  // ls₀ # rs₀ ⇥ t             ;  concatenation"
  // TODO

  // ls ⇥ [] : List T   rs₀ ⇥ rs₁
  // ────────────────────────────
  // ls # rs₀ ⇥ rs₁
  // TODO

  // rs ⇥ [] : List T   ls₀ ⇥ ls₁
  // ────────────────────────────
  // ls₀ # rs ⇥ ls₁
  // TODO

  // ls₀ ⇥ ls₁   rs₀ ⇥ rs₁
  // ─────────────────────   ; If no other rule matches
  // ls₀ # rs₀ ⇥ ls₁ # rs₁
  // TODO

  // f ⇥ List/length A₀   a ⇥ [] : List A₁
  // ─────────────────────────────────────
  // f a ⇥ +0
  // TODO


  // f ⇥ List/length A₀   as₀ ⇥ [ a, as₁… ]   +1 + List/length A₀ [ as₁… ] ⇥ n
  // ─────────────────────────────────────────────────────────────────────────
  // f as₀ ⇥ n
  // TODO

  // f ⇥ List/head A₀   as ⇥ [] : List A₁
  // ────────────────────────────────────
  // f as ⇥ [] : Optional A₀
  // TODO

  // f ⇥ List/head A₀   as ⇥ [ a, … ]
  // ────────────────────────────────
  // f as ⇥ [ a ] : Optional A₀
  // TODO

  // f ⇥ List/last A₀   as ⇥ [] : List A₁
  // ────────────────────────────────────
  // f as ⇥ [] : Optional A₀
  // TODO

  // f ⇥ List/last A₀   as ⇥ [ …, a ]
  // ────────────────────────────────
  // f as ⇥ [ a ] : Optional A₀
  // TODO

  // f ⇥ List/indexed A₀   as ⇥ [] : List A₁
  // ───────────────────────────────────────────────
  // f as ⇥ [] : List { index : Natural, value : A₀ }
  // TODO

  // f ⇥ List/indexed A₀   as ⇥ [ a₀, a₁, …, ]
  // ────────────────────────────────────────────────────────────────────
  // f as ⇥ [ { index = +0, value = a₀ }, { index = +1, value = a₁ }, … ]
  // TODO

  // f ⇥ List/reverse A₀   as ⇥ [] : List A₁
  // ───────────────────────────────────────
  // f as ⇥ [] : List A₁
  // TODO

  // f ⇥ List/reverse A₀   as ⇥ [ a₀, a₁, … ]
  // ────────────────────────────────────────
  // f as ⇥ [ …, a₁, a₀ ]
  // TODO

  // ───────────────────────
  // List/build ⇥ List/build
  // TODO

  // ─────────────────────
  // List/fold ⇥ List/fold
  // TODO

  // ─────────────────────────
  // List/length ⇥ List/length
  // TODO

  // ─────────────────────
  // List/head ⇥ List/head
  // TODO

  // ─────────────────────
  // List/last ⇥ List/last
  // TODO

  // ───────────────────────────
  // List/indexed ⇥ List/indexed
  // TODO

  // ───────────────────────────
  // List/reverse ⇥ List/reverse
  // TODO

  // ───────────────────
  // Optional ⇥ Optional
  if (expr.type === 'Optional') {
    return expr;
  }

  // T₀ ⇥ T₁
  // ───────────────────────────────────
  // [] : Optional T₀ ⇥ [] : Optional T₁
  //
  // t₀ ⇥ t₁   T₀ ⇥ T₁
  // ───────────────────────────────────────────
  // [ t₀ ] : Optional T₀ ⇥ [ t₁ ] : Optional T₁
  // TODO Normalize the type
  if (expr.type === 'OptionalLit') {
    expr.value = expr.value === null ? null : normalize(expr.value);
    return expr;
  }

  // f ⇥ Optional/fold A₀   a ⇥ Optional/build A₁ b
  // ──────────────────────────────────────────────
  // f a ⇥ b

  // f ⇥ Optional/build A₀   a ⇥ Optional/fold A₁ b
  // ──────────────────────────────────────────────
  // f a ⇥ b

  // f ⇥ Optional/build A
  // g (Optional A) (λ(a : A) → [ a ] : Optional A) ([] : Optional A) ⇥ b
  // ────────────────────────────────────────────────────────────────────
  // f g ⇥ b
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

  // f ⇥ Optional/fold A₀ ([ a ] : Optional A₁) B₀ g   g a ⇥ b₁
  // ──────────────────────────────────────────────────────────
  // f b₀ ⇥ b₁
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
    return expr;
  }

  // f ⇥ Optional/fold A₀ ([] : Optional A₁) B₀ g   b₀ ⇥ b₁
  // ─────────────────────────────────────────────────────
  // f b₀ ⇥ b₁
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

  // ─────────────────────────────
  // Optional/fold ⇥ Optional/fold
  if (expr.type === 'Optional/fold') {
    return expr;
  }

  // ───────────────────────────────
  // Optional/build ⇥ Optional/build
  if (expr.type === 'Optional/build') {
    return expr;
  }

  // ─────────────────
  // Integer ⇥ Integer
  if (expr.type === 'Integer') {
    return expr;
  }

  // ─────
  // n ⇥ n
  if (expr.type === 'IntegerLit') {
    return expr;
  }

  // f ⇥ Integer/show   a ⇥ n
  // ────────────────────────
  // f a ⇥ "n"
  if (expr.type === 'App'
        && normalize(expr.a).type === 'Integer/show'
  ) {
    return {
      type: 'TextLit',
      chunks: normalize(expr.b).n.split(''),
    };
  }

  // ───────────────────────────
  // Integer/show ⇥ Integer/show
  if (expr.type === 'Integer/show') {
    return expr;
  }

  // ─────────
  // n.n ⇥ n.n
  if (expr.type === 'DoubleLit') {
    return expr;
  }

  // f ⇥ Double/show   a ⇥ n.n
  // ─────────────────────────
  // f a ⇥ "n.n"
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

  // ─────────────────────────
  // Double/show ⇥ Double/show
  if (expr.type === 'Double/show') {
    return expr;
  }

  // A₀ → A₁   B₀ → B₁
  // ───────────────────────────────
  // ∀(x : A₀) → B₀ ⇥ ∀(x : A₁) → B₁
  if (expr.type === 'Forall') {
    expr.a = normalize(expr.a);
    expr.b = normalize(expr.b);
    return expr;
  }

  // A₀ → A₁   b₀ → b₁
  // ───────────────────────────────
  // λ(x : A₀) → b₀ ⇥ λ(x : A₁) → b₁
  if (expr.type === 'Lambda') {
    expr.varType = normalize(expr.varType);
    expr.body = normalize(expr.body);
    return expr;
  }

  // f ⇥ λ(x : A) → b₀
  // ↑(1, x, 0, a₀) = a₁
  // b₀[x ≔ a₁] = b₁
  // ↑(-1, x, 0, b₁) = b₂
  // b₂ ⇥ b₃
  // ──────────────────────
  // f a₀ ⇥ b₃
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

  // f₀ ⇥ f₁   a₀ ⇥ a₁
  // ─────────────────  ; If no other rule matches
  // f₀ a₀ ⇥ f₁ a₁
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

  // Uncategorized
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

  throw JSON.stringify(expr);
}

module.exports = normalize;

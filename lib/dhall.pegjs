{
    function operatorPostProcess(node, a, args) {
        return [a].concat(args).reduce(function (a, b) {
            return {
                type: node,
                a: a,
                b: b[1]
            }
        });
    }

    function catObjects(b) {
        var fields = {};
        b.forEach(function (item){
            var key = Object.keys(item)[0];
            fields[key] = item[key];
        });
        return fields;
    };
}

completeExpression
  = whitespace e:expression { return e; }

endOfLine
  = "\u000D"? "\u000A"

tab
  = "\u0009"

blockComment
  = "{-" blockCommentContinue

blockCommentContinue
  = "-}" 
  / (blockComment
  / [\u0020-\uFFFF]
  / tab
  / endOfLine) blockCommentContinue

notEndOfLine
  = [\u0020-\uFFFF]
  / tab

lineComment
  = "--" notEndOfLine* endOfLine

whitespace
  = ([ ]
  / tab
  / endOfLine
  / lineComment
  / blockComment)*

ALPHA
  = [\u0041-\u005A] / [\u0061-\u007A]

DIGIT
  = [\u0030-\u0039]

HEXDIG
  = DIGIT / [ABCDEF]

simpleLabel
  = !(reserved !((ALPHA / DIGIT / [\-/_])))
    x:(ALPHA / "_") xs:(ALPHA / DIGIT / [\-/_])*
    { return x + xs.join(''); }

quotedLabel
  = (ALPHA / DIGIT / [\-/_:.])+

label
  = a:("`" l:quotedLabel "`" { return l; } / simpleLabel) whitespace { return a; }

// TODO
doubleQuoteChunk
  =   "${" expression "}"
    / "\u005C"
      ( "\u0022"
      / "\u0024"
      / "\u005C"
      / "\u002F"
      / "\u0062"
      / "\u0066"
      / "\u006E"
      / "\u0072"
      / "\u0074"
      / "\u0075"
      )
    / [\u0020-\u0021]
    / [\u0023-\u005B]
    / [\u005D-\uFFFF]

doubleQuoteLiteral
  = "\"" a:doubleQuoteChunk* "\"" { return { type: 'TextLit', chunks: a } }

singleQuoteContinue =
      "'''"               singleQuoteContinue
    / "${" expression "}" singleQuoteContinue
    / "''${"              singleQuoteContinue
    / "''"
    / [\u0020-\uFFFF]     singleQuoteContinue
    / tab                 singleQuoteContinue
    / endOfLine           singleQuoteContinue

singleQuoteLiteral = "''" a:singleQuoteContinue { return { type: 'TextLit', chunks: a }; };

textLiteral
  = a:(doubleQuoteLiteral / singleQuoteLiteral) whitespace { return a; }

if                =   "if"               whitespace
then              =   "then"             whitespace
else              =   "else"             whitespace
let               =   "let"              whitespace
in                =   "in"               whitespace
as                =   "as"               whitespace
using             =   "using"            whitespace
merge             =   "merge"            whitespace
constructors      =   "constructors"     whitespace
NaturalFold       = a:"Natural/fold"     whitespace { return { type: 'Natural/fold' }; }
NaturalBuild      = a:"Natural/build"    whitespace { return { type: 'Natural/build' }; }
NaturalIsZero     = a:"Natural/isZero"   whitespace { return { type: 'Natural/isZero' }; }
NaturalEven       = a:"Natural/even"     whitespace { return { type: 'Natural/even' }; }
NaturalOdd        = a:"Natural/odd"      whitespace { return { type: 'Natural/odd' }; }
NaturalToInteger  = a:"Natural/toInteger"whitespace { return { type: 'Natural/toInteger' }; }
NaturalShow       = a:"Natural/show"     whitespace { return { type: 'Natural/show' }; }
IntegerShow       = a:"Integer/show"     whitespace { return { type: 'Integer/show' }; }
DoubleShow        = a:"Double/show"      whitespace { return { type: 'Double/show' }; }
ListBuild         = a:"List/build"       whitespace { return { type: 'List/build' }; }
ListFold          = a:"List/fold"        whitespace { return { type: 'List/fold' }; }
ListLength        = a:"List/length"      whitespace { return { type: 'List/length' }; }
ListHead          = a:"List/head"        whitespace { return { type: 'List/head' }; }
ListLast          = a:"List/last"        whitespace { return { type: 'List/last' }; }
ListIndexed       = a:"List/indexed"     whitespace { return { type: 'List/indexed' }; }
ListReverse       = a:"List/reverse"     whitespace { return { type: 'List/reverse' }; }
OptionalFold      = a:"Optional/fold"    whitespace { return { type: 'Optional/fold' }; }
OptionalBuild     = a:"Optional/build"   whitespace { return { type: 'Optional/build' }; }
Bool              = a:"Bool"             whitespace { return { type: 'Bool' }; }
Optional          = a:"Optional"         whitespace { return { type: 'Optional' }; }
Natural           = a:"Natural"          whitespace { return { type: 'Natural' }; }
Integer           = a:"Integer"          whitespace { return { type: 'Integer' }; }
Double            = a:"Double"           whitespace { return { type: 'Double' }; }
Text              = a:"Text"             whitespace { return { type: 'Text' }; }
List              = a:"List"             whitespace { return { type: 'List' }; }
True              = a:"True"             whitespace { return { type: 'True' }; }
False             = a:"False"            whitespace { return { type: 'False' }; }
Type              = a:"Type"             whitespace { return { type: 'Type' }; }
Kind              = a:"Kind"             whitespace { return { type: 'Kind' }; }

equal         = "="  whitespace
or            = "||" whitespace
plus          = "+"  whitespace
textAppend    = "++" whitespace
listAppend    = "#"  whitespace
and           = "&&" whitespace
times         = "*"  whitespace
doubleEqual   = "==" whitespace
notEqual      = "!=" whitespace
dot           = "."  whitespace
openBrace     = "{"  whitespace
closeBrace    = "}"  whitespace
openBracket   = "["  whitespace
closeBracket  = "]"  whitespace
openAngle     = "<"  whitespace
closeAngle    = ">"  whitespace
bar           = "|"  whitespace
comma         = ","  whitespace
openParens    = "("  whitespace
closeParens   = ")"  whitespace
colon         = ":"  whitespace
at            = "@"  whitespace

combine = ( "∧" / "/\\"    ) whitespace
prefer  = ( "⫽" / "//"     ) whitespace
lambda  = ( "λ" / "\\"     ) whitespace
forall  = ( "∀" / "forall" ) whitespace
arrow   = ( "→" / "->"     ) whitespace

exponent
  = "e" ("+" / "-")? DIGIT+

doubleLiteral
  = a:"-"? b:DIGIT+ c:(d:"." e:DIGIT+ f:exponent? { return d + e.join(''); } / exponent) whitespace {
      return {
          type: 'DoubleLit',
          n: (a ? a : '') + b.join('') + c
      }
  }

naturalRaw
  = digits:DIGIT+ {
      return digits.join('');
  }

integerLiteral
  = a:"-"? b:naturalRaw whitespace {
      return {
          type: 'IntegerLit',
          n: (a ? a : '') + b
      }
  }

naturalLiteral
  = "+" n:naturalRaw whitespace { return { type: 'NaturalLit', n: n } }

identifier
  = l:label n:(at n:naturalRaw { return n; })? whitespace {
      return {
          n: n ? Number(n) : 0,
          label: l
      };
  }

headPathCharacter =
      [\u0021-\u0027]
    / [\u002A-\u002B]
    / [\u002D-\u002E]
    / [\u0030-\u003B]
    / "\u003D"
    / [\u003F-\u005A]
    / [\u005E-\u007A]
    / "\u007C"
    / "\u007E"

pathCharacter
  = headPathCharacter / "\\" / "/"

fileRaw
  = ("/" headPathCharacter pathCharacter*
  / "./" chars:pathCharacter*
  / "../" pathCharacter*
  / "~/"  pathCharacter*) { return text(); }

file
  = a:fileRaw whitespace { return a; }

scheme =
  "http" "s"?

httpRaw =
    scheme "://" authority pathAbempty ("?" query)? ("#" fragment)?
    {
        return text();
    }

// NOTE: Backtrack if parsing the optional user info prefix fails
authority = (userinfo "@")? host (":" port)?

userinfo = ( unreserved / pctEncoded / subDelims / ":" )*

host = IPLiteral / IPv4address / regName

port = DIGIT*

IPLiteral = "[" ( /* IPv6address  / */ IPvFuture  ) "]"

IPvFuture = "v" HEXDIG* "." ( unreserved / subDelims / ":" )+

// TODO
// IPv6address

// h16 = 1*4HEXDIG

// ls32 = ( h16 ":" h16 ) / IPv4address

IPv4address = decOctet "." decOctet "." decOctet "." decOctet

// NOTE: Backtrack when parsing these alternatives and try them in reverse order
// TODO
decOctet = DIGIT
//          / %x31-39 DIGIT      ; 10-99
//          / "1" 2DIGIT         ; 100-199
//          / "2" %x30-34 DIGIT  ; 200-249
//          / "25" %x30-35       ; 250-255

regName = ( unreserved / pctEncoded / subDelims )*

pathAbempty = ( "/" segment )*

segment = pchar*

pchar = unreserved / pctEncoded / subDelims / ":" / "@"

query = ( pchar / "/" / "?" )*

fragment = ( pchar / "/" / "?" )*

pctEncoded = "%" HEXDIG HEXDIG

unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"

subDelims = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="

http
    = a:httpRaw whitespace h:(using h:pathHashed { return h; })? {
        return {
            url: a,
            headers: h
        };
    }

env
  = "env:"
    e:( (  bashEnvironmentVariable / '"' posixEnvironmentVariable '"' ) { return text(); } )
    whitespace { return e; }

bashEnvironmentVariable
  = (ALPHA / "_") (ALPHA / DIGIT / "_")*

posixEnvironmentVariable
  = posixEnvironmentVariableCharacter+

posixEnvironmentVariableCharacter
  =   "\u005C"
      ( "\u0022"
      / "\u005C"
      / "\u0061"
      / "\u0062"
      / "\u0066"
      / "\u006E"
      / "\u0072"
      / "\u0074"
      / "\u0076"
      )
    / [\u0020-\u0021]
    / [\u0023-\u003C]
    / [\u003E-\u005B]
    / [\u005D-\u007E]

pathType
  = p:file { return { type: "file", path: p } }
  / u:http { return { type: "http", req: u } }
  / e:env  { return { type: "env", env: e } }

hash
  = "sha256:" digits:HEXDIG* & { return digits.length() == 64; }

pathHashed
  = p:pathType h:hash? {
      p.hash = h;
      return p;
  }

import
  = p:pathHashed t:(as Text)?
    {
      p.asText = t ? true : false;
      return {
          type: 'Import',
          import: p
      };
    }

expression
  = lambda openParens a:label colon b:expression closeParens arrow c:expression
    {
      return {
          type: "Lambda",
          "var": a,
          varType: b,
          body: c
      };
    }
  / if a:expression then b:expression else c:expression
    {
      return {
        type: 'BoolIf',
        predicate: a,
        true: b,
        false: c
      }
    }
  / let a:label b:(colon t:expression { return t; })? equal c:expression in d:expression
    {
      return {
          type: "Let",
          label: a,
          varType: b,
          val: c,
          body: d
      }
    }
  / forall openParens a:label colon b:expression closeParens arrow c:expression
    {
      return {
          type: "Forall",
          name: a,
          a: b,
          b: c
      }
    }
  / a:operatorExpression arrow b:expression {
      return {
          type: 'Forall',
          name: null,
          a: a,
          b: b
      }
  }
  / annotatedExpression

annotatedExpression
  = merge a:selectorExpression b:selectorExpression (colon applicationExpression)?
    {
      return {
        type: "Merge",
        args: [a, b]
      }
    }
  / openBracket a:(emptyCollection / nonEmptyOptional) { return a; }
  / a:operatorExpression t:(colon t:expression { return t; })?
    {
      if (t) {
        return {
          node: "annotate",
          expr: a,
          type: t
        }
      } else {
        return a;
      }
    }

emptyCollection
  = closeBracket colon t:(List / Optional) selectorExpression {
      if (t.type == 'List') {
        return {
            type: 'ListLit',
            list: []
        }
      } else {
          return {
              type: 'OptionalLit',
              value: null
          }
      }
    }

nonEmptyOptional
  = a:expression closeBracket colon Optional selectorExpression {
      return {
          type: 'OptionalLit',
          value: a
      }
  }

operatorExpression
  = orExpression

orExpression
  = a:plusExpression args:(or plusExpression)* {
      return operatorPostProcess('BoolOr', a, args);
    }

plusExpression
  = a:textAppendExpression args:(plus textAppendExpression)* {
      return operatorPostProcess('NaturalPlus', a, args);
    }

textAppendExpression
  = a:listAppendExpression args:(textAppend listAppendExpression)* {
      return operatorPostProcess('TextAppend', a, args);
    }

listAppendExpression
  = a:andExpression args:(listAppend andExpression)* {
      return operatorPostProcess('ListAppend', a, args);
    }

andExpression
  = a:combineExpression args:(and combineExpression)* {
      return operatorPostProcess('BoolAnd', a, args);
    }

combineExpression
  = a:preferExpression args:(combine preferExpression)* {
      return operatorPostProcess('Combine', a, args);
    }

preferExpression
  = a:timesExpression args:(prefer timesExpression)* {
      return operatorPostProcess('Prefer', a, args);
    }

timesExpression
  = a:equalExpression args:(times equalExpression)* {
      return operatorPostProcess('NaturalTimes', a, args);
    }

equalExpression
  = a:notEqualExpression args:(doubleEqual notEqualExpression)* {
      return operatorPostProcess('BoolEQ', a, args);
    }

notEqualExpression
  = a:applicationExpression args:(notEqual applicationExpression)* {
      return operatorPostProcess('BoolNE', a, args);
    }

applicationExpression
  = c:constructors? args:selectorExpression+ {
      var body = args.reduce(
          function (a, b) {
              return {
                  type: 'App',
                  a: a,
                  b: b
              }
          }
      );

      if (c) {
        return {
          node: 'constructors',
          expr: body
        }
      }
      else {
        return body
      }
    }

selectorExpression
  = e:primitiveExpression path:(dot l:label { return l; })* {
      return [e].concat(path).reduce(function(a, b) {
      	return {
          type: 'Field',
          expr: a,
          field: b
        }
      });
    }

primitiveExpression
  = doubleLiteral
  / naturalLiteral
  / integerLiteral
  / textLiteral
  / openBrace a:recordTypeOrLiteral closeBrace { return a; }
  / openAngle a:unionTypeOrLiteral closeAngle { return a; }
  / nonEmptyListLiteral
  / import
  / a:identifier
  {
    return { type: "Var", "var": a }
  }
  / NaturalFold
  / NaturalBuild
  / NaturalIsZero
  / NaturalEven
  / NaturalOdd
  / NaturalToInteger
  / NaturalShow
  / IntegerShow
  / DoubleShow
  / ListBuild
  / ListFold
  / ListLength
  / ListHead
  / ListLast
  / ListIndexed
  / ListReverse
  / OptionalFold
  / OptionalBuild
  / Bool
  / Optional
  / Natural
  / Integer
  / Double
  / Text
  / List
  / True
  / False
  / Type
  / Kind
  / openParens a:expression closeParens { return a; }

recordTypeOrLiteral
  = equal { return { type: 'RecordLit', fields: {} } }
  / nonEmptyRecordTypeOrLiteral
  / "" { return { type: 'Record', fields: {} } }

nonEmptyRecordTypeOrLiteral
  = k:label v:(nonEmptyRecordLiteral / nonEmptyRecordType)
    {
      var fields = v[1]
      fields[k] = v[0];
      return {
          type: v[2],
          fields: fields
      };
    }

nonEmptyRecordType
  = colon a:expression b:(comma k:label colon t:expression { var fields = {}; fields[k] = t; return fields; })*
    {
        var fields = {};
        b.forEach(function (item){
            var key = Object.keys(item)[0];
            fields[key] = item[key];
        });
        return [a, fields, 'Record']
    }

nonEmptyRecordLiteral
  = equal a:expression b:(comma k:label equal v:expression { var fields = {}; fields[k] = v; return fields; })*
    {
        var fields = {};
        b.forEach(function (item){
            var key = Object.keys(item)[0];
            fields[key] = item[key];
        });
        return [a, fields, 'RecordLit']
    }

unionTypeOrLiteral
  = nonEmptyUnionTypeOrLiteral / "" { return { type: 'Union', alts: [] } }

nonEmptyUnionTypeOrLiteral
  = l:label equal a:expression alts:(bar k:label colon v:expression { var fields = {}; fields[k] = v; return fields; })*
    {
      return {
          type: 'UnionLit',
          choice: {
              name: l,
              expr: a
          },
          alts: catObjects(alts)
      }
  }
  / l:label colon v:expression alts:(bar nonEmptyUnionTypeOrLiteral / "") {
      // TODO
      alts = {};
      alts[l] = v;
      return {
          type: 'Union',
          alts: alts
      }
  }

nonEmptyListLiteral
  = openBracket a:expression b:(comma c:expression { return c; })* closeBracket {
      return {
          type: 'ListLit',
          list: [a].concat(b)
      }
  }

reserved
  = "if" / "then" / "else" / "let" / "in" / "as" / "using" / "merge" / "constructors" / "Natural/fold" / "Natural/build" / "Natural/isZero" / "Natural/even" / "Natural/odd" / "Natural/toInteger" / "Natural/show" / "Integer/show" / "Double/show" / "List/build" / "List/fold" / "List/length" / "List/head" / "List/last" / "List/indexed" / "List/reverse" / "Optional/fold" / "Optional/build" / "Bool" / "Optional" / "Natural" / "Integer" / "Double" / "Text" / "List" / "True" / "False" / "Type" / "Kind"

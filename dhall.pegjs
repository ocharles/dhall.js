{
  function operatorPostProcess(node, a, args) {
    if (args.length) {
      return {
        node: node
      };
    } else {
      return a;
    } 
  }
}

completeExpression
  = whitespace e:expression { return e; }

endOfLine
  = "\u000A" / "\u000D" "\u000A"

tab
  = "\u0009"

blockComment
  = "{-" blockCommentContinue

blockCommentChunk
  = blockComment
  / [\u0020-\uFFFF]
  / tab
  / endOfLine

blockCommentContinue
  = "-}" / blockCommentChunk blockCommentContinue

notEndOfLine
  = [\u0020-\uFFFF]
  / tab

lineComment
  = "--" notEndOfLine* endOfLine

whitespaceChunk
  = [ ]
  / tab
  / endOfLine
  / lineComment
  / blockComment

whitespace
  = whitespaceChunk*

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
  = ("`" quotedLabel "`" / l:simpleLabel) whitespace

// TODO
doubleQuoteChunk
  =
      "${" expression "}"
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
  = "\"" doubleQuoteChunk* "\""

singleQuoteContinue =
      "'''"               singleQuoteContinue
    / "${" expression "}" singleQuoteContinue
    / "''${"              singleQuoteContinue
    / "''"
    / [\u0020-\uFFFF]     singleQuoteContinue
    / tab                 singleQuoteContinue
    / endOfLine           singleQuoteContinue

singleQuoteLiteral = "''" singleQuoteContinue

textLiteral
  = (doubleQuoteLiteral / singleQuoteLiteral) whitespace

if                =   "if"               whitespace
then              =   "then"             whitespace
else              =   "else"             whitespace
let               =   "let"              whitespace
in                =   "in"               whitespace
as                = a:"as"               whitespace { return { node: ''}}
using             = a:"using"            whitespace { return { node: ''}}
merge             = a:"merge"            whitespace { return { node: ''}}
constructors      = a:"constructors"     whitespace { return { node: ''}}
NaturalFold       = a:"Natural/fold"     whitespace { return { node: 'Natural/fold' }; }
NaturalBuild      = a:"Natural/build"    whitespace { return { node: 'Natural/build' }; }
NaturalIsZero     = a:"Natural/isZero"   whitespace { return { node: 'Natural/isZero' }; }
NaturalEven       = a:"Natural/even"     whitespace { return { node: 'Natural/even' }; }
NaturalOdd        = a:"Natural/odd"      whitespace { return { node: 'Natural/odd' }; }
NaturalToInteger  = a:"Natural/toInteger"whitespace { return { node: 'Natural/toInteger' }; }
NaturalShow       = a:"Natural/show"     whitespace { return { node: 'Natural/show' }; }
IntegerShow       = a:"Integer/show"     whitespace { return { node: 'Integer/show' }; }
DoubleShow        = a:"Double/show"      whitespace { return { node: 'Double/show' }; }
ListBuild         = a:"List/build"       whitespace { return { node: 'List/build' }; }
ListFold          = a:"List/fold"        whitespace { return { node: 'List/fold' }; }
ListLength        = a:"List/length"      whitespace { return { node: 'List/length' }; }
ListHead          = a:"List/head"        whitespace { return { node: 'List/head' }; }
ListLast          = a:"List/last"        whitespace { return { node: 'List/last' }; }
ListIndexed       = a:"List/indexed"     whitespace { return { node: 'List/indexed' }; }
ListReverse       = a:"List/reverse"     whitespace { return { node: 'List/reverse' }; }
OptionalFold      = a:"Optional/fold"    whitespace { return { node: 'Optional/fold' }; }
OptionalBuild     = a:"Optional/build"   whitespace { return { node: 'Optional/build' }; }
Bool              = a:"Bool"             whitespace { return { node: 'Bool' }; }
Optional          = a:"Optional"         whitespace { return { node: 'Optional' }; }
Natural           = a:"Natural"          whitespace { return { node: 'Natural' }; }
Integer           = a:"Integer"          whitespace { return { node: 'Integer' }; }
Double            = a:"Double"           whitespace { return { node: 'Double' }; }
Text              = a:"Text"             whitespace { return { node: 'Text' }; }
List              = a:"List"             whitespace { return { node: 'List' }; }
True              = a:"True"             whitespace { return { node: 'True' }; }
False             = a:"False"            whitespace { return { node: 'False' }; }
Type              = a:"Type"             whitespace { return { node: 'Type' }; }
Kind              = a:"Kind"             whitespace { return { node: 'Kind' }; }

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
  = "-"? DIGIT+ ("." DIGIT+ exponent? / exponent) whitespace

naturalRaw
  = digits:DIGIT+ {
      return digits.join('');
  }

integerLiteral
  = "-"? a:naturalRaw whitespace {
      return {
          node: 'IntegerLit',
          integer: a
      }
  }

naturalLiteral
  = "+" naturalRaw whitespace

identifier
  = label (at naturalRaw)? whitespace

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
  = "/" headPathCharacter pathCharacter*
  / "./" chars:pathCharacter* { return "./" + chars.join(''); }
  / "../" pathCharacter*
  / "~/"  pathCharacter*

file
  = a:fileRaw whitespace { return a; }

scheme =
  "http" "s"?

httpRaw = scheme "://" authority pathAbempty ("?" query)? ("#" fragment)?

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

http = httpRaw whitespace (using pathHashed)?

env
  = "env:"
  ( bashEnvironmentVariable
  / '"' posixEnvironmentVariable '"'
  ) whitespace

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
  / http
  / env

hash
  = "sha256:" digits:HEXDIG* & { return digits.length() == 64; }

pathHashed
  = p:pathType h:hash? { p.hash = h; return p; }

import
  = p:pathHashed t:(as Text)?
    {
      p.asText = t ? true : false;
      return p;
    }

expression
  = lambda openParens a:label colon b:expression closeParens arrow c:expression
    {
      return {
        type: "Lambda",
        args: [ a, b, c ]
      };
    }
  / if a:expression then b:expression else c:expression
    {
      return {
        node: 'if',
        predicate: a,
        true: b,
        false: c
      }
    }
  / let a:label b:(colon t:expression { return t; })? equal c:expression in d:expression
    {
      return {
        type: "Let",
        args: [a, b, c,d]
      }
    }
  / forall openParens a:label colon b:expression closeParens arrow c:expression
    {
      return {
        type: "Forall",
        args: [a, b, c]
      }
    }
  / operatorExpression arrow expression
  / annotatedExpression

annotatedExpression
  = merge a:selectorExpression b:selectorExpression (colon applicationExpression)?
    {
      return {
        type: "Merge",
        args: [a, b]
      }
    }
  / openBracket (emptyCollection / nonEmptyOptional)
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
  = closeBracket colon (List / Optional) selectorExpression

nonEmptyOptional
  = expression closeBracket colon Optional selectorExpression

operatorExpression
  = orExpression

orExpression
  = a:plusExpression args:(or plusExpression)* {
      return operatorPostProcess('BoolOr', a, args);
    }

plusExpression
  = a:textAppendExpression args:(plus listAppendExpression)* {
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
      if (c) {
        return {
          node: 'constructors',
          expr: args[0] // TODO
        } 
      }
      else {
        return args[0]; // TODO
      }
    }

selectorExpression
  = e:primitiveExpression path:(dot label)* {
      if (path.length) {
          // TODO
      }   
      else {
          return e;
      }
    }

primitiveExpression
  = doubleLiteral
  / naturalLiteral
  / integerLiteral
  / textLiteral
  / openBrace a:recordTypeOrLiteral closeBrace
    {
      return {
        type: "Record",
        fields: a
      }
    }
  / openAngle unionTypeOrLiteral closeAngle
  / nonEmptyListLiteral
  / import
  / a:identifier
  {
    return { type: "Var", args: [ a ] }
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
  = equal { return {} }
  / nonEmptyRecordTypeOrLiteral
  / ""

nonEmptyRecordTypeOrLiteral
  = k:label v:(nonEmptyRecordLiteral / nonEmptyRecordType)
    {
      var fields = {}
      fields[k] = v[0];
      return fields;
    }

nonEmptyRecordType
  = colon expression (comma expression)*

nonEmptyRecordLiteral
  = equal a:expression b:(comma label equal expression)*
    {
      return [a, b]
    }

unionTypeOrLiteral
  = nonEmptyUnionTypeOrLiteral / ""

nonEmptyUnionTypeOrLiteral
  = label
  ( equal expression (bar label colon expression)*
  / colon expression (bar nonEmptyUnionTypeOrLiteral / "")
  )

nonEmptyListLiteral
  = openBracket expression (comma expression)* closeBracket

reserved
  = "if" / "then" / "else" / "let" / "in" / "as" / "using" / "merge" / "constructors" / "Natural/fold" / "Natural/build" / "Natural/isZero" / "Natural/even" / "Natural/odd" / "Natural/toInteger" / "Natural/show" / "Integer/show" / "Double/show" / "List/build" / "List/fold" / "List/length" / "List/head" / "List/last" / "List/indexed" / "List/reverse" / "Optional/fold" / "Optional/build" / "Bool" / "Optional" / "Natural" / "Integer" / "Double" / "Text" / "List" / "True" / "False" / "Type" / "Kind"

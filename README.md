# `dhall.js`

`dhall.js` allows you to work with [Dhall](https://github.com/dhall-lang)
expressions in JavaScript.

Currently, we are just working on a parser using [PEG.js](https://pegjs.org/).


# Does it have to be written in JavaScript?

No, of course not! The goal is simply to produce a JavaScript library. I mostly
wanted a chance to play with PEG.js, but the result of that parser should be
usable with anything that supports calling "foreign" JavaScript code. Maybe the
rest of the project could be written in PureScript, TypeScript, Reason,
whatever - I have no preference.

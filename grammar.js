module.exports = grammar({
  name: 'peg',

  conflicts: $ => [
    [$._sequence]
  ],

  rules: {
    grammar: $ =>
      repeat1(
        choice(
          $.action,
          $.definition,
          $.comment
        )
      ),
    comment: $ => seq('//', /.*/, /\n/),
    definition: $ =>
      seq(
        field('identifier', $.identifier),
        field('explaination', optional(
          alias($.literal, $.name)
        )),
        choice(
          '<-',
          '=',
        ),
        $.expression
      ),
    expression: $ =>
      seq(
        $._sequence,
        repeat(
          seq(
            '/',
            $._sequence
          )
        )
      ),
    _sequence: $ =>
      seq(
        repeat1(
          $.term
        ),
        optional(
          $.action
        )
      ),
    alias: $ =>
      seq(
        optional(
          seq(
            $.identifier,
            ':'
          )
        ),
        $.primary
      ),
    term: $ =>
      seq(
        optional(field('prefix', $.prefix)),
        field('primary', $.alias),
        optional(field('suffix', $.suffix))
      ),
    prefix: $ =>
      choice(
        '&',
        '!'
      ),
    suffix: $ =>
      choice(
        '?',
        '*',
        '+'
      ),
    primary: $ =>
      choice(
        seq(
          '(',
          $.e,
          ')'
        ),
        $.identifier,
        $.literal,
        $.class,
        '.'
      ),
    e: $ =>
      seq(
        repeat1(
          $.term
        ),
        repeat(
          seq(
            '/',
            repeat1(
              $.term
            )
          )
        )
      ),
    identifier: $ =>
      /[a-zA-Z_][a-zA-Z_0-9]*/,
    literal: $ =>
      seq(
        choice(
          $._sq_string_literal,
          $._dq_string_literal
        ),
        optional('i')
      ),
    _sq_string_literal: $ =>
      seq(
        /[']/,
        repeat(/[^']/),
        /[']/
      ),
    _dq_string_literal: $ =>
      seq(
        '"',
        repeat(/[^"]/),
        '"'
      ),
    class: $ =>
      seq(
        '[',
        $._range,
        ']',
        optional('i')
      ),
    _range: $ =>
      choice(
        repeat1(
          seq(
            $._char,
            '-',
            $._char
          )
        ),
        repeat1(
          $._char
        )
      ),
    _char: $ =>
      choice(
        $.escape,
        seq(
          /./
        )
      ),
    escape: $ =>
      choice(
        /\\a/,
        /\\]/,
        /\\b/,
        /\\\\/
      ),
    code_block: $ =>
      seq(
        $._code
      ),
    action: $ =>
      seq(
        '{',
        repeat(
          $._code
        ),
        '}'
      ),
    _code: $ =>
      choice(
        /[^{}]/,
        seq(
          '{',
          repeat(
            $._code
          ),
          '}'
        )
      )
  }
})

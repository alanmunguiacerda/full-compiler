const fs = require('fs');
const Lexer = require('lex');

const ErrorManager = require('./errorManager');
const {
    addRules,
    NEWLN,
    SPACE,
    LINE_COM,
    BLOCK_COM,
    RES_WORDS,
    RES_WORD,
    RE_NEWLN,
    TKN_EOF,
} = require('./tokenPatterns');

class LexAnalyzer {
    constructor(filePath) {
        this.lexer = new Lexer((chr) => {
            ErrorManager.lex(
                this.row,
                this.col,
                `Invalid token ${chr}`
            );
            this.col += 1;
            return null;
        });
        this.setLexRules();
        this.setFile(filePath);
        this.col = 1;
        this.row = 1;
        this.tokens = [];
        this.repeatNext = 0;
        this.ignoredTokens = [NEWLN, SPACE, LINE_COM, BLOCK_COM];
    }

    setLexRules() {
        const instance = this;

        this.lexer.addRule(RE_NEWLN, () => {
            this.reject = true;
            instance.row += 1;
            instance.col = 1;
        });

        addRules(this.lexer);
    }

    setFile(filePath) {
        const file = fs.readFileSync(filePath, 'utf8');
        this.lexer.setInput(file);
    }

    next() {
        if (this.repeatNext) {
            const current = this.current(this.repeatNext);
            this.repeatNext -= 1;
            return current;
        }

        if (this.lexer.index >= this.lexer.input.length) {
            return null;
        }

        while (this.lexer.index < this.lexer.input.length) {
            const current = this.lexer.lex();

            if (!current) {
                continue;
            }

            let token = current.token;
            const lexeme = current.lexeme;

            if (RES_WORDS.indexOf(lexeme) > -1) {
                token = RES_WORD;
            }

            const currentRow = this.row;
            const currentCol = this.col;
            this.col += current.lexeme.length;

            if (token === BLOCK_COM) {
                this.row += lexeme.split('\n').length - 1;
            }

            if (this.ignoredTokens.indexOf(token) < 0) {
                this.tokens.push([
                    token,
                    lexeme,
                    currentRow,
                    currentCol,
                ]);
                return this.current();
            }
        }
        this.tokens.push([
            TKN_EOF,
            '$$$$$$$',
            -1,
            -1,
        ]);

        return this.current();
    }

    back(i = 1) {
        this.repeatNext = i;
    }

    current(i = 1) {
        return this.tokens[this.tokens.length - i];
    }
}

module.exports = LexAnalyzer;

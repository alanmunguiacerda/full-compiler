let errorCount = 0;
const MAX_ERRORS = 10;
const ERROR_TYPES = {
    lex: 'LEX ERROR',
    syn: 'SYNT ERROR',
    une: 'UNEX TOKEN',
    sem: 'SEM ERROR',
};

class ErrorManager {
    static genericError(type, row, col, message) {
        const errorType = ERROR_TYPES[type];
        console.log(`[${row}, ${col}] [${errorType}] ${message}`);
        errorCount += 1;
        ErrorManager.raiseError();
    }

    static lex(row, col, message) {
        ErrorManager.genericError('lex', row, col, message);
    }

    static syn(row, col, expected, got) {
        const message = `Expected <${expected}> got <${got}>`;
        ErrorManager.genericError('syn', row, col, message);
    }

    static une(row, col, got) {
        const message = `Unexpected token <${got}>`;
        ErrorManager.genericError('une', row, col, message);
    }

    static sem(row, col, message) {
        ErrorManager.genericError('sem', row, col, message);
    }

    static raiseError() {
        if (errorCount >= MAX_ERRORS) {
            process.exit();
        }
    }

    static abort() {
        process.exit();
    }
}

module.exports = ErrorManager;

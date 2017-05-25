let errorCount = 0;
const MAX_ERRORS = 10;
const ERROR_TYPES = {
    lex: 'LEX ERROR',
    syn: 'SYNT ERROR',
    une: 'UNEX TOKEN',
    sem: 'SEM ERROR',
};
const errors = [];
const error = (row, col, message) => ({ row, col, message });

class ErrorManager {
    static get length() {
        return errors.length;
    }

    static genericError(type, row, col, message) {
        const errorType = ERROR_TYPES[type];
        message = `[${row}, ${col}] [${errorType}] ${message}`;
        errors.push(error(row, col, message))
        errorCount += 1;
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

    static logErrors() {
        const sorted = errors.sort((e1, e2) => {
            if (e1.row === e2.row) {
                return e1.col > e2.col ? 1 : -1;
            }
            return e1.row > e2.row ? 1 : -1;
        })
        if (sorted.length) {
            console.log('--------------------Errors--------------------');
        }
        sorted.slice(0, MAX_ERRORS).forEach((e) => console.log(e.message));
    }
}

module.exports = ErrorManager;

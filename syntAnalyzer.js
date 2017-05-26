const {
    FLOAT,
    INT,
    ASSIGN,
    CT_LOG,
    CT_ALF,
    OP_REL,
    IDENTI,
    RES_WORD,
    TKN_EOF,
} = require('./tokenPatterns');
const ErrorManager = require('./errorManager');
const VariableDeclarator = require('./variableDeclarator');
const Identifier = require('./identifier');
const Declaration = require('./declaration');
const FunctionDefinition = require('./functionDefinition');
const DataType = require('./dataType');
const Parameter = require('./parameter');
const IfStatement = require('./ifStatement');
const WhileStatement = require('./whileStatement');
const ForStatement = require('./forStatement');
const BinaryExpression = require('./binaryExpression');
const UnaryExpression = require('./unaryExpression');
const Integer = require('./dataInteger');
const Float = require('./dataFloat');
const TString = require('./dataString');
const Bool = require('./dataBool');
const FunctionCall = require('./functionCall');
const ReturnStatement = require('./returnStatement');
const ContinueStatement = require('./continueStatement');
const BreakStatement = require('./breakStatement');
const SwitchStatement = require('./switchStatement');
const CaseStatement = require('./caseStatement');
const Print = require('./print');
const Printnl = require('./printnl');
const Read = require('./read');

const DATA_TYPES_TOKENS = [
    FLOAT,
    INT,
    CT_LOG,
    CT_ALF,
];

const RES_TYPES = [
    'entero',
    'decimal',
    'logico',
    'alfabetico',
];

const RES_FUNCS = {
    imprime: Print,
    imprimenl: Printnl,
    lee: Read,
};

class SyntAnalyzer {
    constructor(lexAnalyzer) {
        this.lexAnalyzer = lexAnalyzer;
    }

    analyze() {
        this.nToken();
        const tree = this.externalDeclaration();
        this.matchToken(TKN_EOF);

        return tree;
    }

    externalDeclaration() {
        let node = null;
        let type = null;

        if (this.lookahead[1] === 'programa') {
            const mainToken = this.lookahead;
            type = new DataType('void', mainToken);
            const identifier = new Identifier('main', mainToken);
            this.matchLexeme('programa');
            node = this.compoundStatement({ isMain: true });
            return new FunctionDefinition(type, identifier, null, node, mainToken);
        }

        const token = this.lookahead;
        if (token[1] === 'procedimiento') {
            this.matchToken(RES_WORD);
            type = new DataType('void', token);
            node = this.declaration(type, { isFunc: true });
        } else if (token[1] === 'constante') {
            this.matchToken(RES_WORD);
            type = this.typeEspecifier();
            node = this.constantDeclaration(type);
        } else if (RES_TYPES.indexOf(this.lookahead[1]) > -1) {
            type = this.typeEspecifier();
            let isFunc = false;
            if (this.lookahead[1] === 'funcion') {
                this.matchLexeme('funcion');
                isFunc = true;
            }
            node = this.declaration(type, { isFunc });
        } else {
            this.expected(`${RES_TYPES.join('|')}|constante`);
            this.nToken();
            return this.externalDeclaration();
        }

        if (node) {
            node.next = this.externalDeclaration();
        }

        return node;
    }

    constantDeclaration(type) {
        let declarator = null;
        let init = null;
        const cond = { isConstant: true, dimensions: 0, dimensionsSizes: [] };
        const dclrToken = this.lookahead;
        const identifier = new Identifier(this.lookahead[1], dclrToken);
        this.matchToken(IDENTI);
        const assignToken = this.lookahead;
        this.matchToken(ASSIGN);
        init = this.unaryExpression({ isConstant: true });
        declarator = new VariableDeclarator(identifier, init, assignToken, cond);
        this.matchLexeme(';');

        return new Declaration(type, declarator, dclrToken);
    }

    declaration(type, cond = {}) {
        if (!cond.isFunc) {
            const funcToken = this.lookahead;
            const declarator = this.declaratorList();
            this.matchLexeme(';');

            return new Declaration(type, declarator, funcToken);
        }

        return this.functionDefinition(type);
    }

    declaratorList() {
        const node = this.declarator();

        if (this.lookahead[1] === ',') {
            this.matchLexeme(',');
            node.next = this.declaratorList();
        }

        return node;
    }

    declarator() {
        const idToken = this.lookahead;
        const identifier = new Identifier(idToken[1], idToken);
        this.matchToken(IDENTI);

        const arrayCond = this.arrayDefinition();

        let init = null;

        if (this.lookahead[0] === ASSIGN) {
            if (arrayCond.dimensions) {
                this.expected(';');
            }
            this.matchToken(ASSIGN);
            init = this.logicalOrExpression();
        }

        return new VariableDeclarator(identifier, init, idToken, arrayCond);
    }

    arrayDefinition() {
        let dimensions = 0;
        const dimensionsSizes = [];

        while (this.lookahead[1] === '[') {
            dimensions += 1;
            this.matchLexeme('[');
            if (this.lookahead[0] === INT || this.lookahead[0] === IDENTI) {
                dimensionsSizes.push(this.primaryExpression());
            } else {
                this.expected('<entero|constante>');
            }
            this.matchLexeme(']');
        }

        return { dimensions, dimensionsSizes };
    }

    arrayAccess() {
        let dimensions = 0;
        const accessExpressions = [];

        while (this.lookahead[1] === '[') {
            dimensions += 1;
            this.matchLexeme('[');
            accessExpressions.push(this.logicalOrExpression());
            this.matchLexeme(']');
        }

        return { dimensions, accessExpressions };
    }

    functionDefinition(type) {
        const funcToken = this.lookahead;
        const identifier = new Identifier(this.lookahead[1], funcToken);
        this.matchToken(IDENTI);

        this.matchLexeme('(');
        const param = this.parameterList();
        this.matchLexeme(')');

        let aux = null;
        let variables = null;
        if (this.lookahead[1] !== 'inicio') {
            let varType = this.typeEspecifier();
            variables = this.declaration(varType);
            aux = variables;
            while (this.lookahead[1] !== 'inicio') {
                if (aux) {
                    varType = this.typeEspecifier();
                    aux.next = this.declaration(varType);
                    aux = aux.next;
                }
            }
        }

        if (this.lookahead[1] === 'inicio') {
            let statement = this.compoundStatement();
            if (aux) {
                aux.next = statement;
                statement = variables;
            }
            return new FunctionDefinition(type, identifier, param, statement, funcToken);
        }

        this.expected('<function|procedure> body');
        return null;
    }

    typeEspecifier() {
        const node = new DataType(this.lookahead[1], this.lookahead);
        this.matchLexeme(RES_TYPES);
        return node;
    }

    parameterList() {
        if (RES_TYPES.indexOf(this.lookahead[1]) < 0) {
            return null;
        }

        let node = null;
        let aux = null;

        let paramToken = this.lookahead;
        let type = this.typeEspecifier();
        let id = new Identifier(this.lookahead[1], this.lookahead);

        this.matchToken(IDENTI);

        node = new Parameter(type, id, paramToken);
        aux = node;

        while (this.lookahead[1] === ',') {
            this.matchLexeme(',');
            paramToken = this.lookahead;
            type = this.typeEspecifier();
            id = new Identifier(this.lookahead[1], this.lookahead);
            this.matchToken(IDENTI);

            aux.next = new Parameter(type, id, paramToken);
            aux = aux.next;
        }

        return node;
    }

    statement() {
        if (this.lookahead[1] === 'si') {
            let expr = null;
            let stm = null;
            let elseStm = null;

            const ifToken = this.lookahead;
            this.matchLexeme('si');
            this.matchLexeme('(');
            expr = this.logicalOrExpression();
            this.matchLexeme(')');
            stm = this.statement();
            elseStm = this.elseStatement();

            return new IfStatement(expr, stm, elseStm, ifToken);
        }

        if (this.lookahead[1] === 'haz') {
            let expr = null;
            const switchToken = this.lookahead;
            this.matchLexeme('haz');
            this.matchLexeme('opcion');
            this.matchLexeme('(');
            expr = this.logicalOrExpression();
            this.matchLexeme(')');
            const stms = this.statement();
            return new SwitchStatement(expr, stms, switchToken);
        }

        if (this.lookahead[1] === 'caso') {
            const caseToken = this.lookahead;
            this.matchLexeme('caso');
            if (DATA_TYPES_TOKENS.indexOf(this.lookahead[0]) < 0) {
                this.matchLexeme('[Constant value]');
            }
            const expr = this.primaryExpression();
            this.matchLexeme(':');
            const stms = this.statement();
            return new CaseStatement(expr, stms, caseToken);
        }

        if (this.lookahead[1] === 'otro') {
            const defaultToken = this.lookahead;
            this.matchLexeme('otro');
            this.matchLexeme('caso');
            this.matchLexeme(':');
            const stms = this.statement();
            return new CaseStatement(null, stms, defaultToken);
        }

        if (this.lookahead[1] === 'iterar') {
            const whileToken = this.lookahead;
            let expr = null;
            let stm = null;

            this.matchLexeme('iterar');
            this.matchLexeme('mientras');
            this.matchLexeme('(');
            expr = this.logicalOrExpression();
            this.matchLexeme(')');
            stm = this.statement();

            return new WhileStatement(expr, stm, whileToken);
        }

        if (this.lookahead[1] === 'para') {
            let id = null;
            let initializer = null;
            let initialValue = null;
            let stopCondition = null;
            let condition = null;
            let step = null;
            let stm = null;

            const forToken = this.lookahead;
            this.matchLexeme('para');
            id = new Identifier(this.lookahead[1], this.lookahead);
            this.matchToken(IDENTI);
            this.matchLexeme('en');
            this.matchLexeme('rango');
            initialValue = this.logicalOrExpression();
            initializer = new BinaryExpression(':=', id, initialValue, this.lookahead);
            this.matchLexeme('a');
            stopCondition = this.logicalOrExpression();
            const op = this.lookahead[1] === 'decr' ? '>=' : '<=';
            condition = new BinaryExpression(op, id, stopCondition, this.lookahead);
            if (
                this.lookahead[1] === 'incr'
                || this.lookahead[1] === 'decr'
            ) {
                const tok = this.lookahead;
                this.matchToken(RES_WORD);
                const opStep = tok[1] === 'decr' ? '-' : '+';
                const obStep = new BinaryExpression(opStep, id, this.logicalOrExpression(), tok);
                step = new BinaryExpression(':=', id, obStep, tok);
            } else {
                const defStep = new Integer(1, this.lookahead);
                const sumStep = new BinaryExpression('+', id, defStep, this.lookahead);
                step = new BinaryExpression(':=', id, sumStep, this.lookahead);
            }
            stm = this.statement();

            return new ForStatement(initializer, condition, step, stm, forToken);
        }

        if (this.lookahead[1] === 'regresa') {
            const returnToken = this.lookahead;
            let expr = null;

            this.matchLexeme('regresa');
            if (this.lookahead[1] !== ';') {
                expr = this.logicalOrExpression();
            }
            this.matchLexeme(';');

            return new ReturnStatement(expr, returnToken);
        }

        if (this.lookahead[1] === 'continua') {
            const continueToken = this.lookahead;
            this.matchLexeme('continua');
            this.matchLexeme(';');

            return new ContinueStatement(continueToken);
        }

        if (this.lookahead[1] === 'interrumpe') {
            const breakToken = this.lookahead;
            this.matchLexeme('interrumpe');
            this.matchLexeme(';');
            return new BreakStatement(breakToken);
        }

        if (this.lookahead[1] === 'inicio') {
            return this.compoundStatement();
        }

        const node = this.assignmentOrExpression();
        this.matchLexeme(';');

        return node;
    }

    compoundStatement(cond = {}) {
        let node = null;

        this.matchLexeme('inicio');
        node = this.statementList();
        this.matchLexeme('fin');
        if (!cond.isMain) {
            this.matchLexeme(';');
        } else {
            this.matchLexeme('programa');
            this.matchLexeme('.');
        }

        return node;
    }

    statementList() {
        let node = null;

        if (
            this.lookahead[1] === 'si'
            || this.lookahead[1] === 'iterar'
            || this.lookahead[1] === 'para'
            || this.lookahead[1] === 'regresa'
            || this.lookahead[1] === 'haz'
            || this.lookahead[1] === 'continua'
            || this.lookahead[1] === 'interrumpe'
            || this.lookahead[1] === 'caso'
            || this.lookahead[1] === 'otro'
            || this.lookahead[0] === IDENTI
            || RES_FUNCS[this.lookahead[1]]
        ) {
            node = this.statement();

            if (node) {
                node.next = this.statementList();
            }
        }

        return node;
    }

    elseStatement() {
        let node = null;
        if (this.lookahead[1] === 'sino') {
            this.matchLexeme('sino');
            node = this.statement();
        }

        return node;
    }

    assignmentOrExpression() {
        const nextTok = this.lexAnalyzer.next();
        let id = null;
        this.lexAnalyzer.back();
        if (this.lookahead[0] === IDENTI) {
            id = new Identifier(this.lookahead[1], this.lookahead);
        }

        if (nextTok[1] === '[') {
            this.matchToken(IDENTI);
            id.arrayAccess = this.arrayAccess();
        } else if (nextTok[0] === ASSIGN) {
            this.matchToken(IDENTI);
        }

        if (this.lookahead[0] === ASSIGN) {
            let aux = null;
            const symbolToken = this.lookahead;
            this.matchToken(ASSIGN);
            aux = this.logicalOrExpression();

            return new BinaryExpression(symbolToken[1], id, aux, symbolToken);
        }

        return this.logicalOrExpression();
    }

    logicalOrExpression() {
        let expr = null;
        let symbolToken = null;

        expr = this.logicalAndExpression();

        while (this.lookahead[1] === 'o') {
            symbolToken = this.lookahead;
            this.matchLexeme('o');

            expr = new BinaryExpression(
                symbolToken[1],
                expr,
                this.logicalAndExpression(),
                symbolToken
            );
        }

        return expr;
    }

    logicalAndExpression() {
        let expr = null;
        let symbolToken = null;

        expr = this.equalityExpression();

        while (this.lookahead[1] === 'y') {
            symbolToken = this.lookahead;
            this.matchLexeme('y');

            expr = new BinaryExpression(
                symbolToken[1],
                expr,
                this.equalityExpression(),
                symbolToken
            );
        }

        return expr;
    }

    equalityExpression() {
        let expr = null;
        let symbolToken = null;

        expr = this.relationalExpression();

        while (this.lookahead[1] === '=') {
            symbolToken = this.lookahead;
            this.matchLexeme('=');

            expr = new BinaryExpression(
                symbolToken[1],
                expr,
                this.relationalExpression(),
                symbolToken
            );
        }

        return expr;
    }

    relationalExpression() {
        let expr = null;
        let symbolToken = null;

        expr = this.additiveExpression();

        while (this.lookahead[0] === OP_REL) {
            symbolToken = this.lookahead;
            this.matchToken(OP_REL);

            expr = new BinaryExpression(
                symbolToken[1],
                expr,
                this.additiveExpression(),
                symbolToken
            );
        }

        return expr;
    }

    additiveExpression() {
        let expr = null;
        let symbolToken = null;

        expr = this.multiplicativeExpression();

        while (
            this.lookahead[1] === '+'
            || this.lookahead[1] === '-'
        ) {
            symbolToken = this.lookahead;
            this.matchLexeme(symbolToken[1]);

            expr = new BinaryExpression(
                symbolToken[1],
                expr,
                this.multiplicativeExpression(),
                symbolToken
            );
        }

        return expr;
    }

    multiplicativeExpression() {
        let expr = null;
        let symbolToken = null;

        expr = this.powExpression();

        while (
            this.lookahead[1] === '*'
            || this.lookahead[1] === '/'
            || this.lookahead[1] === '%'
        ) {
            symbolToken = this.lookahead;
            this.matchLexeme(symbolToken[1]);

            expr = new BinaryExpression(
                symbolToken[1],
                expr,
                this.powExpression(),
                symbolToken
            );
        }

        return expr;
    }

    powExpression() {
        let expr = null;
        let symbolToken = null;

        expr = this.unaryExpression();

        while (this.lookahead[1] === '^') {
            symbolToken = this.lookahead;
            this.matchLexeme(symbolToken[1]);

            expr = new BinaryExpression(
                symbolToken[1],
                expr,
                this.unaryExpression(),
                symbolToken
            );
        }

        return expr;
    }

    unaryExpression(cond) {
        if (
            this.lookahead[1] === '+'
            || this.lookahead[1] === '-'
        ) {
            const symbolToken = this.lookahead;
            this.matchLexeme(symbolToken[1]);

            return new UnaryExpression(
                symbolToken[1],
                this.unaryExpression(cond),
                symbolToken
            );
        }

        return this.primaryExpression(cond);
    }

    primaryExpression(cond = {}) {
        let expr = null;

        if (this.lookahead[0] === IDENTI && !cond.isConstant) {
            const id = new Identifier(this.lookahead[1], this.lookahead);
            this.matchToken(IDENTI);
            return this.functionCall(id);
        } else if (
            RES_FUNCS[this.lookahead[1]]
            && !cond.isConstant
        ) {
            return this.reservedFunctionCall();
        } else if (this.lookahead[0] === INT) {
            expr = new Integer(this.lookahead[1], this.lookahead);
            this.matchToken(INT);
        } else if (this.lookahead[0] === FLOAT) {
            expr = new Float(this.lookahead[1], this.lookahead);
            this.matchToken(FLOAT);
        } else if (this.lookahead[0] === CT_ALF) {
            expr = new TString(this.lookahead[1], this.lookahead);
            this.matchToken(CT_ALF);
        } else if (this.lookahead[0] === CT_LOG) {
            expr = new Bool(this.lookahead[1], this.lookahead);
            this.matchToken(CT_LOG);
        } else if (!cond.isConstant && this.lookahead[1] === '(') {
            this.matchLexeme('(');
            expr = this.logicalOrExpression();
            this.matchLexeme(')');
        } else {
            this.expected('expresión');
        }

        return expr;
    }

    functionCall(id) {
        if (this.lookahead[1] === '(') {
            const funcToken = this.lookahead;
            this.matchLexeme('(');
            const args = this.argumentList();
            this.matchLexeme(')');

            return new FunctionCall(id, args, funcToken);
        }

        id.arrayAccess = this.arrayAccess();
        return id;
    }

    reservedFunctionCall() {
        const idToken = this.lookahead;
        this.matchToken(RES_WORD);
        this.matchLexeme('(');
        const args = this.argumentList();
        this.matchLexeme(')');
        return new RES_FUNCS[idToken[1]](args, idToken);
    }

    argumentList() {
        let args = null;

        if (
            this.lookahead[1] === '+'
            || this.lookahead[1] === '-'
            || this.lookahead[1] === '('
            || this.lookahead[0] === INT
            || this.lookahead[0] === FLOAT
            || this.lookahead[0] === CT_LOG
            || this.lookahead[0] === CT_ALF
            || this.lookahead[0] === IDENTI
        ) {
            args = [];
            let param = this.logicalOrExpression();
            if (param) {
                args.push(param);
            }

            while (this.lookahead[1] === ',') {
                this.matchLexeme(',');
                param = this.logicalOrExpression();
                if (param) {
                    args.push(param);
                }
            }
        }

        return args;
    }

    nToken() {
        this.lookahead = this.lexAnalyzer.next();
    }

    expected(expected) {
        ErrorManager.syn(
            this.lookahead[2],
            this.lookahead[3],
            expected,
            this.lookahead[1]
        );
    }

    error(expected) {
        ErrorManager.syn(
            this.lookahead[2],
            this.lookahead[3],
            expected,
            this.lookahead[1]
        );
    }

    match(toMatch, value) {
        if (
            typeof toMatch === 'string'
            && value === toMatch
        ) {
            this.nToken();
            return;
        }

        if (toMatch.indexOf(value) > -1) {
            this.nToken();
            return;
        }

        this.error(toMatch);
    }

    matchToken(token) {
        this.match(token, this.lookahead[0]);
    }

    matchLexeme(lexeme) {
        this.match(lexeme, this.lookahead[1]);
    }
}

module.exports = SyntAnalyzer;

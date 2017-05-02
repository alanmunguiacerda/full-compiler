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
const TreeNode = require('./treeNode');
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

const RES_TYPES = [
    'entero',
    'decimal',
    'logico',
    'alfabetico',
];

const RES_FUNCS = [
    'imprime',
    'imprimenl',
    'lee',
];

class SyntAnalyzer {
    constructor(lexAnalyzer) {
        this.lexAnalyzer = lexAnalyzer;
    }

    analyze() {
        let tree = new TreeNode();

        this.nToken();
        tree = this.externalDeclaration();
        this.matchToken(TKN_EOF);

        return tree;
    }

    externalDeclaration() {
        let node = null;
        let type = null;

        if (this.lookahead[1] === 'programa') {
            this.matchLexeme('programa');
            type = new DataType('void');
            node = this.compoundStatement({ isMain: true });
            return node;
        }

        if (this.lookahead[1] === 'procedimiento') {
            this.matchToken(RES_WORD);
            type = new DataType('void');
            node = this.declaration(type, { isFunc: true });
        } else if (this.lookahead[1] === 'constante') {
            this.matchToken(RES_WORD);
            type = this.typeEspecifier();
            node = this.constantDeclaration(type);
        } else {
            type = this.typeEspecifier();
            let isFunc = false;
            if (this.lookahead[1] === 'funcion') {
                this.matchLexeme('funcion');
                isFunc = true;
            }
            node = this.declaration(type, { isFunc });
        }

        if (node) {
            node.next = this.externalDeclaration();
        }

        return node;
    }

    constantDeclaration(type) {
        let declarator = null;
        let init = null;

        const identifier = new Identifier(this.lookahead[1]);
        this.matchToken(IDENTI);
        this.matchToken(ASSIGN);
        init = this.unaryExpression({ isConstant: true });
        declarator = new VariableDeclarator(identifier, init);
        this.matchLexeme(';');

        return new Declaration(type, declarator);
    }

    declaration(type, cond = {}) {
        if (!cond.isFunc) {
            const declarator = this.declaratorList();
            this.matchLexeme(';');

            return new Declaration(type, declarator);
        }

        if (cond.isFunc) {
            return this.functionDefinition(type);
        }

        return null;
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
        const identifier = new Identifier(this.lookahead[1]);
        this.matchToken(IDENTI);

        const {
            dimensions,
            accessExpressions,
        } = this.arrayDefinition();

        let init = null;

        if (this.lookahead[0] === ASSIGN) {
            this.matchToken(ASSIGN);
            init = this.logicalOrExpression();
        }

        return new VariableDeclarator(identifier, init);
    }

    arrayDefinition() {
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
        const identifier = new Identifier(this.lookahead[1]);
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
            return new FunctionDefinition(type, identifier, param, statement);
        }

        this.expected('<function|procedure> body');
        return null;
    }

    typeEspecifier() {
        const node = new DataType(this.lookahead[1]);
        this.matchLexeme(RES_TYPES);
        return node;
    }

    parameterList() {
        if (RES_TYPES.indexOf(this.lookahead[1]) < 0) {
            return null;
        }

        let node = null;
        let aux = null;

        let type = this.typeEspecifier();
        let id = new Identifier(this.lookahead[0]);

        this.matchToken(IDENTI);

        node = new Parameter(type, id);
        aux = node;

        while (this.lookahead[1] === ',') {
            this.matchLexeme(',');
            type = this.typeEspecifier();
            id = new Identifier(this.lookahead[0]);
            this.matchToken(IDENTI);

            aux.next = new Parameter(type, id);
            aux = aux.next;
        }

        return node;
    }

    statement() {
        if (this.lookahead[1] === 'si') {
            let expr = null;
            let stm = null;
            let elseStm = null;

            this.matchLexeme('si');
            this.matchLexeme('(');
            expr = this.logicalOrExpression();
            this.matchLexeme(')');
            stm = this.statement();
            elseStm = this.elseStatement();

            return new IfStatement(expr, stm, elseStm);
        }

        // FIXME
        if (this.lookahead[1] === 'haz') {
            let expr = null;
            let stm = null;
            let elseStm = null;

            this.matchLexeme('haz');
            this.matchLexeme('opcion');
            this.matchLexeme('(');
            expr = this.logicalOrExpression();
            this.matchLexeme(')');
            this.matchLexeme('inicio');
            stm = this.statement();
            return new IfStatement(expr, stm, elseStm);
        }

        if (this.lookahead[1] === 'iterar') {
            let expr = null;
            let stm = null;

            this.matchLexeme('iterar');
            this.matchLexeme('mientras');
            this.matchLexeme('(');
            expr = this.logicalOrExpression();
            this.matchLexeme(')');
            stm = this.statement();

            return new WhileStatement(expr, stm);
        }

        if (this.lookahead[1] === 'para') {
            let id = null;
            let initializer = null;
            let initialValue = null;
            let stopCondition = null;
            let condition = null;
            let step = null;
            let stm = null;

            this.matchLexeme('para');
            id = new Identifier(this.lookahead[1]);
            this.matchToken(IDENTI);
            this.matchLexeme('en');
            this.matchLexeme('rango');
            initialValue = this.logicalOrExpression();
            initializer = new BinaryExpression(':=', id, initialValue);
            this.matchLexeme('a');
            stopCondition = this.logicalOrExpression();
            condition = new BinaryExpression('=', id, stopCondition);
            if (
                this.lookahead[1] === 'incr'
                || this.lookahead[1] === 'decr'
            ) {
                // FIXME: assign sign :v
                this.matchToken(RES_WORD);
                step = this.logicalOrExpression();
            } else {
                step = new Integer(1);
            }
            stm = this.statement();

            return new ForStatement(initializer, condition, step, stm);
        }

        if (this.lookahead[1] === 'regresa') {
            let expr = null;

            this.matchLexeme('regresa');
            expr = this.logicalOrExpression();
            this.matchLexeme(';');

            return new ReturnStatement(expr);
        }

        if (this.lookahead[1] === 'continua') {
            this.matchLexeme('continua');
            this.matchLexeme(';');

            return new ContinueStatement();
        }

        if (this.lookahead[1] === 'interrumpe') {
            this.matchLexeme('interrumpe');
            this.matchLexeme(';');

            return new BreakStatement();
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
            || this.lookahead[0] === IDENTI
            || RES_FUNCS.indexOf(this.lookahead[1]) > -1
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
            id = new Identifier(this.lookahead[1]);
        }

        if (nextTok[1] === '[') {
            this.matchToken(IDENTI);
            this.arrayDefinition();
        } else if (nextTok[0] === ASSIGN) {
            this.matchToken(IDENTI);
        }

        if (this.lookahead[0] === ASSIGN) {
            let aux = null;
            const symbol = this.lookahead[1];
            this.matchToken(ASSIGN);
            aux = this.logicalOrExpression();

            return new BinaryExpression(symbol, id, aux);
        }

        return this.logicalOrExpression();
    }

    logicalOrExpression() {
        let expr = null;
        let symbol = null;

        expr = this.logicalAndExpression();

        while (this.lookahead[1] === 'o') {
            symbol = this.lookahead[1];
            this.matchLexeme('o');

            expr = new BinaryExpression(symbol, expr, this.logicalAndExpression());
        }

        return expr;
    }

    logicalAndExpression() {
        let expr = null;
        let symbol = null;

        expr = this.equalityExpression();

        while (this.lookahead[1] === 'y') {
            symbol = this.lookahead[1];
            this.matchLexeme('y');

            expr = new BinaryExpression(symbol, expr, this.equalityExpression());
        }

        return expr;
    }

    equalityExpression() {
        let expr = null;
        let symbol = null;

        expr = this.relationalExpression();

        while (this.lookahead[1] === '=') {
            symbol = this.lookahead[1];
            this.matchLexeme('=');

            expr = new BinaryExpression(symbol, expr, this.relationalExpression());
        }

        return expr;
    }

    relationalExpression() {
        let expr = null;
        let symbol = null;

        expr = this.additiveExpression();

        while (this.lookahead[0] === OP_REL) {
            symbol = this.lookahead[1];
            this.matchToken(OP_REL);

            expr = new BinaryExpression(symbol, expr, this.additiveExpression());
        }

        return expr;
    }

    additiveExpression() {
        let expr = null;
        let symbol = null;

        expr = this.multiplicativeExpression();

        while (
            this.lookahead[1] === '+'
            || this.lookahead[1] === '-'
        ) {
            symbol = this.lookahead[1];
            this.matchLexeme(this.lookahead[1]);

            expr = new BinaryExpression(symbol, expr, this.multiplicativeExpression());
        }

        return expr;
    }

    multiplicativeExpression() {
        let expr = null;
        let symbol = null;

        expr = this.powExpression();

        while (
            this.lookahead[1] === '*'
            || this.lookahead[1] === '/'
        ) {
            symbol = this.lookahead[1];
            this.matchLexeme(this.lookahead[1]);

            expr = new BinaryExpression(symbol, expr, this.powExpression());
        }

        return expr;
    }

    powExpression() {
        let expr = null;
        let symbol = null;

        expr = this.unaryExpression();

        while (this.lookahead[1] === '^') {
            symbol = this.lookahead[1];
            this.matchLexeme(this.lookahead[1]);

            expr = new BinaryExpression(symbol, expr, this.unaryExpression());
        }

        return expr;
    }

    unaryExpression(cond) {
        if (
            this.lookahead[1] === '+'
            || this.lookahead[1] === '-'
        ) {
            const symbol = this.lookahead[1];
            this.matchLexeme(symbol);

            return new UnaryExpression(symbol, this.unaryExpression(cond));
        }

        return this.primaryExpression(cond);
    }

    primaryExpression(cond = {}) {
        let expr = null;

        if (this.lookahead[0] === IDENTI && !cond.isConstant) {
            const id = new Identifier(this.lookahead[1]);
            this.matchToken(IDENTI);
            return this.functionCall(id);
        } else if (
            RES_FUNCS.indexOf(this.lookahead[1]) > -1
            && !cond.isConstant
        ) {
            const id = new Identifier(this.lookahead[1]);
            this.matchToken(RES_WORD);
            return this.functionCall(id);
        } else if (this.lookahead[0] === INT) {
            expr = new Integer(this.lookahead[1]);
            this.matchToken(INT);
        } else if (this.lookahead[0] === FLOAT) {
            expr = new Float(this.lookahead[1]);
            this.matchToken(FLOAT);
        } else if (this.lookahead[0] === CT_ALF) {
            expr = new TString(this.lookahead[1]);
            this.matchToken(CT_ALF);
        } else if (this.lookahead[0] === CT_LOG) {
            expr = new Bool(this.lookahead[1]);
            this.matchToken(CT_LOG);
        } else if (!cond.isConstant && this.lookahead[0] === '(') {
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
            let args = null;
            this.matchLexeme('(');
            args = this.argumentList();
            this.matchLexeme(')');

            return new FunctionCall(id, args);
        }

        // FIXME
        this.arrayDefinition();

        return id;
    }

    argumentList() {
        let args = null;
        let aux = null;

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
            args = this.logicalOrExpression();
            aux = args;

            while (this.lookahead[1] === ',') {
                this.matchLexeme(',');
                aux.next = this.logicalOrExpression();
                aux = aux.next;
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

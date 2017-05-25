const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');
const VALID_OPERATIONS = require('./const').VALID_OPERATIONS;

const OP_CODE = {
    '+': 2,
    '-': 3,
    '*': 4,
    '/': 5,
    '%': 6,
    '^': 7,
    '<': 9,
    '>': 10,
    '<=': 11,
    '>=': 12,
    '<>': 13,
    '=': 14,
    y: 15,
    o: 16,
    no: 17,
};

class BinaryExpression extends TreeNode {
    constructor(op, left, right, token) {
        super(null, token);

        this.op = op;
        this.left = left || new TreeNode(null, token);
        this.right = right || new TreeNode(null, token);
    }

    isValidAssign() {
        const globalKey = `${this.left.symbol}@g`;
        const record = TreeNode.symTable[globalKey];
        if (record && record.is === 'CONST') {
            ErrorManager.sem(this.left.row, this.left.col, `Cant override constant "${this.left.symbol}"`);
            return false;
        }

        return true;
    }

    checkSemantic() {
        this.left.checkSemantic();
        this.right.checkSemantic();

        if (this.op === ':=' && !this.isValidAssign()) {
            return;
        }

        const key = `${this.left.type}${this.op}${this.right.type}`;
        if (VALID_OPERATIONS[key]) {
            this.type = VALID_OPERATIONS[key];
            return;
        }
        ErrorManager.sem(this.left.row, this.left.col, `Cant operate "${key}"`);
        this.type = 'E';
    }

    generateAssignCode(variable) {
        const globalKey = `${variable.symbol}@g`;
        const contextKey = `${variable.symbol}@${TreeNode.context}`;
        const record = TreeNode.symTable[contextKey] || TreeNode.symTable[globalKey];
        const key = `${record.id}@${record.context}`;
        const { line, arrayToPush } = TreeNode.arrayToPush;
        arrayToPush.push(`${line} STO 0, ${key}`);
    }

    generateCode() {
        if (this.op === ':=') {
            this.left.generateCode(false);
            this.right.generateCode();
            this.generateAssignCode(this.left);
            return;
        }

        this.left.generateCode();
        this.right.generateCode();

        const { line, arrayToPush } = TreeNode.arrayToPush;
        let opCode = OP_CODE[this.op];

        const key = `${this.left.type}${this.op}${this.right.type}`;
        if (VALID_OPERATIONS[key] === 'S') {
            opCode = 22;
        }

        arrayToPush.push(`${line} OPR 0, ${opCode}`);
    }
}

module.exports = BinaryExpression;

const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');
const VALID_OPERATIONS = require('./const').VALID_OPERATIONS;

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
            ErrorManager.sem(this.left.row, this.left.col, `Cant override "${this.left.symbol}"`);
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
}

module.exports = BinaryExpression;

const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');
const VALID_OPERATIONS = require('./const').VALID_OPERATIONS;

class BinaryExpression extends TreeNode {
    constructor(op, left, right, token) {
        super(null, token);

        this.op = op;
        this.left = left;
        this.right = right;
    }

    checkSemantic() {
        this.left.checkSemantic();
        this.right.checkSemantic();

        const key = `${this.left.type}${this.op}${this.right.type}`;
        if (VALID_OPERATIONS[key]) {
            this.type = VALID_OPERATIONS[key];
            return;
        }
        ErrorManager.sem(this.left.row, this.left.col, `Cant operate ${key}`);
        this.type = 'E';
    }
}

module.exports = BinaryExpression;

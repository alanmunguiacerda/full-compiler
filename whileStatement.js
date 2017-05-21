const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

const WHILE_COND = {
    canBreak: true,
    canContinue: true,
};

class WhileStatement extends TreeNode {
    constructor(expr, stms, token) {
        super(null, token);
        this.expr = expr || new TreeNode(null, token);
        this.stms = stms;
    }

    checkSemantic() {
        this.expr.checkSemantic();

        if (this.expr.type !== 'B') {
            ErrorManager.sem(this.expr.row, this.expr.col, 'Condition must be of type "B"');
        }

        TreeNode.checkSemanticOnList(this.stms, WHILE_COND);
        this.type = 'V';
    }
}

module.exports = WhileStatement;

const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class IfStatement extends TreeNode {
    constructor(expr, stms, elseStms, token) {
        super(null, token);
        this.expr = expr || new TreeNode(null, token);
        this.stms = stms;
        this.elseStms = elseStms;
    }

    checkSemantic(cond) {
        this.expr.checkSemantic();

        if (this.expr.type !== 'B') {
            ErrorManager.sem(this.expr.row, this.expr.col, 'Condition must be of type "B"');
        } else {
            this.type = 'V';
        }

        TreeNode.checkSemanticOnList(this.stms, cond);
        TreeNode.checkSemanticOnList(this.elseStms, cond);
    }
}

module.exports = IfStatement;

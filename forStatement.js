const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class ForStatement extends TreeNode {
    constructor(initializer, condition, step, stms, token) {
        super(null, token);
        this.initializer = initializer;
        this.condition = condition;
        this.step = step;
        this.stms = stms;
    }

    checkSemantic() {
        this.condition.checkSemantic();
        const cond = this.condition;
        if (cond && cond.type !== 'B') {
            ErrorManager.sem(cond.row, cond.col, 'Condition must be of type B');
            this.type = 'E';
        }

        TreeNode.checkSemanticOnList(this.stms);

        this.type = 'V';
    }
}

module.exports = ForStatement;

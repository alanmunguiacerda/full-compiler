const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

const FOR_COND = {
    canBreak: true,
    canContinue: true,
};

class ForStatement extends TreeNode {
    constructor(initializer, condition, step, stms, token) {
        super(null, token);
        this.initializer = initializer || new TreeNode(null, token);
        this.condition = condition || new TreeNode(null, token);
        this.step = step || new TreeNode(null, token);
        this.stms = stms;
    }

    checkSemantic() {
        this.condition.checkSemantic();
        this.initializer.checkSemantic();
        this.step.checkSemantic();
        const cond = this.condition;
        const init = this.initializer;
        const step = this.step;
        let type = 'V';

        if (init.right.type !== 'I') {
            ErrorManager.sem(init.right.row, init.right.col, 'For counter must be of type "I"');
            type = 'E';
        }

        if (step.type !== 'I') {
            ErrorManager.sem(step.row, step.col, 'For step must be of type "I"');
            type = 'E';
        }

        if (cond.right.type !== 'I') {
            ErrorManager.sem(cond.right.row, cond.right.col, 'For limit must be of type "I"');
            type = 'E';
        }

        if (cond && cond.type !== 'B') {
            ErrorManager.sem(cond.row, cond.col, 'Condition must be of type "B"');
            type = 'E';
        }

        TreeNode.checkSemanticOnList(this.stms, FOR_COND);

        this.type = type;
    }
}

module.exports = ForStatement;

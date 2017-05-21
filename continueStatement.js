const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class ContinueStatement extends TreeNode {
    constructor(token) {
        super(null, token);
    }

    checkSemantic(cond = {}) {
        if (!cond.canContinue) {
            ErrorManager.sem(this.row, this.col, 'Can\'t continue outside <for|while>');
        }
    }
}

module.exports = ContinueStatement;

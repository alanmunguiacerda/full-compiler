const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class BreakStatement extends TreeNode {
    constructor(token) {
        super(null, token);
    }

    checkSemantic(cond = {}) {
        if (!cond.canBreak) {
            ErrorManager.sem(this.row, this.col, 'Can\'t break outside <for|while|switch>');
        }
    }
}

module.exports = BreakStatement;

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

    generateCode(cond = {}) {
        const { line, arrayToPush } = TreeNode.arrayToPush;
        arrayToPush.push(`${line} JMP 0, ${cond.breakTo}`);
    }
}

module.exports = BreakStatement;

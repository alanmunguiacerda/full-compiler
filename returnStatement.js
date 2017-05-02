const TreeNode = require('./treeNode');

class ReturnStatement extends TreeNode {
    constructor(expr) {
        super('');
        this.expr = expr;
    }
}

module.exports = ReturnStatement;

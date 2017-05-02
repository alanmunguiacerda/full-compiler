const TreeNode = require('./treeNode');

class WhileStatement extends TreeNode {
    constructor(expr, statement) {
        super('');
        this.expr = expr;
        this.statement = statement;
    }
}

module.exports = WhileStatement;

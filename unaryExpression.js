const TreeNode = require('./treeNode');

class UnaryExpression extends TreeNode {
    constructor(symbol, expr) {
        super('');
        this.symbol = symbol;
        this.expr = expr;
    }
}

module.exports = UnaryExpression;

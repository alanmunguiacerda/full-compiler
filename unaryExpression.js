const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class UnaryExpression extends TreeNode {
    constructor(symbol, expr, token) {
        super(null, token);
        this.symbol = symbol;
        this.expr = expr;
    }

    checkSemantic() {
        if (this.expr.type === 'I' || this.expr.type === 'F') {
            this.type = this.expr.type;
            return;
        }

        this.type = 'E';
        ErrorManager.sem(this.row, this.col, `Unary operator can't be applyed to type ${this.expr.type}`);
    }
}

module.exports = UnaryExpression;

const TreeNode = require('./treeNode');

class ReturnStatement extends TreeNode {
    constructor(expr, token) {
        super(null, token);
        this.expr = expr;
    }

    checkSemantic() {
        console.log('CHECKING RETURN');
    }
}

module.exports = ReturnStatement;

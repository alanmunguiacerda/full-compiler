const TreeNode = require('./treeNode');

class SwitchStatement extends TreeNode {
    constructor(expr, cases, token) {
        super(token);

        this.expr = expr;
        this.cases = cases;
    }

    checkSemantic() {

    }
}

module.exports = SwitchStatement;

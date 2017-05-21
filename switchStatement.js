const TreeNode = require('./treeNode');

class SwitchStatement extends TreeNode {
    constructor(expr, cases, token) {
        super(token);

        this.expr = expr || new TreeNode(null, token);
        this.cases = cases;
    }

    checkSemantic() {
        this.expr.checkSemantic();
        const isSwitch = true;
        const dataType = this.expr.type;
        TreeNode.checkSemanticOnList(this.cases, { isSwitch, dataType });
    }
}

module.exports = SwitchStatement;

const TreeNode = require('./treeNode');

const SWITCH_COND = {
    canBreak: true,
    isSwitch: true,
};

class SwitchStatement extends TreeNode {
    constructor(expr, cases, token) {
        super(token);

        this.expr = expr || new TreeNode(null, token);
        this.cases = cases;
    }

    checkSemantic() {
        this.expr.checkSemantic();
        SWITCH_COND.dataType = this.expr.type;
        TreeNode.checkSemanticOnList(this.cases, SWITCH_COND);
    }

    generateCode() {
        
    }
}

module.exports = SwitchStatement;

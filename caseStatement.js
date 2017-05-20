const TreeNode = require('./treeNode');

class CaseStatement extends TreeNode {
    constructor(cond, stms, token) {
        super(token);

        this.cond = cond;
        this.stms = stms;
    }

    checkSemantic() {
        console.log('CHECKING CASE');
    }
}

module.exports = CaseStatement;

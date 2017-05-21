const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class CaseStatement extends TreeNode {
    constructor(cond, stms, token) {
        super(token);

        this.cond = cond;
        this.stms = stms;
    }

    checkSemantic(cond) {
        const { isSwitch, dataType } = cond;

        if (!isSwitch) {
            ErrorManager.sem(this.cond.row, this.cond.col, 'Case declared outside witch statement');
        }

        if (this.cond) {
            this.cond.checkSemantic();
            if (dataType !== this.cond.type) {
                ErrorManager.sem(this.cond.row, this.cond.col, `Can't compare ${dataType} with ${this.cond.type}`);
            }
        }

        TreeNode.checkSemanticOnList(this.stms);
    }
}

module.exports = CaseStatement;

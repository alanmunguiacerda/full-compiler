const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

const WHILE_COND = {
    canBreak: true,
    canContinue: true,
};

class WhileStatement extends TreeNode {
    constructor(expr, stms, token) {
        super(null, token);
        this.expr = expr || new TreeNode(null, token);
        this.stms = stms;
    }

    checkSemantic() {
        this.expr.checkSemantic();

        if (this.expr.type !== 'B') {
            ErrorManager.sem(this.expr.row, this.expr.col, 'Condition must be of type "B"');
        }

        TreeNode.checkSemanticOnList(this.stms, WHILE_COND);
        this.type = 'V';
    }

    generateCode() {
        const falseLbl = TreeNode.getUniqueLabel('false');
        const whileLbl = TreeNode.getUniqueLabel('while');
        const arrayToPush = TreeNode.arrayToPush.arrayToPush;
        const cond = { breakTo: falseLbl, continueTo: whileLbl };
        let line = TreeNode.arrayToPush.line;

        this.expr.generateCode();

        TreeNode.codeLabels.push(`${whileLbl},I,I,${line},0,#,`);
        line = TreeNode.arrayToPush.line;
        arrayToPush.push(`${line} JMC F, ${falseLbl}`);
        TreeNode.cascadeCode(this.stms, cond);
        line = TreeNode.arrayToPush.line;
        arrayToPush.push(`${line} JMP 0, ${whileLbl}`);
        TreeNode.codeLabels.push(`${falseLbl},I,I,${line + 1},0,#,`);
    }
}

module.exports = WhileStatement;

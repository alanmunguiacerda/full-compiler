const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class IfStatement extends TreeNode {
    constructor(expr, stms, elseStms, token) {
        super(null, token);
        this.expr = expr || new TreeNode(null, token);
        this.stms = stms;
        this.elseStms = elseStms;
    }

    checkSemantic(cond) {
        this.expr.checkSemantic();

        if (this.expr.type !== 'B') {
            ErrorManager.sem(this.expr.row, this.expr.col, 'Condition must be of type "B"');
        } else {
            this.type = 'V';
        }

        TreeNode.checkSemanticOnList(this.stms, cond);
        TreeNode.checkSemanticOnList(this.elseStms, cond);
    }

    generateCode(cond) {
        this.expr.generateCode();

        const falseLbl = TreeNode.getUniqueLabel('false');
        const endIfLbl = TreeNode.getUniqueLabel('endIf');

        const { line, arrayToPush } = TreeNode.arrayToPush;
        arrayToPush.push(`${line} JMC F, ${falseLbl}`);
        TreeNode.cascadeCode(this.stms, cond);

        const endStmsLine = TreeNode.arrayToPush.line;
        arrayToPush.push(`${endStmsLine} JMP 0, ${endIfLbl}`);
        TreeNode.codeLabels.push(`${falseLbl},I,I,${endStmsLine + 1},0,#,`);
        TreeNode.cascadeCode(this.elseStms, cond);
        const endElseLine = TreeNode.arrayToPush.line;
        TreeNode.codeLabels.push(`${endIfLbl},I,I,${endElseLine},0,#,`);
    }
}

module.exports = IfStatement;

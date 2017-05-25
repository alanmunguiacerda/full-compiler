const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class ReturnStatement extends TreeNode {
    constructor(expr, token) {
        super(null, token);
        this.expr = expr;
    }

    checkSemantic() {
        let exprType = 'V';
        if (this.expr) {
            this.expr.checkSemantic();
            exprType = this.expr.type;
        }
        const parentFunc = TreeNode.symTable[`${TreeNode.context}@g`];

        if (!parentFunc) {
            ErrorManager.sem(this.row, this.col, 'Can\'t return  outside function');
            return;
        }

        if (parentFunc.type !== exprType) {
            ErrorManager.sem(this.expr.row, this.expr.col, `Can't return ${exprType}, ${parentFunc.type} required`);
            return;
        }

        this.type = parentFunc.type;
    }

    generateCode() {
        this.expr.generateCode();
        const { line, arrayToPush } = TreeNode.arrayToPush;
        arrayToPush.push(`${line} STO 0, ${TreeNode.context}@g`);
        arrayToPush.push(`${line + 1} OPR 0, 1`);
    }
}

module.exports = ReturnStatement;

const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');
const VALID_OPERATIONS = require('./const').VALID_OPERATIONS;

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

        const key = `${parentFunc.type}:=${exprType}`;
        if (!VALID_OPERATIONS[key]) {
            ErrorManager.sem(this.row, this.col, `Can't return ${exprType}, ${parentFunc.type} required`);
            return;
        }

        this.type = parentFunc.type;
    }

    generateCode() {
        const arrayToPush = TreeNode.arrayToPush.arrayToPush;
        let line;
        if (this.expr) {
            this.expr.generateCode();
            line = TreeNode.arrayToPush.line;
            arrayToPush.push(`${line} STO 0, ${TreeNode.context}@g`);
        }
        line = TreeNode.arrayToPush.line;
        arrayToPush.push(`${line} OPR 0, 1`);
    }
}

module.exports = ReturnStatement;

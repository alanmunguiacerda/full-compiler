const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class Identifier extends TreeNode {
    constructor(symbol, token) {
        super(symbol, token);

        this.arrayAccess = {};
    }

    checkSemantic() {
        const contextKey = `${this.symbol}@${TreeNode.context}`;
        const globalKey = `${this.symbol}@g`;
        const record = TreeNode.symTable[contextKey] || TreeNode.symTable[globalKey];

        if (!record) {
            ErrorManager.sem(this.row, this.col, `"${this.symbol}" is undefined`);
            return;
        }

        if (record.is === 'VAR' || record.is === 'CONST') {
            this.type = record.type;
            return;
        }
        // TODO: check array access
        ErrorManager.sem(this.row, this.col, `"${this.symbol}" is a function`);
    }
}

module.exports = Identifier;

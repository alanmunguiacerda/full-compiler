const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class Identifier extends TreeNode {
    constructor(symbol, token) {
        super(symbol, token);

        this.arrayAccess = {
            dimensions: 0,
            accessExpressions: [],
        };
    }

    checkSemantic() {
        const contextKey = `${this.symbol}@${TreeNode.context}`;
        const globalKey = `${this.symbol}@g`;
        const record = TreeNode.symTable[contextKey] || TreeNode.symTable[globalKey];

        if (!record) {
            ErrorManager.sem(this.row, this.col, `"${this.symbol}" is undefined`);
            return null;
        }

        if (record.is !== 'VAR' && record.is !== 'CONST' && record.is !== 'PARAM') {
            ErrorManager.sem(this.row, this.col, `"${this.symbol}" is a function`);
        }

        if (this.arrayAccess.dimensions) {
            this.arrayAccess.accessExpressions.forEach((expression) => {
                expression.checkSemantic();
                if (expression.type !== 'I') {
                    ErrorManager.sem(expression.row, expression.col, `Index can't be of type ${expression.type}`);
                }
            });
        }

        const accessDimensions = this.arrayAccess.dimensions;

        if (!record.dimensions && accessDimensions) {
            ErrorManager.sem(this.row, this.col, `"${this.symbol}" is not an array`);
        } else if (record.dimensions !== accessDimensions) {
            ErrorManager.sem(this.row, this.col, `"${this.symbol}" takes exactly ${record.dimensions} dimensions`);
        }

        this.type = record.type;
        return record;
    }

    generateCode(lod = true) {
        const contextKey = `${this.symbol}@${TreeNode.context}`;
        const globalKey = `${this.symbol}@g`;
        const record = TreeNode.symTable[contextKey] || TreeNode.symTable[globalKey];
        this.arrayAccess.accessExpressions.forEach((expression) => {
            expression.generateCode();
        });

        const { line, arrayToPush } = TreeNode.arrayToPush;
        if (lod) {
            const lodInst = `${line} LOD ${record.id}@${record.context}, 0`;
            arrayToPush.push(lodInst);
        }
    }
}

module.exports = Identifier;

const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');
const VALID_OPERATIONS = require('./const').VALID_OPERATIONS;

class VariableDeclarator extends TreeNode {
    constructor(id, init, token, cond = {}) {
        super(null, token);
        this.id = id;
        this.init = init;
        this.dimensions = cond.dimensions;
        this.dimensionsSizes = cond.dimensionsSizes;
        this.isConstant = cond.isConstant;
    }

    checkSemantic(type) {
        const id = this.id.symbol;
        const register = TreeNode.symTable[id];

        if (register) {
            ErrorManager.sem(this.id.row, this.id.col, `Variable ${id} already declared`);
            return;
        }

        if (this.init) {
            const opKey = `${type}:=${this.init.type}`;
            this.init.checkSemantic();

            if (!VALID_OPERATIONS[opKey]) {
                ErrorManager.sem(this.init.row, this.init.col, `Can't assign ${this.init.type} to ${type}`);
            }
        }

        const sizes = [];
        if (this.dimensions) {
            this.dimensionsSizes.forEach((dimension) => {
                dimension.checkSemantic();
                if (dimension.type !== 'I') {
                    ErrorManager.sem(dimension.row, dimension.col, `Dimension can't be of type ${dimension.type}`);
                }
                sizes.push(dimension.symbol);
            });
        }

        const is = this.isConstant ? 'CONST' : 'VAR';
        const dimensions = this.dimensions || 0;
        const context = TreeNode.context;
        const key = `${id}@${context}`;

        TreeNode.symTable[key] = { id, is, type, dimensions, sizes, context };
    }
}

module.exports = VariableDeclarator;

const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');
const VALID_OPERATIONS = require('./const').VALID_OPERATIONS;

const defaultCond = {
    dimensions: 0,
    dimensionsSizes: [],
    isConstant: false,
};

class VariableDeclarator extends TreeNode {
    constructor(id, init, token, cond = defaultCond) {
        super(null, token);
        this.id = id;
        this.init = init;
        this.dimensions = cond.dimensions;
        this.dimensionsSizes = cond.dimensionsSizes;
        this.isConstant = cond.isConstant;
    }

    checkSemantic(cond) {
        const type = cond.dataType;
        const id = this.id.symbol;
        const context = TreeNode.context;
        const key = `${id}@${context}`;
        const register = TreeNode.symTable[key];

        if (register) {
            ErrorManager.sem(this.id.row, this.id.col, `Variable "${id}" already declared`);
            return;
        }

        if (this.dimensions > 2) {
            ErrorManager.sem(this.id.row, this.id.col, `Variable "${id}" exceeded valid dimensions`);
            return;
        }

        if (this.init) {
            this.init.checkSemantic();
            const opKey = `${type}:=${this.init.type}`;
            if (!VALID_OPERATIONS[opKey]) {
                ErrorManager.sem(this.init.row, this.init.col, `Can't assign ${this.init.type} to ${type}`);
            }
        }

        const sizes = [];
        if (this.dimensions) {
            this.dimensionsSizes.forEach((dimension) => {
                let dimensionType = 'E';
                if (dimension) {
                    dimension.checkSemantic();
                    dimensionType = dimension.type;
                }
                if (dimensionType !== 'I') {
                    ErrorManager.sem(dimension.row, dimension.col, `Dimension can't be of type ${dimension.type}`);
                    return;
                }

                let dimSize = dimension.symbol;
                if (isNaN(dimSize)) {
                    const recordKey = `${dimension.symbol}@g`;
                    const dimRecord = TreeNode.symTable[recordKey];
                    if (dimRecord.is !== 'CONST') {
                        ErrorManager.sem(dimRecord.row, dimRecord.col, `Dimension can only be <constant|int>`);
                        return;
                    }
                    const record = TreeNode.symTable[recordKey];
                    dimSize = record.value;
                }

                sizes.push(dimSize);
            });
        }

        const is = this.isConstant ? 'CONST' : 'VAR';
        const dimensions = this.dimensions;
        const record = { id, is, type, dimensions, sizes, context };

        if (this.isConstant) {
            record.value = this.init.symbol;
        }

        TreeNode.symTable[key] = record;
    }

    generateCode() {
        if (!this.init) {
            return;
        }

        const key = `${this.id.symbol}@${TreeNode.context}`;
        this.init.generateCode();
        const { line, arrayToPush } = TreeNode.arrayToPush;

        arrayToPush.push(`${line} STO 0, ${key}`);
    }
}

module.exports = VariableDeclarator;

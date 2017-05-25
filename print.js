const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class Print extends TreeNode {
    constructor(params, token) {
        super('', token);

        this.params = params || [];
    }

    checkSemantic() {
        const paramsLength = this.params ? this.params.length : 0;

        if (paramsLength < 1) {
            ErrorManager.sem(this.row, this.col, '"imprime" requires at least 1 parameter');
        }

        if (paramsLength) {
            this.params.forEach((param) => {
                if (param) {
                    param.checkSemantic();
                }
            });
        }
    }

    generateCode() {
        const arrayToPush = TreeNode.arrayToPush.arrayToPush;
        this.params.forEach((param) => {
            param.generateCode();
            const line = TreeNode.arrayToPush.line;
            arrayToPush.push(`${line} OPR 0, 20`);
        });
    }
}

module.exports = Print;

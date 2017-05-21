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
}

module.exports = Print;

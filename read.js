const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class Read extends TreeNode {
    constructor(params, token) {
        super('', token);

        this.params = params || [];
    }

    checkSemantic() {
        if (this.params.length !== 1) {
            ErrorManager.sem(this.row, this.col, '"lee" takes exactly 1 parameter');
            return;
        }

        const param = this.params[0];
        param.checkSemantic();
    }
}

module.exports = Read;

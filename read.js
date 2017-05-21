const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');
const Identifier = require('./identifier');

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

        if (!(param instanceof Identifier)) {
            ErrorManager.sem(param.row, param.col, '"lee" expects a variable as parameter');
            return;
        }

        const record = param.checkSemantic();

        if (record && record.is === 'CONST') {
            ErrorManager.sem(param.row, param.col, `Can't override constant "${record.id}"`);
        }
    }
}

module.exports = Read;

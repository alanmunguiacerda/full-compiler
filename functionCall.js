const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class FunctionCall extends TreeNode {
    constructor(id, args, token) {
        super(null, token);
        this.id = id;
        this.args = args;
    }

    checkFunctionArgs(funcDef, args) {
        const params = funcDef.params;
        const identifier = funcDef.symbol;
        let arg = args;
        params.forEach((param) => {
            arg.checkSemantic();

            if (arg.type !== param) {
                ErrorManager.sem(this.arg.row, this.arg.col, `On ${identifier} call, parameter mismatch`);
            }

            arg = arg.next;
        });
    }

    checkSemantic() {
        const identifier = this.id.symbol;
        const funcDef = TreeNode.symTable[identifier];

        if (!funcDef) {
            ErrorManager.sem(this.id.row, this.id.col, `"${identifier}" is not declared`);
            return;
        }

        if (funcDef.is === 'FUNC') {
            this.checkFunctionArgs(funcDef, this.args);
            this.type = funcDef.dataType;
            return;
        }

        ErrorManager.sem(this.id.row, this.id.col, `"${identifier}" is not a function`);
    }
}

module.exports = FunctionCall;

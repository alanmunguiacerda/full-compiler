const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class FunctionCall extends TreeNode {
    constructor(id, args, token) {
        super(null, token);
        this.id = id;
        this.args = args || [];
    }

    checkFunctionArgs(funcDef, args) {
        const params = funcDef.params;
        const identifier = funcDef.id;
        const argsLenght = args.length;
        const paramsLength = params.length;
        if (argsLenght !== paramsLength) {
            const pluralized = paramsLength === 1 ? 'parameter' : 'parameters';
            ErrorManager.sem(this.id.row, this.id.col, `"${identifier}" takes exactly ${paramsLength} ${pluralized}, ${argsLenght} given`);
        }

        params.forEach((param, index) => {
            const arg = args[index];
            let argType = 'E';
            if (arg) {
                arg.checkSemantic();
                argType = arg.type;
            }

            if (argType !== param) {
                ErrorManager.sem(arg.row, arg.col, `On "${identifier}" call, expected ${param} got ${argType}`);
            }
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
            this.type = funcDef.type;
            return;
        }

        ErrorManager.sem(this.id.row, this.id.col, `"${identifier}" is not a function`);
    }
}

module.exports = FunctionCall;

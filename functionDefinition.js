const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class FunctionDefinition extends TreeNode {
    constructor(dataType, id, params, stms, token) {
        super(null, token);
        this.dataType = dataType;
        this.id = id;
        this.params = params;
        this.stms = stms;
    }

    checkSemantic() {
        const identifier = this.id.symbol;
        const func = TreeNode.symTable[identifier];

        if (func) {
            ErrorManager.sem(this.id.row, this.id.col, 'Function already declared');
            return;
        }

        const params = [];
        let defParam = this.params;

        while (defParam) {
            params.push(defParam.dataType.getType());
            const key = `${defParam.id.symbol}@${identifier}`;
            TreeNode.symTable[key] = {
                id: defParam.id.symbol,
                is: 'VAR',
                type: defParam.dataType.getType(),
                context: identifier,
                dimensions: 0,
                sizes: [],
            };
            defParam = defParam.next;
        }

        TreeNode.symTable[identifier] = {
            id: identifier,
            is: 'FUNC',
            type: this.dataType.getType(),
            params,
        };

        TreeNode.checkSemanticOnList(this.stms, { context: identifier });
    }
}

module.exports = FunctionDefinition;

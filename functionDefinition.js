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
        const funcKey = `${identifier}@g`;
        const func = TreeNode.symTable[funcKey];

        if (func) {
            ErrorManager.sem(this.id.row, this.id.col, 'Function already declared');
            return;
        }

        const params = [];
        let defParam = this.params;

        while (defParam) {
            params.push(defParam.dataType.getType());
            const key = `${defParam.id.symbol}@${identifier}`;

            if (TreeNode.symTable[key]) {
                ErrorManager.sem(defParam.id.row, defParam.id.col, `Duplicated parameter name "${defParam.id.symbol}"`);
                return;
            }

            TreeNode.symTable[key] = {
                id: defParam.id.symbol,
                is: 'PARAM',
                type: defParam.dataType.getType(),
                context: identifier,
                dimensions: 0,
                sizes: [],
            };
            defParam = defParam.next;
        }

        TreeNode.symTable[funcKey] = {
            id: identifier,
            is: 'FUNC',
            type: this.dataType.getType(),
            params,
            dimensions: '0',
            sizes: [],
        };

        TreeNode.checkSemanticOnList(this.stms, { context: identifier });
    }

    generateCode() {
        const identifier = this.id.symbol;
        const funcKey = `${identifier}@g`;
        const func = TreeNode.symTable[funcKey];
        let line = TreeNode.codeFuncs.length + 1;
        func.sizes = [line];

        const params = [];
        let tmpParam = this.params;
        while (tmpParam) {
            params.push(tmpParam);
            tmpParam = tmpParam.next;
        }

        params.reverse().forEach((param) => {
            TreeNode.codeFuncs.push(`${line} STO 0, ${param.id.symbol}@${identifier}`);
            line += 1;
        });

        TreeNode.cascadeCode(this.stms, { context: identifier });
        let arrayToPush = TreeNode.codeFuncs;
        line = TreeNode.codeFuncs.length + 1;
        let opCode = 1;

        if (identifier === 'main') {
            arrayToPush = TreeNode.codeMain;
            line += TreeNode.codeMain.length;
            line += TreeNode.codeInits.length;
            opCode = 0;
        }

        arrayToPush.push(`${line} OPR 0, ${opCode}`);
    }
}

module.exports = FunctionDefinition;

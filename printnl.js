const TreeNode = require('./treeNode');

class Printnl extends TreeNode {
    constructor(params, token) {
        super('', token);

        this.params = params || [];
    }

    checkSemantic() {
        const params = this.params || [];

        params.forEach((param) => {
            if (param) {
                param.checkSemantic();
            }
        });
    }

    generateCode() {
        const arrayToPush = TreeNode.arrayToPush.arrayToPush;
        this.params.forEach((param, i) => {
            param.generateCode();
            const line = TreeNode.arrayToPush.line;
            const opCode = i === this.params.length - 1 ? 21 : 20;
            arrayToPush.push(`${line} OPR 0, ${opCode}`);
        });
    }
}

module.exports = Printnl;

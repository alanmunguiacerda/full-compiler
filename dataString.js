const TreeNode = require('./treeNode');

class TString extends TreeNode {
    constructor(symbol, token) {
        super(symbol, token);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'S';
    }

    generateCode() {
        const { line, arrayToPush } = TreeNode.arrayToPush;

        arrayToPush.push(`${line} LIT ${this.symbol}, 0`);
    }
}

module.exports = TString;

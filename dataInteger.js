const TreeNode = require('./treeNode');

class Integer extends TreeNode {
    constructor(symbol, token) {
        super(symbol, token);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'I';
    }

    generateCode() {
        const { line, arrayToPush } = TreeNode.arrayToPush;

        arrayToPush.push(`${line} LIT ${this.symbol}, 0`);
    }
}

module.exports = Integer;

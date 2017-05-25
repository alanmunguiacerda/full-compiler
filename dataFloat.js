const TreeNode = require('./treeNode');

class Float extends TreeNode {
    constructor(symbol, token) {
        super(symbol, token);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'F';
    }

    generateCode() {
        const { line, arrayToPush } = TreeNode.arrayToPush;

        arrayToPush.push(`${line} LIT ${this.symbol}, 0`);
    }
}

module.exports = Float;

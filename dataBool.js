const TreeNode = require('./treeNode');

const BOOL_SYM = {
    verdadero: 'V',
    falso: 'F',
};

class Bool extends TreeNode {
    constructor(symbol, token) {
        super(symbol, token);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'B';
    }

    generateCode() {
        const { line, arrayToPush } = TreeNode.arrayToPush;

        arrayToPush.push(`${line} LIT ${BOOL_SYM[this.symbol]}, 0`);
    }
}

module.exports = Bool;

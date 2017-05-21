const TreeNode = require('./treeNode');

class Integer extends TreeNode {
    constructor(symbol, token) {
        super(symbol, token);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'I';
    }
}

module.exports = Integer;

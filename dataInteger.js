const TreeNode = require('./treeNode');

class Integer extends TreeNode {
    constructor(symbol) {
        super(symbol);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'I';
    }
}

module.exports = Integer;

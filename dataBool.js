const TreeNode = require('./treeNode');

class Bool extends TreeNode {
    constructor(symbol) {
        super(symbol);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'B';
    }
}

module.exports = Bool;

const TreeNode = require('./treeNode');

class Bool extends TreeNode {
    constructor(symbol, token) {
        super(symbol, token);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'B';
    }
}

module.exports = Bool;

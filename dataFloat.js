const TreeNode = require('./treeNode');

class Float extends TreeNode {
    constructor(symbol, token) {
        super(symbol, token);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'F';
    }
}

module.exports = Float;

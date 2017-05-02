const TreeNode = require('./treeNode');

class Float extends TreeNode {
    constructor(symbol) {
        super(symbol);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'F';
    }
}

module.exports = Float;

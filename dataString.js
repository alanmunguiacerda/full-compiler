const TreeNode = require('./treeNode');

class TString extends TreeNode {
    constructor(symbol) {
        super(symbol);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'S';
    }
}

module.exports = TString;

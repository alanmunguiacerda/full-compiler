const TreeNode = require('./treeNode');

class TString extends TreeNode {
    constructor(symbol, token) {
        super(symbol, token);

        this.checkSemantic();
    }

    checkSemantic() {
        this.type = 'S';
    }
}

module.exports = TString;

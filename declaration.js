const TreeNode = require('./treeNode');

class Declaration extends TreeNode {
    constructor(dataType, declarator, token) {
        super(null, token);
        this.dataType = dataType;
        this.declarator = declarator;
    }

    checkSemantic() {
        const dataType = this.dataType.getType();
        TreeNode.checkSemanticOnList(this.declarator, { dataType });
    }
}

module.exports = Declaration;

const TreeNode = require('./treeNode');

class Declaration extends TreeNode {
    constructor(dataType, declarator) {
        super('');
        this.dataType = dataType;
        this.declarator = declarator;
    }

    checkSemantic() {
        let node = this.declarator;
        const dataType = this.dataType.getType();

        while (node) {
            node.checkSemantic(dataType);

            node = node.next;
        }
    }
}

module.exports = Declaration;

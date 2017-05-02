const TreeNode = require('./treeNode');

class VariableDeclarator extends TreeNode {
    constructor(id, init) {
        super('');
        this.id = id;
        this.init = init;
    }
}

module.exports = VariableDeclarator;

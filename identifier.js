const TreeNode = require('./treeNode');

class Identifier extends TreeNode {
    checkSemantic() {
        console.log('REVISANDO IDENTIFICADOR');
    }
}

module.exports = Identifier;

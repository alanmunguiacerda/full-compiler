const TreeNode = require('./treeNode');

class ContinueStatement extends TreeNode {
    checkSemantic() {
        console.log('CHECKING CONTINUE');
    }
}

module.exports = ContinueStatement;

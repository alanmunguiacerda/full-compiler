const TreeNode = require('./treeNode');

class BreakStatement extends TreeNode {
    checkSemantic() {
        console.log('CHECKING BREAK');
    }
}

module.exports = BreakStatement;

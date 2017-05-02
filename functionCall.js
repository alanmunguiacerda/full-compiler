const TreeNode = require('./treeNode');

class FunctionCall extends TreeNode {
    constructor(id, args) {
        super('');
        this.id = id;
        this.args = args;
    }

    checkSemantic() {
        console.log('REVISANDO LLAMADA A FUNCIÓN');
    }
}

module.exports = FunctionCall;

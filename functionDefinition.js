const TreeNode = require('./treeNode');

class FunctionDefinition extends TreeNode {
    constructor(dataType, id, params, statement) {
        super('');
        this.dataType = dataType;
        this.id = id;
        this.params = params;
        this.statement = statement;
    }

    checkSemantic() {
        console.log('REVISANDO DECLARACIÓN DE FUNCIÓN');
    }
}

module.exports = FunctionDefinition;

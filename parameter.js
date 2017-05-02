const TreeNode = require('./treeNode');

class Parameter extends TreeNode {
    constructor(dataType, id) {
        super('');
        this.dataType = dataType;
        this.id = id;
    }

    checkSemantic() {
        const type = this.dataType.getType();
        console.log('CHECKING PARAMETER');
    }
}

module.exports = Parameter;

const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class Parameter extends TreeNode {
    constructor(dataType, id, token) {
        super(null, token);
        this.dataType = dataType;
        this.id = id;
    }

    checkSemantic() {
        const type = this.dataType.getType();

        if (type === 'E') {
            ErrorManager.sem(this.row, this.col, `Invalid parameter type "${this.dataType.symbol}"`);
        }
    }
}

module.exports = Parameter;

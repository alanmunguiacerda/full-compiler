const TreeNode = require('./treeNode');

const types = {
    entero: 'I',
    decimal: 'F',
    alfabetico: 'S',
    logico: 'B',
};

class DataType extends TreeNode {
    getType() {
        return types[this.symbol];
    }
}

module.exports = DataType;

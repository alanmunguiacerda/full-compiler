const TreeNode = require('./treeNode');

const types = {
    entero: 'I',
    decimal: 'F',
    alfabetico: 'S',
    logico: 'B',
    void: 'V',
};

class DataType extends TreeNode {
    getType() {
        return types[this.symbol] || 'E';
    }
}

module.exports = DataType;

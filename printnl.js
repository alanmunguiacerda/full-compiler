const TreeNode = require('./treeNode');

class Printnl extends TreeNode {
    constructor(params, token) {
        super('', token);

        this.params = params || [];
    }

    checkSemantic() {
        const params = this.params || [];

        params.forEach((param) => {
            if (param) {
                param.checkSemantic();
            }
        });
    }
}

module.exports = Printnl;

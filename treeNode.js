const labels = {};

const symTable = {};

let context = 'g';

class TreeNode {
    constructor(symbol = '', token) {
        this.symbol = symbol;
        this.next = null;
        this.type = 'E';
        if (token && token.length > 2) {
            this.row = token[2];
            this.col = token[3];
        }
    }

    static get labels() {
        return labels;
    }

    static get symTable() {
        return symTable;
    }

    static get context() {
        return context;
    }

    static set context(newContext) {
        context = newContext;
    }

    checkSemantic() {
        // DO NOTHING
    }

    static checkSemanticOnList(node, cond = {}) {
        if (cond.context) {
            TreeNode.context = cond.context;
        }

        while (node) {
            node.checkSemantic(cond);
            node = node.next;
        }

        if (cond.context) {
            TreeNode.context = 'g';
        }
    }

    getUniqueLabel(label) {
        if (labels[label]) {
            labels[label] += 1;
        } else {
            labels[label] = 0;
        }

        return `${label}${labels[label]}`;
    }
}

module.exports = TreeNode;

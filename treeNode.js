const TYPE_ERROR = -4435;

class TreeNode {
    constructor(symbol) {
        this.symbol = symbol;
        this.next = null;
        this.type = TYPE_ERROR;
    }

    checkSemantic() {
        console.log('NOT IMPLEMENTED YET');
    }

    checkSemanticOnList(node, setContext) {
        if (setContext) {
            // TODO: set context on symtable
        }

        while (node) {
            node.checkSemantic();
            node = node.next;
        }

        if (setContext) {
            // TODO: exit context
        }
    }
}

TreeNode.labels = {};
TreeNode.params = ['edi', 'esi', 'edx', 'ecx', 'r8d', 'r9d'];
TreeNode.availableRegisters = ['rbx', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15'];

module.exports = TreeNode;

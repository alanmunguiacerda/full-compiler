const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

const VALID_OPERATIONS = {
    'I:=I': '',
    'S:=S': '',
    'F:=F': '',
    'B:=B': '',
    'F:=I': '',
    'I+I': 'I',
    'I+F': 'F',
    'F+I': 'F',
    'F+F': 'F',
    'S+S': 'S',
    'I-I': 'I',
    'I-F': 'F',
    'F-I': 'F',
    'F-F': 'F',
    'I*I': 'I',
    'I*F': 'F',
    'F*I': 'F',
    'F*F': 'F',
    'I/I': 'F',
    'I/F': 'F',
    'F/I': 'F',
    'F/F': 'F',
    'I%I': 'I',
    '-I': 'I',
    '-F': 'F',
    ByB: 'B',
    BoB: 'B',
    noB: 'B',
    'I>I': 'B',
    'F>I': 'B',
    'I>F': 'B',
    'F>F': 'B',
    'I<I': 'B',
    'F<I': 'B',
    'I<F': 'B',
    'F<F': 'B',
    'I>=I': 'B',
    'F>=I': 'B',
    'I>=F': 'B',
    'F>=F': 'B',
    'I<=I': 'B',
    'F<=I': 'B',
    'I<=F': 'B',
    'F<=F': 'B',
    'I!=I': 'B',
    'F!=I': 'B',
    'I!=F': 'B',
    'F!=F': 'B',
    'S!=S': 'B',
    'I=I': 'B',
    'F=I': 'B',
    'I=F': 'B',
    'F=F': 'B',
    'S=S': 'B',
};

class BinaryExpression extends TreeNode {
    constructor(op, left, right) {
        super();

        this.op = op;
        this.left = left;
        this.right = right;

        this.checkSemantic();
    }

    checkSemantic() {
        this.left.checkSemantic();
        this.right.checkSemantic();

        const key = `${this.left.type}${this.op}${this.right.type}`;
        if (VALID_OPERATIONS[key]) {
            this.type = VALID_OPERATIONS[key];
        } else {
            ErrorManager.sem(0, 0, `Cant do ${key}`);
        }
    }
}

module.exports = BinaryExpression;

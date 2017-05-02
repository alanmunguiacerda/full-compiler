const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class IfStatement extends TreeNode {
    constructor(expr, statement, elseStatement) {
        super('');
        this.expr = expr;
        this.statement = statement;
        this.elseStatement = elseStatement;
    }

    checkSemantic() {
        this.expr.checkSemantic();
        this.checkSemanticOnList(this.statement);
        this.checkSemanticOnList(this.elseStatement);

        if (this.expr.type !== 'B') {
            ErrorManager.sem(0, 0, 'Condition must be of type "B"');
        } else {
            this.type = 'V';
        }
    }
}

module.exports = IfStatement;

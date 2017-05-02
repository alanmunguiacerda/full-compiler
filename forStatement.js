const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

class ForStatement extends TreeNode {
    constructor(initializer, condition, step, statement) {
        super('');
        this.initializer = initializer;
        this.condition = condition;
        this.step = step;
        this.statement = statement;
    }

    checkSemantic() {
        if (this.initializer) this.initializer.checkSemantic();
        if (this.condition) this.condition.checkSemantic();
        if (this.step) this.step.checkSemantic();

        this.checkSemanticOnList(this.statement);

        if (this.condition && this.condition.type !== 'B') {
            ErrorManager.sem(0, 0, 'Condition must be of type "B"');
        }

        this.type = 'V';
    }
}

module.exports = ForStatement;

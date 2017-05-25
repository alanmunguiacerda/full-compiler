const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

const FOR_COND = {
    canBreak: true,
    canContinue: true,
};

class ForStatement extends TreeNode {
    constructor(initializer, condition, step, stms, token) {
        super(null, token);
        this.initializer = initializer || new TreeNode(null, token);
        this.condition = condition || new TreeNode(null, token);
        this.step = step || new TreeNode(null, token);
        this.stms = stms;
    }

    checkSemantic() {
        this.condition.checkSemantic();
        this.initializer.checkSemantic();
        this.step.checkSemantic();
        const cond = this.condition;
        const init = this.initializer;
        const step = this.step;
        let type = 'V';

        if (init.right.type !== 'I') {
            ErrorManager.sem(init.right.row, init.right.col, 'For counter must be of type "I"');
            type = 'E';
        }

        if (step.right.type !== 'I') {
            ErrorManager.sem(step.row, step.col, 'For step must be of type "I"');
            type = 'E';
        }

        if (cond.right.type !== 'I') {
            ErrorManager.sem(cond.right.row, cond.right.col, 'For limit must be of type "I"');
            type = 'E';
        }

        if (cond && cond.type !== 'B') {
            ErrorManager.sem(cond.row, cond.col, 'Condition must be of type "B"');
            type = 'E';
        }

        TreeNode.checkSemanticOnList(this.stms, FOR_COND);

        this.type = type;
    }

    generateCode() {
        const trueLbl = TreeNode.getUniqueLabel('true');
        const falseLbl = TreeNode.getUniqueLabel('false');
        const forLbl = TreeNode.getUniqueLabel('for');
        const forIncrLbl = TreeNode.getUniqueLabel('forIncr');
        const arrayToPush = TreeNode.arrayToPush.arrayToPush;
        const cond = { breakTo: falseLbl, continueTo: forIncrLbl };

        this.initializer.generateCode();
        let line = TreeNode.arrayToPush.line;
        TreeNode.codeLabels.push(`${forLbl},I,I,${line},0,#,`);
        this.condition.generateCode();

        line = TreeNode.arrayToPush.line;
        arrayToPush.push(`${line} JMC V, ${trueLbl}`);
        arrayToPush.push(`${line + 1} JMP 0, ${falseLbl}`);
        line = TreeNode.arrayToPush.line;
        TreeNode.codeLabels.push(`${forIncrLbl},I,I,${line},0,#,`);
        this.step.generateCode();
        line = TreeNode.arrayToPush.line;
        arrayToPush.push(`${line} JMP 0, ${forLbl}`);
        line = TreeNode.arrayToPush.line;
        TreeNode.codeLabels.push(`${trueLbl},I,I,${line},0,#,`);
        TreeNode.cascadeCode(this.stms, cond);
        line = TreeNode.arrayToPush.line;
        arrayToPush.push(`${line} JMP 0, ${forIncrLbl}`);
        TreeNode.codeLabels.push(`${falseLbl},I,I,${line + 1},0,#,`);
    }
}

module.exports = ForStatement;

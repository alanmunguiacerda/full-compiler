const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

const SWITCH_COND = {
    canBreak: true,
    isSwitch: true,
};

class SwitchStatement extends TreeNode {
    constructor(expr, cases, token) {
        super(token);

        this.expr = expr || new TreeNode(null, token);
        this.cases = cases;
    }

    validateDefaultCase(cases) {
        let currCase = cases;
        let hasDefault = false;
        while (currCase) {
            if (hasDefault) {
                ErrorManager.sem(
                    currCase.row,
                    currCase.col,
                    'Multiple default statements'
                );
            }
            hasDefault = !currCase.cond;
            currCase = currCase.next;
        }
    }

    checkSemantic() {
        this.expr.checkSemantic();
        SWITCH_COND.dataType = this.expr.type;

        this.validateDefaultCase(this.cases);

        TreeNode.checkSemanticOnList(this.cases, SWITCH_COND);
    }

    generateCode() {
        const casesLbls = [];
        const defaultLbl = TreeNode.getUniqueLabel('defaultCase');
        const endSwitchLbl = TreeNode.getUniqueLabel('endSwitch');
        const arrayToPush = TreeNode.arrayToPush.arrayToPush;
        let defaultPos = 0;
        let currCase = this.cases;
        let line;
        let i = 0;
        while (currCase) {
            if (!currCase.cond) {
                defaultPos = true;
                currCase = currCase.next;
                continue;
            }
            this.expr.generateCode();
            currCase.cond.generateCode();
            casesLbls.push(TreeNode.getUniqueLabel('case'));
            line = TreeNode.arrayToPush.line;
            arrayToPush.push(`${line} OPR 0, 14`);
            arrayToPush.push(`${line + 1} JMC V, ${casesLbls[i]}`);
            currCase = currCase.next;
            i += 1;
        }

        line = TreeNode.arrayToPush.line;
        if (defaultPos) {
            arrayToPush.push(`${line} JMP 0, ${defaultLbl}`);
        }

        currCase = this.cases;

        i = 0;
        while (currCase) {
            line = TreeNode.arrayToPush.line;
            const label = currCase.cond ? casesLbls[i] : defaultLbl;
            TreeNode.codeLabels.push(`${label},I,I,${line},0,#,`);
            TreeNode.cascadeCode(currCase.stms, { breakTo: endSwitchLbl });
            currCase = currCase.next;
            i += label !== defaultLbl;
        }

        line = TreeNode.arrayToPush.line;
        arrayToPush.push(`${line} JMP 0, ${endSwitchLbl}`);
        TreeNode.codeLabels.push(`${endSwitchLbl},I,I,${line + 1},0,#,`);
    }
}

module.exports = SwitchStatement;

const _ = require('underscore');

const PL = require('./plConst');

const labels = {};

const symTable = {};

const codeLabels = [];
const codeFuncs = [];
const codeInits = [];
const codeMain = [];

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

    static get codeLabels() {
        return codeLabels;
    }

    static get codeFuncs() {
        return codeFuncs;
    }

    static get codeInits() {
        return codeInits;
    }

    static get codeMain() {
        return codeMain;
    }

    static get arrayToPush() {
        let line = TreeNode.codeFuncs.length + 1;
        let arrayToPush = TreeNode.codeFuncs;

        if (context === 'g') {
            line = '';
            arrayToPush = TreeNode.codeInits;
        } else if (context === 'main') {
            line += TreeNode.codeInits.length;
            line += TreeNode.codeMain.length;
            arrayToPush = TreeNode.codeMain;
        }

        return { line, arrayToPush };
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

    static getCodeVariables() {
        return _.map(symTable, (i, k) => {
            const cls = PL.classes[i.is];
            const type = PL.types[i.type];
            const dim1 = i.sizes[0] || 0;
            const dim2 = i.sizes[1] || 0;
            return PL.varFormat(k, cls, type, dim1, dim2);
        }).concat([PL.varFormat('_P', 'I', 'I', symTable['main@g'].sizes[0])]);
    }

    generateCode() {
        const arrayToPush = TreeNode.context === 'main'
            ? TreeNode.codeMain
            : TreeNode.codeFuncs;

        arrayToPush.push(`Code for ${this.constructor.name}`);
    }

    static cascadeCode(node, cond = {}) {
        const hasContext = cond.context;
        if (hasContext) {
            TreeNode.context = cond.context;
        }

        delete cond.context;
        while (node) {
            node.generateCode(cond);
            node = node.next;
        }
        if (hasContext) {
            TreeNode.context = 'g';
        }
    }

    static getCode(node) {
        TreeNode.cascadeCode(node);
        const rowCodeInits = TreeNode.codeInits.map((s, i) => (
            `${TreeNode.codeFuncs.length + i + 1}${s}`)
        );
        return [
            ...TreeNode.getCodeVariables(),
            ...TreeNode.codeLabels,
            '@',
            ...TreeNode.codeFuncs,
            ...rowCodeInits,
            ...TreeNode.codeMain,
        ];
    }

    static getUniqueLabel(label) {
        if (TreeNode.labels[label]) {
            TreeNode.labels[label] += 1;
        } else {
            TreeNode.labels[label] = 1;
        }

        return `_${label}_${TreeNode.labels[label]}`;
    }
}

module.exports = TreeNode;

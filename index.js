const fs = require('fs');

const LexAnalyzer = require('./lexAnalyzer');
const SyntAnalyzer = require('./syntAnalyzer');
const TreeNode = require('./treeNode');
const ErrorManager = require('./errorManager');

const args = process.argv.slice(2);

const filename = args[0] || 'test.txt';

console.log(`Compiling file: ${filename}`);
const lexAnalyzer = new LexAnalyzer(filename);
const syntAnalyzer = new SyntAnalyzer(lexAnalyzer);
const tree = syntAnalyzer.analyze();
TreeNode.checkSemanticOnList(tree);
ErrorManager.logErrors();
if (!ErrorManager.length) {
    const code = TreeNode.getCode(tree);
    fs.writeFile('teTruena.eje', code.join('\n'), () => {
        console.log('teTruena.eje generated');
    });
}

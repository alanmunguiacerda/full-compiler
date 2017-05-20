const LexAnalyzer = require('./lexAnalyzer');
const SyntAnalyzer = require('./syntAnalyzer');
const TreeNode = require('./treeNode');

const args = process.argv.slice(2);

const filename = args[0] || 'test.txt';

console.log(`Iniciando análisis de archivo: ${filename}`);
const lexAnalyzer = new LexAnalyzer(filename);
const syntAnalyzer = new SyntAnalyzer(lexAnalyzer);
const tree = syntAnalyzer.analyze();
TreeNode.checkSemanticOnList(tree);

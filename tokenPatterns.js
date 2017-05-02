exports = module.exports;

exports.RES_WORDS = [
    'constante', 'decimal', 'entero', 'alfabetico',
    'logico', 'funcion', 'si', 'regresa',
    'sino', 'fin', 'inicio', 'para',
    'en', 'rango', 'a', 'incr', 'continua', 'otro',
    'decr', 'iterar', 'mientras', 'haz',
    'opcion', 'caso', 'procedimiento', 'imprime',
    'imprimenl', 'lee', 'programa', 'interrumpe',
];

exports.NEWLN = 'NEWLN';
exports.SPACE = 'SPACE';
exports.LINE_COM = 'LINE_COM';
exports.BLOCK_COM = 'BLOCK_COM';
exports.FLOAT = 'FLOAT';
exports.INT = 'INT';
exports.ASSIGN = 'ASSIGN';
exports.DELIMI = 'DELIMI';
exports.CT_LOG = 'CT_LOG';
exports.CT_ALF = 'CT_ALF';
exports.OP_LOG = 'OP_LOG';
exports.OP_ARI = 'OP_ARI';
exports.OP_REL = 'OP_REL';
exports.IDENTI = 'IDENTI';
exports.RES_WORD = 'RES_WORD';
exports.TKN_EOF = 'TKN_EOF';

exports.RE_NEWLN = /[\n]/;
exports.RE_SPACE = /[ \t]+/;
exports.RE_LINE_COM = /\/\/.*/;
exports.RE_BLOCK_COM = /\/\*(\*(?!\/)|[^*])*\*\//;
exports.RE_INT = /\d+/;
exports.RE_FLOAT = /\d+\.\d+/;
exports.RE_CT_LOG = /(falso|verdadero)/;
exports.RE_OP_LOG = /(y|o|no)/;
exports.RE_CT_ALF = /"(\\.|[^"])*"/;
exports.RE_OP_ARI = /(\+|-|\*|\/|%|\^)/;
exports.RE_OP_REL = /(<=|>=|<>|>|<|=|!=)/;
exports.RE_ASSIGN = /(:=)/;
exports.RE_DELIMI = /(\(|\)|\[|\]|;|\.|,|:)/;
exports.RE_IDENTI = /[A-Za-z_][A-Za-z0-9_]*/;

const getObject = (token, lexeme) => ({
    token,
    lexeme,
});

function addRules(lexer) {
    lexer.addRule(exports.RE_NEWLN, lexeme => getObject(exports.NEWLN, lexeme));
    lexer.addRule(exports.RE_SPACE, lexeme => getObject(exports.SPACE, lexeme));
    lexer.addRule(exports.RE_BLOCK_COM, lexeme => getObject(exports.BLOCK_COM, lexeme));
    lexer.addRule(exports.RE_LINE_COM, lexeme => getObject(exports.LINE_COM, lexeme));
    lexer.addRule(exports.RE_FLOAT, lexeme => getObject(exports.FLOAT, lexeme));
    lexer.addRule(exports.RE_INT, lexeme => getObject(exports.INT, lexeme));
    lexer.addRule(exports.RE_ASSIGN, lexeme => getObject(exports.ASSIGN, lexeme));
    lexer.addRule(exports.RE_DELIMI, lexeme => getObject(exports.DELIMI, lexeme));
    lexer.addRule(exports.RE_CT_LOG, lexeme => getObject(exports.CT_LOG, lexeme));
    lexer.addRule(exports.RE_CT_ALF, lexeme => getObject(exports.CT_ALF, lexeme));
    lexer.addRule(exports.RE_OP_LOG, lexeme => getObject(exports.OP_LOG, lexeme));
    lexer.addRule(exports.RE_OP_ARI, lexeme => getObject(exports.OP_ARI, lexeme));
    lexer.addRule(exports.RE_OP_REL, lexeme => getObject(exports.OP_REL, lexeme));
    lexer.addRule(exports.RE_IDENTI, lexeme => getObject(exports.IDENTI, lexeme));
}

exports.addRules = addRules;

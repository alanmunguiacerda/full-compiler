const varFormat = (id, cls, type, dim1 = 0, dim2 = 0) => (
    `${id},${cls},${type},${dim1},${dim2},#,`
);

const classes = {
    CONST: 'C',
    VAR: 'V',
    FUNC: 'F',
    PARAM: 'P',
};

const types = {
    I: 'E',
    F: 'R',
    S: 'A',
    B: 'L',
    V: 'V',
};

module.exports = { varFormat, classes, types };

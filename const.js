module.exports.VALID_OPERATIONS = {
    'I:=I': 'V',
    'S:=S': 'V',
    'F:=F': 'V',
    'B:=B': 'V',
    'F:=I': 'V',
    'I:=F': 'V',
    'V:=V': 'V',
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
    'I^I': 'I',
    'I^F': 'F',
    'F^I': 'F',
    'F^F': 'F',
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
    'I<>I': 'B',
    'F<>I': 'B',
    'I<>F': 'B',
    'F<>F': 'B',
    'S<>S': 'B',
    'I=I': 'B',
    'F=I': 'B',
    'I=F': 'B',
    'F=F': 'B',
    'S=S': 'B',
};

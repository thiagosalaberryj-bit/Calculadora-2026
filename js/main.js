/* main.js — Lógica de la calculadora */

const state = {
    current:          '0',
    operator:         null,
    firstOperand:     null,
    waitingForSecond: false
};

const display     = document.getElementById('display');
const exprDisplay = document.getElementById('display-expression');

const updateDisplay = (value) => { display.value = String(value); };

const formatResult = (num) => {
    if (!isFinite(num)) return 'Error';
    return String(parseFloat(num.toPrecision(12)));
};

const handleNumber = (digit) => {
    if (state.waitingForSecond) {
        state.current = digit;
        state.waitingForSecond = false;
    } else {
        state.current = state.current === '0' ? digit : state.current + digit;
    }
    updateDisplay(state.current);
};

const handleDecimal = () => {
    if (state.waitingForSecond) {
        state.current = '0.';
        state.waitingForSecond = false;
        updateDisplay(state.current);
        return;
    }
    if (!state.current.includes('.')) {
        state.current += '.';
        updateDisplay(state.current);
    }
};

const calculate = (a, b, op) => {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : null;
        default:  return b;
    }
};

const handleOperator = (op) => {
    const current = parseFloat(state.current);
    if (state.operator && !state.waitingForSecond) {
        const result = calculate(state.firstOperand, current, state.operator);
        if (result === null) { showError(); return; }
        state.current = formatResult(result);
        updateDisplay(state.current);
        state.firstOperand = parseFloat(state.current);
    } else {
        state.firstOperand = current;
    }
    state.operator         = op;
    state.waitingForSecond = true;
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    exprDisplay.textContent = `${state.firstOperand} ${symbols[op]}`;
};

const handleEquals = () => {
    if (state.operator === null || state.waitingForSecond) return;

    const a      = state.firstOperand;
    const b      = parseFloat(state.current);
    const result = calculate(a, b, state.operator);

    if (result === null) { showError(); return; }

    const symbols    = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    const expression = `${a} ${symbols[state.operator]} ${b} = ${formatResult(result)}`;

    exprDisplay.textContent = expression;
    state.current = formatResult(result);
    updateDisplay(state.current);

    state.operator         = null;
    state.firstOperand     = null;
    state.waitingForSecond = false;
};

const handleClear = () => {
    state.current          = '0';
    state.operator         = null;
    state.firstOperand     = null;
    state.waitingForSecond = false;
    exprDisplay.textContent = '';
    updateDisplay('0');
};

const handleBackspace = () => {
    if (state.waitingForSecond) return;
    state.current = state.current.length > 1
        ? state.current.slice(0, -1)
        : '0';
    updateDisplay(state.current);
};

const showError = () => {
    updateDisplay('Error');
    exprDisplay.textContent = 'División por cero';
    state.current          = '0';
    state.operator         = null;
    state.firstOperand     = null;
    state.waitingForSecond = false;
};

/* --- Botones --- */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const val = btn.dataset.value;
        if (!val) return;
        if (val === 'C')                         { handleClear();       return; }
        if (val === '=')                         { handleEquals();      return; }
        if (val === '.')                         { handleDecimal();     return; }
        if (['+', '-', '*', '/'].includes(val)) { handleOperator(val); return; }
        handleNumber(val);
    });
});

/* --- Teclado --- */
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/^\d$/.test(key))                              { handleNumber(key);   return; }
    if (key === '.')                                    { handleDecimal();     return; }
    if (['+', '-', '*', '/'].includes(key))            { handleOperator(key); return; }
    if (key === 'Enter' || key === '=')                { handleEquals();      return; }
    if (key === 'Escape' || key.toLowerCase() === 'c') { handleClear();      return; }
    if (key === 'Backspace')                           { handleBackspace();   return; }
});

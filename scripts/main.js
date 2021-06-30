var display, buttonsContainer;
var keyStack = [];
var containsOperator = false;
var displayValue = '';
var containsDecimal = false;
var memory = null;

window.addEventListener('DOMContentLoaded', () => {
	buttonsContainer = document.querySelector('#buttons');
	display = document.querySelector('#display');
	
	buttonsContainer.addEventListener('click', processButtonClick);
	document.addEventListener('keydown', handleKeyPress);
});

const processButtonClick = (e) => {
	// check to see if the button pressed is an operator
	if (e.target.classList.contains('operator-btn')) {
		handleOperator(e.target.id);
	// check to see if the button pressed is a number key
	} else if (e.target.classList.contains('number-btn')) {
		handleValue(e.target.id, e.target.textContent);
	// check to see if the button pressed is a utility function
	} else if (e.target.classList.contains('option-btn')) {
		if (e.target.id == 'memory') {
			loadFromMemory();
		} else if (e.target.id == 'clear') {
			clearAll();
		} else if (e.target.id == 'backspace') {
			hanleBackspace();
		} else if (e.target.id == 'percent') {
			convertToPercent();
		}
	}

}

const loadFromMemory = () => {
	if (containsOperator) {
				var elem;
				while((elem = keyStack.pop()) != null) {
					if (elem == 'add' || elem == 'sub' || elem == 'mult' || elem == 'sqrt' || elem == 'div') {
						break;
					}
				}
				keyStack.push(elem);
			}
			keyStack.push(memory);
}

const handleBackspace = () => {
	keyStack.pop();
	makeDisplayValue();
	updateDisplay();
}

const convertToPercent = () => {
	if (!containsOperator) {
				keyStack.push('div');
				keyStack.push('100');
				var result = calculate();
				displayValue = result;
				updateDisplay();
				keyStack.push(result);
			} else {
				var accum = '';
				var elem;
				while ((elem = keyStack.pop()) != null) {
					if (elem == 'add' || elem == 'sub' || elem == 'mult' || elem == 'sqrt' || elem == 'div') {
						break;
					}
					accum = elem + accum;
				}
				keyStack.push(elem);
				var result = (+accum) / 100;
				keyStack.push(result);
				displayValue = result;
				updateDisplay();
			}
}

const makeDisplayValue = () => {
	displayValue = '';
	for (var i = keyStack.length - 1; i >= 0; i--) {
		var elem = keyStack[i];
		if (elem == 'add' || elem == 'sub' || elem == 'mult' || elem == 'sqrt' || elem == 'div') {
			break;
		}
		displayValue = keyStack[i] + displayValue;
	}
}

const clearAll = () => {
	keyStack = [];
	containsOperator = false;
	containsDecimal = false;
	displayValue = '';
	updateDisplay();
}

const updateDisplay = () => {
	display.textContent = displayValue || '0';
}

const calculate = () => {
	var result = 0;
	var lOperand = '', 
		rOperand = '',
		operator = undefined;
	var elem = keyStack.pop();
	while (elem && (elem != "add" && elem != "sub" && elem != "mult" && elem != "sqrt" && elem != "div")) {
		rOperand = elem + rOperand;
		elem = keyStack.pop();
	}
	operator = elem;
	if (operator == null || operator == undefined) {
		return lOperand;
	}
	elem = keyStack.pop();
	while (elem && (elem != "add" && elem != "sub" && elem != "mult" && elem != "sqrt" && elem != "div")) {
		lOperand = elem + lOperand;
		elem = keyStack.pop();
	}
	switch (operator) {
		case 'add':
			result = (+lOperand) + (+rOperand);
			break;
		case 'sub':
			result = (+lOperand) - (+rOperand);
			break;
		case 'mult':
			result = (+lOperand) * (+rOperand);
			break;
		case 'div':
			if ((+rOperand) === 0) {
				result = NaN;
			} else {
				result = (+lOperand) / (+rOperand);
			}
			break;
		case 'sqrt':
			result = Math.sqrt(+lOperand);
			break;
		default:
			break;
	}
	
	return result;
}

const handleValue = (id, content) => {
	// if the button pressed was a decimal, make sure we don't get two decimals and push
		// the stack
		if (!containsDecimal && id === 'dec') {
			keyStack.push('.');
			containsDecimal = true;
		// otherwise if it isn't a decimal key, push the number to the stack
		} else if (id === 'dbl-zer') {
			keyStack.push(0);
			keyStack.push(0);
		} else if (id !== 'dec') {
			keyStack.push(+content);
		}
		makeDisplayValue();
		updateDisplay();
}

const handleOperator = (op) => {
	if (op === 'equal') {
			let result = calculate();
			if (!Number.isNaN(result)) {
				memory = result;
				displayValue = result.toString();
			} else {
				displayValue = 'Error';
			}
			containsOperator = false;
			updateDisplay();
		// if the operator is sqrt, push the operator to stack and calculate the result
		} else if (!containsOperator && op === 'sqrt') {
			keyStack.push(op);
			let result = calculate();
			if (!Number.isNaN(result)) {
				memory = result;
				displayValue = result.toString();
			} else {
				displayValue = 'Error';
			}			
			containsOperator = false;
			updateDisplay();
		// push the operator onto the stack if we don't already have one
		} else if (!containsOperator) {
			if (keyStack.length == 0 && memory != null) {
				keyStack.push(memory);
			}
			keyStack.push(op);
			containsOperator = true;
			displayValue = '';
			updateDisplay();
		
		// otherwise, we have an operator already, calculate the result and push the 
		// result and the new operator to the stack
		} else {
			var elem = keyStack.pop();
			if (elem == 'add' || elem == 'sub' || elem == 'mult' || elem == 'sqrt' || elem == 'div') {
				keyStack.push(op);
				return;
			}
			
			let result = calculate();
			if (!Number.isNaN(result)) {
				memory = result;
				displayValue = result.toString();
			} else {
				displayValue = 'Error';
			}
			if (op !== 'eq') {
				containsOperator = true;
				keyStack.push(memory);
				keyStack.push(op);
			} else {
				containsOperator = false;
			}
			displayValue = '';
			updateDisplay();
		}
		containsDecimal = false;
}

const handleKeyPress = (e) => {
	let key = e.key;
	
	switch(key) {
		case '1':
			handleValue('one', 1);
			break;
		case '2':
			handleValue('two', 2);
			break;
		case '3':
			handleValue('three', 3);
			break;
		case '4':
			handleValue('four', 4);
			break;
		case '5':
			handleValue('five', 5);
			break;
		case '6':
			handleValue('six', 6);
			break;
		case '7':
			handleValue('seven', 7);
			break;
		case '8':
			handleValue('eight', 8);
			break;
		case '9':
			handleValue('nine', 9);
			break;
		case '0':
			handleValue('zero', 0);
			break;
		case '+':
			handleOperator('add');
			break;
		case '-':
			handleOperator('sub');
			break;
		case '*':
			handleOperator('mult');
			break;
		case '/':
			handleOperator('div');
			break;
		case 'Enter':
		case '=':
			handleOperator('equal');
			break;
		case '.':
			handleValue('dec', '.');
			break;
		case '%':
			convertToPercent();
			break;
		case 'Backspace':
			handleBackspace();
			break;
		default:
			break;
	}

}

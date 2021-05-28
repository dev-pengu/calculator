const display = document.querySelector('#display');

let leftOperand = null;
let rightOperand = null;
let operator;
let prevResult;
let result = null;
let containsDecimal = false;

document.querySelectorAll('.number-btn').forEach((btn) => {
	btn.addEventListener('click', function(e) {
		addInput(e.target.textContent);
	});
});

document.querySelectorAll('.operator-btn').forEach((btn) => {
	btn.addEventListener('click', function(e) {
		processOperator(e.target.getAttribute('id'));
		containsDecimal = false;
	});
});

document.querySelector('#clear').addEventListener('click', () => {
	leftOperand = null;
	rightOperand = null;
	display.textContent = '0';
	containsDecimal = false;
});

document.querySelector('#memory').addEventListener('click', () => {
	display.textContent = prevResult;
});

function processOperator(op) {
	if (op == 'equal' || (leftOperand != null && rightOperand != null)) {
		rightOperand = (+display.textContent);
		result = Number(calculateResult());
		displayResult();
		operator = 'equal'
		rightOperand = null;
	} else if (op == 'sqr-rt') {
		leftOperand = (+display.textContent);
		operator = op;
		result = calculateResult();
		displayResult();
	} else {
		leftOperand = (+display.textContent);
		display.textContent = "0";
		operator = op;
	}
}

function calculateResult() {
	switch(operator) {
		case 'add':
			return leftOperand + rightOperand;
		case 'sub':
			return leftOperand - rightOperand;
		case 'mult':
			return leftOperand * rightOperand;
		case 'division':
			return leftOperand / rightOperand;
		case 'sqr-rt':
			return Math.sqrt(leftOperand);
	}
}

function displayResult() {
	prevResult = result;
	display.textContent = result.toString();
	result = null;
}

function addInput(txt) {
	if (txt == '.' && containsDecimal) {
		return;
	}
	
	if (display.textContent[0] == '0') {
		display.textContent = '';
	}
	
	if (operator == 'equal' && result != null) {
		display.textContent = '';
	}
	
	if (txt == '.') {
		containsDecimal = true;
	}
	display.textContent += txt;
}
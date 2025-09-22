// Default Variables
let currentInput = "";
let operator = null;
let expression = [];

const displayExpression = document.querySelector("#expression");
const displayResult = document.querySelector("#display");

function updateDisplay(value) {
  if (value !== undefined) {
    displayExpression.textContent = value;
  } else if (currentInput !== "") {
    displayExpression.textContent = currentInput;
  } else if (previousInput !== "") {
    displayExpression.textContent = previousInput;
  } else {
    displayExpression.textContent = "0";
  }
}

function handleNumber(num) {
  currentInput += num;
  updateDisplay();
}

function handleOperator(op) {
  if (currentInput !== "") {
    expression.push(currentInput); // push last number
    currentInput = "";
  }
  if (expression.length === 0) return; // don't allow starting with operator

  let last = expression[expression.length - 1];
  if (isNaN(last)) {
    // replace operator if user clicks twice
    expression[expression.length - 1] = op;
  } else {
    expression.push(op);
  }
  operator = op;
  updateDisplay(expression.join(" "));
}

function evaluateExpression(tokens) {
  // convert to numbers where possible
  tokens = tokens.map((t) => (isNaN(t) ? t : parseFloat(t)));

  // pass 1: handle * and /
  let pass1 = [];
  let i = 0;
  while (i < tokens.length) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      let prev = pass1.pop();
      let next = tokens[i + 1];
      if (tokens[i] === "/" && next === 0) return "Error";
      let result = tokens[i] === "*" ? prev * next : prev / next;
      pass1.push(result);
      i += 2;
    } else {
      pass1.push(tokens[i]);
      i++;
    }
  }

  // pass 2: handle + and -
  let result = pass1[0];
  for (let j = 1; j < pass1.length; j += 2) {
    let op = pass1[j];
    let next = pass1[j + 1];
    if (op === "+") result += next;
    if (op === "-") result -= next;
  }

  return result;
}

function calculate() {
  if (currentInput !== "") {
    expression.push(currentInput); // push last number
  }
  if (expression.length === 0) return;

  let result = evaluateExpression(expression);

  currentInput = String(result);
  previousInput = "";
  operator = null;
  expression = []; // clear for next calculation

  updateDisplay(currentInput);
  displayResult.textContent = result;
}

function clearAll() {
  currentInput = "";
  previousInput = "";
  operator = null;
  expression = [];
  updateDisplay("0");
  displayResult.textContent = "0";
}

function backspace() {
  if (currentInput.length > 0) {
    currentInput = currentInput.toString().slice(0, -1);
  }
  updateDisplay();
}

function addDecimal() {
  if (!currentInput.includes(".")) {
    currentInput = currentInput === "" ? "0." : currentInput + ".";
  }
  updateDisplay();
}

function percentage() {
  if (!currentInput) return;

  currentInput = String(currentInput / 100);
  updateDisplay();
}

function fraction() {
  if (!currentInput) return;

  currentInput = String(1 / currentInput);
  updateDisplay();
}

function exponent() {
  if (!currentInput) return;

  currentInput = String(Math.pow(currentInput, 2));
  updateDisplay();
}

function square() {
  if (!currentInput) return;

  currentInput = String(Math.sqrt(currentInput));
  updateDisplay();
}

function convertToNegative() {
  if (currentInput !== 0 && currentInput === currentInput) {
    currentInput = String(-currentInput);
    updateDisplay();
  }
}

// Events
document.querySelectorAll("[data-num]").forEach((btn) => {
  btn.addEventListener("click", () => handleNumber(btn.dataset.num));
});

document.querySelectorAll("[data-op]").forEach((btn) => {
  btn.addEventListener("click", () => handleOperator(btn.dataset.op));
});

document.getElementById("equals").addEventListener("click", calculate);
document.getElementById("clear").addEventListener("click", clearAll);
document.getElementById("CE").addEventListener("click", clearAll);
document.getElementById("backspace").addEventListener("click", backspace);
document.getElementById("decimal").addEventListener("click", addDecimal);
document.getElementById("percentage").addEventListener("click", percentage);
document.getElementById("fraction").addEventListener("click", percentage);
document.getElementById("square").addEventListener("click", square);
document.getElementById("exponent").addEventListener("click", exponent);
document.getElementById("pos-neg").addEventListener("click", convertToNegative);

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (!isNaN(e.key)) {
    handleNumber(e.key);
  } else if (["+", "-", "*", "/"].includes(e.key)) {
    handleOperator(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calculate();
  } else if (e.key === "Backspace") {
    backspace();
  } else if (e.key === "Escape") {
    clearAll();
  } else if (e.key === ".") {
    addDecimal();
  }
});

// Initialize
updateDisplay("0");

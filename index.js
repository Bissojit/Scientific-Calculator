// Calculator & Graph Logic
const screen = document.querySelector('#screen');
const btns = document.querySelectorAll('.btn');
const historyList = document.querySelector('#historyList');
const themeToggle = document.getElementById('themeToggle');
const angleToggle = document.getElementById('angleToggle');

let isDegree = true;

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.checked = true;
  }

  if (localStorage.getItem("angle") === "radian") {
    isDegree = false;
    angleToggle.checked = true;
  }

  const savedHistory = JSON.parse(localStorage.getItem("history") || "[]");
  savedHistory.forEach(expr => addToHistory(expr));
};

// Theme and angle unit toggles
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

angleToggle.addEventListener('change', () => {
  isDegree = !angleToggle.checked;
  localStorage.setItem("angle", isDegree ? "degree" : "radian");
});

// Keyboard input support
document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (!isNaN(key) || "+-*/.()".includes(key)) {
    screen.value += key;
  } else if (key === "Enter") {
    calculate();
  } else if (key === "Backspace") {
    backspc();
  } else if (key === "Escape") {
    clearScreen();
  }
});

btns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    let text = e.target.innerText;
    if (text === '×') text = '*';
    if (text === '÷') text = '/';
    screen.value += text;
  });
});

function calculate() {
  try {
    const result = eval(screen.value);
    addToHistory(`${screen.value} = ${result}`);
    screen.value = result;
  } catch {
    alert("Invalid Input");
    clearScreen();
  }
}

function clearScreen() { screen.value = ''; }
function sin() { screen.value = Math.sin(convertAngle(screen.value)).toFixed(8); }
function cos() { screen.value = Math.cos(convertAngle(screen.value)).toFixed(8); }
function tan() { screen.value = Math.tan(convertAngle(screen.value)).toFixed(8); }
function sqrt() { screen.value = Math.sqrt(screen.value).toFixed(8); }
function log() { screen.value = Math.log10(screen.value).toFixed(8); }
function ln() { screen.value = Math.log(screen.value).toFixed(8); }
function abs() { screen.value = Math.abs(screen.value); }
function exp() { screen.value = Math.exp(screen.value).toFixed(8); }
function mod() {
  let a = parseFloat(prompt("Enter first number (a):"));
  let b = parseFloat(prompt("Enter second number (b):"));
  screen.value = a % b;
}
function floor() { screen.value = Math.floor(screen.value); }
function ceil() { screen.value = Math.ceil(screen.value); }
function pi() { screen.value += Math.PI.toFixed(10); }
function e() { screen.value += Math.E.toFixed(10); }
function percent() { screen.value = eval(screen.value) / 100; }
function pow() {
  const base = parseFloat(prompt("Enter base:"));
  const exp = parseFloat(prompt("Enter exponent:"));
  screen.value = Math.pow(base, exp).toFixed(8);
}
function fact() {
  const num = parseInt(screen.value);
  if (num < 0) return alert("Negative factorial not defined");
  screen.value = factorial(num);
}
function backspc() { screen.value = screen.value.slice(0, -1); }
function factorial(n) { return (n <= 1) ? 1 : n * factorial(n - 1); }
function convertAngle(val) {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : (isDegree ? (num * Math.PI / 180) : num);
}

// History
function addToHistory(expr) {
  const li = document.createElement("li");
  li.textContent = expr;
  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.onclick = () => {
    li.remove();
    updateHistoryStorage();
  };
  li.appendChild(delBtn);
  historyList.prepend(li);

  updateHistoryStorage();
}

function updateHistoryStorage() {
  const entries = Array.from(historyList.children).map(li => li.firstChild.textContent.trim());
  localStorage.setItem("history", JSON.stringify(entries));
}

function clearHistory() {
  historyList.innerHTML = '';
  localStorage.setItem("history", JSON.stringify([]));
}

// Graph Plotting
function plotGraph() {
  const inputRaw = document.getElementById("graphInput").value.trim();
  const canvas = document.getElementById("graphCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!inputRaw) {
    alert("Please enter a function to plot");
    return;
  }

  // Draw X and Y axis with numbers
  const scale = 40;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.font = "10px Arial";
  for (let i = -10; i <= 10; i++) {
    ctx.fillText(i, centerX + i * scale, centerY + 12);
    ctx.fillText(i, centerX + 5, centerY - i * scale);
  }

  let expr = inputRaw;
  if (expr.includes('=')) {
    const parts = expr.split('=');
    expr = parts[1].trim();
  }
  expr = expr.replace(/\^/g, '**');
  const funcs = ['sin', 'cos', 'tan', 'log', 'ln', 'exp', 'abs', 'sqrt'];
  funcs.forEach(f => {
    const jsFunc = f === 'ln' ? 'Math.log' : 'Math.' + f;
    expr = expr.replace(new RegExp(`\\b${f}\\b`, 'g'), jsFunc);
  });

  const vars = {};
  const matches = expr.match(/\b[a-zA-Z]\b/g);
  if (matches) {
    matches.forEach(v => { if (v !== 'x') vars[v] = null; });
  }
  for (const v in vars) {
    let val = prompt(`Enter value for ${v}`);
    vars[v] = parseFloat(val) || 0;
  }

  ctx.beginPath();
  ctx.strokeStyle = "#007bff";
  let first = true;
  for (let px = 0; px <= canvas.width; px++) {
    let x = (px - centerX) / scale;
    let scope = {x, ...vars};
    try {
      const func = new Function(...Object.keys(scope), `return ${expr}`);
      let y = func(...Object.values(scope));
      if (!isFinite(y)) { first = true; continue; }
      let py = centerY - y * scale;
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else {
        ctx.lineTo(px, py);
      }
    } catch {
      alert("Invalid expression");
      return;
    }
  }
  ctx.stroke();
}

// Reveal main app after splash screen animation
window.addEventListener("load", () => {
    setTimeout(() => {
      document.getElementById("splash-screen").style.display = "none";
      document.getElementById("appWrapper").style.display = "block";
    }, 3500); // Total animation time
  });
  
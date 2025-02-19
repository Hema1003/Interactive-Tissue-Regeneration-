const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const addCellButton = document.getElementById('addCell');
const addScaffoldButton = document.getElementById('addScaffold');
const regenerateButton = document.getElementById('regenerate');
const speedInput = document.getElementById('speedInput');
const speedValue = document.getElementById('speedValue');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 500;

// Simulation parameters
let cellSpeedMultiplier = 1;
const scaffoldParticles = [];
const cells = [];
const attachDistance = 20;

// Generate glowing effect
function drawGlow(x, y, size, color) {
  const gradient = ctx.createRadialGradient(x, y, size / 4, x, y, size);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

// Add scaffold particles
function addScaffold(x, y) {
  scaffoldParticles.push({
    x,
    y,
    attached: false,
    size: 5,
  });
}

// Add cell particles
function addCell(x, y) {
  cells.push({
    x,
    y,
    dx: Math.random() * 2 - 1,
    dy: Math.random() * 2 - 1,
    attached: false,
    size: 10,
  });
}

// Draw scaffold
function drawScaffold() {
  scaffoldParticles.forEach(p => {
    drawGlow(p.x, p.y, 15, p.attached ? 'lime' : 'gray');
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.attached ? 'lime' : 'gray';
    ctx.fill();
  });
}

// Draw cells
function drawCells() {
  cells.forEach(c => {
    drawGlow(c.x, c.y, 20, c.attached ? 'blue' : 'red');
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.fillStyle = c.attached ? 'blue' : 'red';
    ctx.fill();
  });
}

// Update simulation
function updateSimulation() {
  cells.forEach(cell => {
    if (!cell.attached) {
      // Move cells
      cell.x += cell.dx * cellSpeedMultiplier;
      cell.y += cell.dy * cellSpeedMultiplier;

      // Bounce off edges
      if (cell.x < 0 || cell.x > canvas.width) cell.dx *= -1;
      if (cell.y < 0 || cell.y > canvas.height) cell.dy *= -1;

      // Check attachment
      scaffoldParticles.forEach(scaffold => {
        if (!scaffold.attached) {
          const distance = Math.hypot(cell.x - scaffold.x, cell.y - scaffold.y);
          if (distance < attachDistance) {
            scaffold.attached = true;
            cell.attached = true;
          }
        }
      });
    }
  });
}

// Regenerate scaffold
function regenerateScaffold() {
  scaffoldParticles.forEach(p => (p.attached = false));
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScaffold();
  drawCells();
  updateSimulation();
  requestAnimationFrame(animate);
}

// Event listeners
addScaffoldButton.addEventListener('click', () => addScaffold(Math.random() * canvas.width, Math.random() * canvas.height));
addCellButton.addEventListener('click', () => addCell(Math.random() * canvas.width, Math.random() * canvas.height));
regenerateButton.addEventListener('click', regenerateScaffold);

speedInput.addEventListener('input', () => {
  cellSpeedMultiplier = parseFloat(speedInput.value);
  speedValue.textContent = cellSpeedMultiplier.toFixed(1);
});

// Start simulation
animate();


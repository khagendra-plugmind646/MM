// Canvas setup
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; // Set canvas width to full viewport width
canvas.height = window.innerHeight; // Set canvas height to full viewport height

// Load mobile phone sticker image
const phoneImage = new Image();
phoneImage.src = 'h123.png'; // Path to your mobile phone sticker image

// Load tower image
const towerImage = new Image();
towerImage.src = 'h12.png'; // Path to your tower image

// Ensure images are loaded before drawing
towerImage.onload = () => {
  drawTower(); // Draw the tower once the image is loaded
};
phoneImage.onload = () => {
  placeMen(); // Place nodes after the phone image is loaded
};

// Function to draw the tower using the tower image
function drawTower() {
  const towerWidth = 600;  // Adjust as needed for your tower size
  const towerHeight = 650; // Adjust as needed for your tower size

  const x = canvas.width / 8 - towerWidth / 2;  // Center horizontally
  const y = canvas.height / 2.3 - towerHeight / 4; // Center vertically

  ctx.drawImage(towerImage, x, y, towerWidth, towerHeight);
}

// Function to get a random position below the tower
function getRandomPosition(radius) {
  const angle = Math.random() * Math.PI; // Angle between 0 and π (below the tower)
  const distance = Math.random() * radius;
  const x = canvas.width / 2 + Math.cos(angle) * distance;
  const y = canvas.height / 2 + Math.sin(angle) * distance;
  return { x, y };
}

// Function to draw a node as a mobile phone sticker
function drawNode(x, y) {
  const aspectRatio = phoneImage.width / phoneImage.height;
  const height = 50; 
  const width = height * aspectRatio;
  ctx.drawImage(phoneImage, x - width / 2, y - height, width, height);
}

// Function to deploy nodes (mobile stickers)
function placeMen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawTower(); // Redraw the tower

  const numMen = parseInt(document.getElementById('numMen').value) || 0;
  const radius = parseInt(document.getElementById('radius').value) || 0;

  if (numMen <= 0 || radius <= 0) {
    alert("Please enter valid inputs.");
    return;
  }

  const maxNodes = 50; // Limit the number of nodes
  const nodes = [];
  const minDistance = 170; // Increased distance between nodes

  for (let i = 0; i < Math.min(numMen, maxNodes); i++) {
    let position;
    let tooClose = true;

    // Ensure new node is not too close to any existing node
    while (tooClose) {
      position = getRandomPosition(radius);
      tooClose = nodes.some(node => {
        const distance = Math.sqrt(
          Math.pow(position.x - node.x, 2) + Math.pow(position.y - node.y, 2)
        );
        return distance < minDistance; // Check against new minimum distance
      });
    }

    // Ensure the node is placed below the tower
    if (position.y > canvas.height / 2) {
      drawNode(position.x, position.y);
      nodes.push(position); // Store the position of the new node
    } else {
      i--; // Retry if the position is not valid
    }
  }
}

// Attach event listener to the deploy button
document.getElementById('deployBtn').addEventListener('click', placeMen);

// Initial drawing of the tower
drawTower();
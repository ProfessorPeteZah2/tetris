var CELL_SIZE = 20;
var BACKGROUND_COLOR = '#032753';

// Lowercase are for landed block colors.
var COLORS = {  
              // Main Colors
                I : "#00ffff",
                O : "#ffff00",
                T : "#9d11f5",
                S : "#00ff00",
                Z : "#ff0000",
                J : "#1a00f7",
                L : "#ff540e",

              // Top Highlight
                ih : "#99fffe",
                oh : "#fefe99",
                th : "#d9a1f8",
                sh : "#99ff99",
                zh : "#ff9999",
                jh : "#a1a1f8",
                lh : "#ffae99",

              // Side Shadow
                is : "#00cccc",
                os : "#cccc44",
                ts : "#7e0dcc",
                ss : "#01cc40",
                zs : "#cc0013",
                js : "#130dc2",
                ls : "#e6311b",

              // Bottom Shadow
                ib : "#007f7f",
                ob : "#7f7f26",
                tb : "#4e047f",
                sb : "#017f24",
                zb : "#7f0007",
                jb : "#0a0575",
                lb : "#99210f",

              // Other

                N : BACKGROUND_COLOR,
                GRID : "#d9d9d9"

                              };

function Canvas(height, width) {

  this.height = height;
  this.width = width;
  console.log(height, width);

  this.gridHeight = height * (CELL_SIZE + 1);
  this.gridWidth = width * (CELL_SIZE + 1);

  this.c = document.createElement("canvas");
  this.ctx = this.c.getContext("2d");
  var c = this.c;
  var ctx = this.ctx;

  holder = document.getElementById("game-window");
  holder.appendChild(c);
  c.id = "tetris-canvas";
  // Include right border
  ctx.canvas.height = this.gridHeight + 1;
  ctx.canvas.width = this.gridWidth + 1;

  for (var i = 0; i <= width; i++) {
    // 0.5 ensures line is drawn to overlap border instead of starting on it.
    var x = i * (CELL_SIZE + 1) + 0.5;
    ctx.moveTo(x, 0.5);
    ctx.lineTo(x, this.gridHeight);
  }
  
  // too much space in bottom right corner error probably caused  here: line too long
  for (var i = 0; i <= height; i++) {
    var y = i * (CELL_SIZE + 1) + 0.5;
    ctx.moveTo(0.5, y);
    ctx.lineTo(this.gridWidth, y);
  }

  ctx.strokeStyle = COLORS["GRID"];
  ctx.stroke();

  document.getElementById("tetris-canvas").style.background = BACKGROUND_COLOR;


}

Canvas.prototype.redraw = function(stateString) {

    // Convert string to coordinates
    for (var i = 0; i < stateString.length; i++) {
      // Element (x,y) = x + (y * gridWidth)
      var y = Math.floor(i / this.width);

      var x = i % this.width;

      this.drawBlock(stateString.charAt(i), x, y); 
    }
}

Canvas.prototype.drawBlock = function(type, x, y) {


  var startX = x * (CELL_SIZE + 1) + 1.5;
  var startY = y * (CELL_SIZE + 1) + 1.5;
   
  //console.log(startX) // should show problem with bottom corner bug. 
  this.ctx.fillStyle = COLORS[type];
  this.ctx.fillRect(startX, startY, CELL_SIZE -0.5, CELL_SIZE - 0.5);
  if (type !== 'N') {
    this.drawShadows(type, startX, startY);
  }
}

Canvas.prototype.drawShadows = function(type, x, y) {

  var shadowSize = CELL_SIZE / 8,
      cellWidth = CELL_SIZE -1;

  // get co-ordinates
  // O = outer, I = inner
  var coordinates = { aO: [x, y],
                      aI: [x + shadowSize, y + shadowSize],
                      bO: [x + cellWidth, y],
                      bI: [x + cellWidth - shadowSize, y + shadowSize], 
                      cO: [x + cellWidth, y + cellWidth],
                      cI: [x + cellWidth - shadowSize, y + cellWidth - shadowSize],
                      dO: [x, y + cellWidth],
                      dI: [x + shadowSize, y + cellWidth - shadowSize] };
  
  var topFill = COLORS[type.toLowerCase() + "h"];
  var sideFill = COLORS[type.toLowerCase() + "s"];
  var bottomFill = COLORS[type.toLowerCase() + "b"];

  this.drawIndividualShadow(topFill, coordinates["aO"], coordinates["aI"], coordinates["bI"], coordinates["bO"]);
  this.drawIndividualShadow(sideFill, coordinates["bO"], coordinates["bI"], coordinates["cI"], coordinates["cO"]);
  this.drawIndividualShadow(bottomFill, coordinates["cO"], coordinates["cI"], coordinates["dI"], coordinates["dO"]);
  this.drawIndividualShadow(sideFill, coordinates["dO"], coordinates["dI"], coordinates["aI"], coordinates["aO"]);
}

Canvas.prototype.drawIndividualShadow = function(fillStyle, point1, point2, point3, point4) {

  var ctx = this.ctx;

  ctx.beginPath();
  
  ctx.moveTo(point1[0], point1[1]);
  ctx.lineTo(point2[0], point2[1]);
  ctx.lineTo(point3[0], point3[1]);
  ctx.lineTo(point4[0], point4[1]);
  
  ctx.fillStyle = fillStyle;
  ctx.fill();
}
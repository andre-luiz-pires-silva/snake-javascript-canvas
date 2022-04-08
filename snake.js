const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const canvas_size = 200;
const cell_size = 20;

var grid, apple, snake;

class Grid {
  constructor(size) {
    this.positions = [];
    for (let column = 0; column < size; column++) {
      this.positions[column] = [];
      for (let row = 0; row < size; row++) {
        this.positions[column][row] = {
          x: column * cell_size,
          y: row * cell_size
        };
      }
    }
  }

  draw = () => {
    this.positions.flat().forEach(position => context.rect(position.x, position.y, cell_size, cell_size));
  };
}

class Apple {
  constructor(position) {
    this.position = position;
  }

  draw = () => {
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, cell_size, cell_size);
  };
}

class Snake {
  constructor(positions) {
    this.positions = positions;
  }

  move = () => {
    let headPosition = this.positions[0];
    let column = headPosition.x / cell_size;
    let row = headPosition.y / cell_size;
    column++;

    let isInsideGrid = row >= 0 && row < grid.positions.length &&
                       column >= 0 && column < grid.positions.length;
    if (isInsideGrid) {
      const nextHeadPosition = grid.positions[column][row];
      this.positions.unshift(nextHeadPosition);
      this.positions.pop();
    }
  }

  draw = () => {
    context.fillStyle = "green";
    this.positions.forEach(position => context.fillRect(position.x, position.y, cell_size, cell_size));
  };
}

const loop = () => {
  context.clearRect(0, 0, canvas_size, canvas_size);
  grid.draw();
  apple.draw();
  snake.move();
  snake.draw();
  context.stroke();
}

const initialize = () => {
  canvas.width = canvas_size;
  canvas.height = canvas_size;

  grid = new Grid(canvas_size / cell_size);
  apple = new Apple(grid.positions[4][4]);
  snake = new Snake([grid.positions[0][0], grid.positions[1][0]]);

  setInterval(loop, 200);
}

initialize();
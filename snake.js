const messages = document.getElementById("messages");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const canvas_size = 200;
const cell_size = 20;
const directions = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 }
};

var grid, apple, snake, interval;

getRandomFreePosition = () => {
  let freePositions = grid.positions.flat().filter((position) => !snake.positions.includes(position));
  let randomIndex = Math.floor(Math.random() * freePositions.length);
  return freePositions[randomIndex];
};

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
    this.positions.flat().forEach((position) => context.rect(position.x, position.y, cell_size, cell_size));
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
  constructor(positions, direction) {
    this.positions = positions;
    this.direction = direction;
  }

  move = () => {
    let headPosition = this.positions[0];
    let column = headPosition.x / cell_size + this.direction.x;
    let row = headPosition.y / cell_size + this.direction.y;

    let isOutOfGrid = !grid.positions[column] || !grid.positions[column][row];
    if (isOutOfGrid) {
      return gameOver("Game Over.");
    }

    headPosition = grid.positions[column][row];
    this.positions.unshift(headPosition);
    let dropedTail = this.positions.pop();

    let tailPositions = this.positions.slice(1);
    let selfColide = tailPositions.includes(headPosition);
    if (selfColide) {
      return gameOver("Game Over.");
    }

    let eatApple = headPosition == apple.position;
    if (eatApple) {
      this.positions.push(dropedTail);
      let newApplePosition = getRandomFreePosition();
      if (!newApplePosition) {
        return gameOver("You Win!");
      }
      apple = new Apple(newApplePosition);
    }
  };

  draw = () => {
    context.fillStyle = "green";
    this.positions.forEach((position) =>
      context.fillRect(position.x, position.y, cell_size, cell_size)
    );
  };
}

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowDown" && snake.direction.y == 0) {
    snake.direction = directions.down;
  } else if (event.key == "ArrowUp" && snake.direction.y == 0) {
    snake.direction = directions.up;
  } else if (event.key == "ArrowRight" && snake.direction.x == 0) {
    snake.direction = directions.right;
  } else if (event.key == "ArrowLeft" && snake.direction.x == 0) {
    snake.direction = directions.left;
  }
});

const loop = () => {
  context.clearRect(0, 0, canvas_size, canvas_size);
  grid.draw();
  snake.move();
  snake.draw();
  apple.draw();
  context.stroke();
};

const initialize = () => {
  canvas.width = canvas_size;
  canvas.height = canvas_size;

  grid = new Grid(canvas_size / cell_size);
  snake = new Snake([grid.positions[0][0], grid.positions[1][0]], directions.right);
  apple = new Apple(getRandomFreePosition());

  interval = setInterval(loop, 200);
};

const gameOver = (message) => {
  messages.innerText = `${message} Press F5 to start again.`;
  clearInterval(interval);
};

initialize();
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const canvas_size = 200;

canvas.width = canvas_size;
canvas.height = canvas_size;

context.rect(0, 0, canvas_size, canvas_size);
context.stroke();
export const drawCenterLine = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) => {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
};

export const drawCenterCircle = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) => {
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
  ctx.stroke();
};

export const drawGoals = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) => {
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 0, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
};

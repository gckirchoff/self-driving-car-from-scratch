const canvas = document.getElementById('myCanvas');
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road({ x: canvas.width / 2, width: canvas.width * 0.9 });
const car = new Car({
  x: road.getLaneCenter(1),
  y: 100,
  width: 30,
  height: 50,
  playerCar: true,
});
const traffic = [
  new Car({
    x: road.getLaneCenter(1),
    y: -100,
    width: 30,
    height: 50,
    maxSpeed: 2,
  }),
];

animate();

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders);
  }
  car.update(road.borders);
  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx);
  }
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}

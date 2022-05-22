const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road({ x: carCanvas.width / 2, width: carCanvas.width * 0.9 });
const car = new Car({
  x: road.getLaneCenter(1),
  y: 100,
  width: 30,
  height: 50,
  controlType: 'ai',
});
const traffic = [
  new Car({
    x: road.getLaneCenter(1),
    y: -100,
    width: 30,
    height: 50,
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(2),
    y: -200,
    width: 30,
    height: 50,
    maxSpeed: 2,
  }),
];

animate();

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'red');
  }
  car.draw(carCtx, 'blue');

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 150;
  Visualizer.drawNetwork(networkCtx, car.brain, ['↑', '←', '→', '↓']);

  requestAnimationFrame(animate);
}

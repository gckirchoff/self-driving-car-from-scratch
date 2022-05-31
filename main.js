const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const numAiCars = 100;

const road = new Road({ x: carCanvas.width / 2, width: carCanvas.width * 0.9 });
const cars = generateAiCars(numAiCars);
let bestCar = cars[0];
let furthestCar = cars[0];
let prevFurthestDistance = -Infinity;

if (localStorage.getItem('bestBrain')) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));

    if (i !== 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

function saveBestBrain() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discardBestBrain() {
  localStorage.removeItem('bestBrain');
}

function saveFurthestBrain() {
  localStorage.setItem('bestBrain', JSON.stringify(furthestCar.brain));
}

const traffic = [
  new Car({
    x: road.getLaneCenter(1),
    y: -100,
    width: 30,
    height: 50,
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(0),
    y: -300,
    width: 30,
    height: 50,
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(2),
    y: -300,
    width: 30,
    height: 50,
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(1),
    y: -500,
    width: 30,
    height: 50,
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(2),
    y: -500,
    width: 30,
    height: 50,
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(0),
    y: -700,
    width: 30,
    height: 50,
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(1),
    y: -700,
    width: 30,
    height: 50,
    maxSpeed: 2,
  }),
];

const npcStartingDistances = traffic.map(({ y }) => y);
const furthestNpcDistance = Math.min(...npcStartingDistances);
const furthestNpcCar = traffic.find((car) => car.y === furthestNpcDistance);

animate();

const MINUTE = 60000;

setTimeout(() => {
  saveFurthestBrain();
  document.location.reload();
}, 0.75 * MINUTE);

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  cars.forEach((car) => {
    car.update(road.borders, traffic);
  });
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  const allYValues = cars.map(({ y }) => y);
  const furthestYValue = Math.min(...allYValues);
  bestCar = cars.find((car) => car.y === furthestYValue);

  const distancesInFrontOfFurthestNpc = allYValues.map(
    (y) => furthestNpcCar.y - y
  );
  const mostSuccessfulDistance = Math.max(...distancesInFrontOfFurthestNpc);
  candidateFurthestCar = cars.find(
    (car) => furthestNpcCar.y - car.y === mostSuccessfulDistance
  );
  if (mostSuccessfulDistance > prevFurthestDistance) {
    furthestCar = candidateFurthestCar;
    prevFurthestDistance = mostSuccessfulDistance;
  }

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'red');
  }
  carCtx.globalAlpha = 0.2;
  cars.forEach((car, i) => {
    car.draw(carCtx, 'blue');
  });
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, 'blue', true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 150;
  Visualizer.drawNetwork(networkCtx, bestCar.brain, ['↑', '←', '→', '↓']);

  requestAnimationFrame(animate);
}

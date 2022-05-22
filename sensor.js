class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rayCount; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      let endOfRay = this.rays[i][1];
      if (this.readings[i]) {
        endOfRay = this.readings[i];
      }
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'yellow';
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(endOfRay.x, endOfRay.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(endOfRay.x, endOfRay.y);
      ctx.stroke();
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  #getReading(ray, roadBorders, traffic) {
    let intercepts = [];
    for (let i = 0; i < roadBorders.length; i++) {
      const intercept = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );

      if (intercept) {
        intercepts.push(intercept);
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      const trafficPoly = traffic[i].polygon;
      for (let j = 0; j < trafficPoly.length; j++) {
        const intercept = getIntersection(
          ray[0],
          ray[1],
          trafficPoly[j],
          trafficPoly[(j + 1) % trafficPoly.length]
        );
        if (intercept) {
          intercepts.push(intercept);
        }
      }
    }

    if (intercepts.length === 0) {
      return null;
    }

    const offsets = intercepts.map(({ offset }) => offset);
    const closestPoint = Math.min(...offsets);
    return intercepts.find(({ offset }) => offset === closestPoint);
  }
}

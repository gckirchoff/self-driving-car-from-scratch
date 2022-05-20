class Controls {
  constructor(playerCar) {
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.reverse = false;

    if (playerCar) {
      this.#addKeyboardListeners();
    } else {
      this.forward = true;
    }
  }

  #addKeyboardListeners() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.left = true;
          break;
        case 'ArrowRight':
          this.right = true;
          break;
        case 'ArrowUp':
          this.forward = true;
          break;
        case 'ArrowDown':
          this.reverse = true;
          break;
      }
    };
    document.onkeyup = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.left = false;
          break;
        case 'ArrowRight':
          this.right = false;
          break;
        case 'ArrowUp':
          this.forward = false;
          break;
        case 'ArrowDown':
          this.reverse = false;
          break;
      }
    };
  }
}

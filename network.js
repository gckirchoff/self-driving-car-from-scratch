class NeuralNetwork {
  constructor(neuronCountsArr) {
    this.levels = [];
    for (let i = 0; i < neuronCountsArr.length - 1; i++) {
      this.levels.push(
        new Level({
          inputCount: neuronCountsArr[i],
          outputCount: neuronCountsArr[i + 1],
        })
      );
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
  }
}

class Level {
  constructor({ inputCount, outputCount }) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  static #randomize(level) {
    level.inputs.forEach((input, inputIndex) => {
      level.outputs.forEach((output, outputIndex) => {
        level.weights[inputIndex][outputIndex] = genAbsOneVal();
      });
    });

    level.biases.forEach((bias, biasIndex) => {
      level.biases[biasIndex] = genAbsOneVal();
    });
  }

  static feedForward(givenInputs, level) {
    level.inputs.forEach((input, inputIndex) => {
      level.inputs[inputIndex] = givenInputs[inputIndex];
    });

    level.outputs.forEach((output, outputIndex) => {
      const sum = level.inputs.reduce((acc, input, inputIndex) => {
        acc +=
          level.inputs[inputIndex] * level.weights[inputIndex][outputIndex];
        return acc;
      }, 0);

      //   In the future might want if (sum+level.biases[outputIndex] > 0)
      if (sum <= level.biases[outputIndex]) {
        //   And this to be level.outputs[outputIndex] = relu(sum + level.biases[outputIndex])
        level.outputs[outputIndex] = 0;
        return;
      }
      level.outputs[outputIndex] = 1;
    });

    return level.outputs;
  }
}

function genAbsOneVal() {
  // value between -1 and 1
  return Math.random() * 2 - 1;
}

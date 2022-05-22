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
    return outputs;
  }

  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      // Randomize biases by going towards random val between -1 and 1 by amount
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], genAbsOneVal(), amount);
      }

      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            genAbsOneVal(),
            amount
          );
        }
      }
    });
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
    for (let inputIndex = 0; inputIndex < level.inputs.length; inputIndex++) {
      for (
        let outputIndex = 0;
        outputIndex < level.outputs.length;
        outputIndex++
      ) {
        level.weights[inputIndex][outputIndex] = genAbsOneVal();
      }
    }

    for (let biasIndex = 0; biasIndex < level.biases.length; biasIndex++) {
      level.biases[biasIndex] = genAbsOneVal();
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }
    for (
      let outputIndex = 0;
      outputIndex < level.outputs.length;
      outputIndex++
    ) {
      const sum = level.inputs.reduce((acc, input, inputIndex) => {
        acc +=
          level.inputs[inputIndex] * level.weights[inputIndex][outputIndex];
        return acc;
      }, 0);

      //   In the future might want if (sum+level.biases[outputIndex] > 0)
      if (sum > level.biases[outputIndex]) {
        //   And this to be level.outputs[outputIndex] = relu(sum + level.biases[outputIndex])
        level.outputs[outputIndex] = 1;
      } else {
        level.outputs[outputIndex] = 0;
      }
    }
    return level.outputs;
  }
}

function genAbsOneVal() {
  // value between -1 and 1
  return Math.random() * 2 - 1;
}

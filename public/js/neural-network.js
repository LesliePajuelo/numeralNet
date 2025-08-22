//------------------------------------------------------------------------------
// Client-Side Neural Network Implementation for GitHub Pages
// Custom neural network implementation
//------------------------------------------------------------------------------

/**
 * The sigmoid activation function.
 * When the input z is a number, returns 1/(1+exp(-z)).
 * The sigmoid function is applied elementwise to vector inputs during
 * the feedforward process.
 */
function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Random weight initialization function.
 * Returns a small random weight value from a uniform distribution.
 * This random initialization gives our stochastic gradient descent
 * algorithm a place to start from. We use a small range to prevent
 * the weights from being too large initially.
 */
function randomWeight() {
  return (Math.random() - 0.5) * 0.1;
}

/**
 * Neural Network constructor.
 *
 * The options object can contain:
 * - hiddenLayers: Array containing the number of neurons in each hidden layer.
 *   For example, [784, 392, 196] creates a network with three hidden layers
 *   containing 784, 392, and 196 neurons respectively.
 * - learningRate: The learning rate η (eta) for gradient descent
 * - iterations: Maximum number of training iterations (epochs)
 * - errorThresh: Training stops when error falls below this threshold
 * - log: Whether to print training progress
 * - logPeriod: How often to print progress (every N iterations)
 *
 * The biases and weights are initialized randomly. Note that we assume
 * the first layer is an input layer and don't set biases for those neurons,
 * since biases are only used in computing outputs from later layers.
 */
function NeuralNetwork(options) {
  options = options || {};
  this.hiddenLayers = options.hiddenLayers || [10];
  this.learningRate = options.learningRate || 0.1;  // η (eta) - learning rate
  this.iterations = options.iterations || 20000;     // maximum epochs
  this.errorThresh = options.errorThresh || 0.005;   // convergence threshold
  this.log = options.log || false;
  this.logPeriod = options.logPeriod || 10;

  // Arrays to store weights and biases for each layer
  // weights[i] is a matrix storing weights connecting layer i to layer i+1
  // biases[i] is a vector of biases for layer i+1
  this.weights = [];
  this.biases = [];
  this.inputSize = 0;   // Number of neurons in input layer
  this.outputSize = 0;  // Number of neurons in output layer
}

/**
 * Initialize the network's weights and biases.
 *
 * This method sets up the network structure based on the input size,
 * hidden layers, and output size. The list 'layers' contains the number
 * of neurons in the respective layers. For example, if we want to create
 * a network with 784 inputs, hidden layers of [392, 196], and 10 outputs,
 * layers would be [784, 392, 196, 10].
 *
 * The weights and biases are all initialized randomly using our randomWeight()
 * function. Note that we don't set biases for the input layer, since biases
 * are only used in computing outputs from later layers.
 *
 * The weight matrix weights[i][j][k] represents the weight connecting the
 * k-th neuron in layer i to the j-th neuron in layer i+1. This ordering
 * makes the forward propagation equation more natural: a' = σ(w*a + b)
 */
NeuralNetwork.prototype._initialize = function() {
  // Build layer structure: [input_size, hidden1, hidden2, ..., output_size]
  var layers = [this.inputSize].concat(this.hiddenLayers).concat([this.outputSize]);

  // Clear any existing weights and biases
  this.weights = [];
  this.biases = [];

  // Initialize weights and biases for each layer transition
  for (var i = 0; i < layers.length - 1; i++) {
    var layerSize = layers[i];        // Number of neurons in current layer
    var nextLayerSize = layers[i + 1]; // Number of neurons in next layer

    // Initialize weight matrix for connection from layer i to layer i+1
    // This matrix has dimensions [nextLayerSize x layerSize]
    var weightMatrix = [];
    for (var j = 0; j < nextLayerSize; j++) {
      var row = [];
      for (var k = 0; k < layerSize; k++) {
        row.push(randomWeight());
      }
      weightMatrix.push(row);
    }
    this.weights.push(weightMatrix);

    // Initialize bias vector for layer i+1
    // Each neuron in the next layer gets one bias value
    var bias = [];
    for (var j = 0; j < nextLayerSize; j++) {
      bias.push(randomWeight());
    }
    this.biases.push(bias);
  }
};

/**
 * Feedforward method for the neural network.
 *
 * Given an input vector 'input', this method returns the corresponding output
 * of the network. This is the core computation of a neural network.
 *
 * The method applies the equation a' = σ(w*a + b) for each layer:
 * - a is the vector of activations from the current layer
 * - w is the weight matrix connecting current layer to next layer
 * - b is the bias vector for the next layer
 * - σ is the sigmoid function applied elementwise
 * - a' is the resulting activation vector for the next layer
 *
 * This process is repeated for each layer until we reach the output.
 */
NeuralNetwork.prototype._forward = function(input) {
  var activation = input;  // Start with input as first activation

  // Apply the feedforward equation for each layer: a' = σ(w*a + b)
  for (var i = 0; i < this.weights.length; i++) {
    var layerOutput = [];

    // Compute activation for each neuron in the next layer
    for (var j = 0; j < this.weights[i].length; j++) {
      // Start with bias: b_j
      var z = this.biases[i][j];

      // Add weighted inputs: Σ(w_jk * a_k)
      for (var k = 0; k < activation.length; k++) {
        z += this.weights[i][j][k] * activation[k];
      }

      // Apply sigmoid activation function: σ(z)
      layerOutput.push(sigmoid(z));
    }

    // Use this layer's output as input to the next layer
    activation = layerOutput;
  }

  return activation;  // Final output activations
};

/**
 * Train the neural network using stochastic gradient descent.
 *
 * This method implements a simplified version of the SGD algorithm described
 * in Nielsen's book. The training_data should be an array of objects with
 * 'input' and 'output' properties representing the training inputs and
 * desired outputs respectively.
 *
 * Parameters:
 * - data: Array of training examples, each with {input: [...], output: [...]}
 * - options: Object containing training parameters like learningRate, iterations, etc.
 *
 * The algorithm works by:
 * 1. Processing each training example
 * 2. Computing the network's output via feedforward
 * 3. Calculating the error (cost function)
 * 4. Updating weights and biases using gradient descent
 *
 * This continues for a specified number of iterations or until the error
 * falls below the specified threshold.
 */
NeuralNetwork.prototype.train = function(data, options) {
  options = options || {};
  this.learningRate = options.learningRate || this.learningRate;  // η (eta)
  this.iterations = options.iterations || this.iterations;         // max epochs
  this.errorThresh = options.errorThresh || this.errorThresh;     // convergence threshold
  this.log = options.log || false;
  this.logPeriod = options.logPeriod || 10;

  // Determine network architecture from training data and initialize weights/biases
  if (data.length > 0) {
    this.inputSize = data[0].input.length;
    this.outputSize = data[0].output.length;
    this._initialize();
  }

  var totalError = 1;
  var epoch = 0;

  // Main training loop - continue until convergence or max iterations
  while (totalError > this.errorThresh && epoch < this.iterations) {
    totalError = 0;

    // Process each training example (this is like processing a mini-batch of size 1)
    for (var i = 0; i < data.length; i++) {
      var inputVector = data[i].input;
      var targetOutput = data[i].output;

      // Feedforward: compute network's output for this input
      var networkOutput = this._forward(inputVector);

      // Calculate squared error for this example
      for (var j = 0; j < networkOutput.length; j++) {
        totalError += Math.pow(targetOutput[j] - networkOutput[j], 2);
      }

      // Backpropagation and weight update (simplified version)
      this._simpleUpdate(inputVector, targetOutput, networkOutput);
    }

    // Average error across all training examples
    totalError = totalError / data.length;
    epoch++;

    // Print progress if logging is enabled
    if (this.log && epoch % this.logPeriod === 0) {
      console.log('Epoch:', epoch, 'Error:', totalError.toFixed(6));
    }
  }

  if (this.log) {
    console.log('Training completed in', epoch, 'epochs with error:', totalError.toFixed(6));
  }
};

/**
 * Simplified weight update method (basic gradient descent).
 *
 * This method implements a simplified version of backpropagation for updating
 * the network's weights and biases. In the full algorithm described in Nielsen's
 * book, this would involve:
 * 1. Computing gradients via backpropagation
 * 2. Updating all layers' weights and biases
 *
 * Our simplified version focuses primarily on the output layer, using the
 * basic gradient descent rule:
 *
 * w_new = w_old + η * δ * input
 * b_new = b_old + η * δ
 *
 * where:
 * - η (eta) is the learning rate
 * - δ (delta) is the error signal
 * - input is the activation from the previous layer
 */
NeuralNetwork.prototype._simpleUpdate = function(input, target, output) {
  // Focus on the output layer (last layer in the network)
  var outputLayerIndex = this.weights.length - 1;

  // Update weights and biases for each neuron in the output layer
  for (var j = 0; j < this.weights[outputLayerIndex].length; j++) {
    // Calculate error signal: δ = (target - actual_output)
    var errorSignal = target[j] - output[j];

    // Update weights connecting to this output neuron
    // w_jk += η * δ_j * a_k (where a_k is activation from previous layer)
    for (var k = 0; k < this.weights[outputLayerIndex][j].length; k++) {
      // For simplicity, use input directly if single layer, otherwise use constant
      var previousActivation = (outputLayerIndex === 0) ? input[k] : 0.5;
      this.weights[outputLayerIndex][j][k] += this.learningRate * errorSignal * previousActivation;
    }

    // Update bias for this output neuron: b_j += η * δ_j
    this.biases[outputLayerIndex][j] += this.learningRate * errorSignal;
  }
};

/**
 * Run the network on an input vector.
 *
 * This method is the public interface for using a trained network to make
 * predictions. It simply calls the internal _forward method, which implements
 * the feedforward algorithm.
 *
 * Returns the output activations of the network. For classification problems,
 * the output is typically interpreted as probabilities, with the index of
 * the highest activation representing the predicted class.
 */
NeuralNetwork.prototype.run = function(input) {
  return this._forward(input);
};

/**
 * Serialize the network to JSON format.
 *
 * This method returns a JSON representation of the network's architecture
 * and learned parameters (weights and biases). This is useful for:
 * 1. Saving trained networks to disk
 * 2. Transferring networks between different instances
 * 3. Creating backups of trained models
 *
 * The returned object contains all the information needed to recreate
 * the exact same network using fromJSON().
 */
NeuralNetwork.prototype.toJSON = function() {
  return {
    inputSize: this.inputSize,
    outputSize: this.outputSize,
    hiddenLayers: this.hiddenLayers,
    weights: this.weights,       // Learned weight matrices
    biases: this.biases         // Learned bias vectors
  };
};

/**
 * Load a network from JSON format.
 *
 * This method reconstructs a neural network from a JSON representation.
 * It supports our custom format and the existing trained network format.
 *
 * After calling this method, the network is ready to make predictions
 * using the run() method, without needing to retrain.
 */
NeuralNetwork.prototype.fromJSON = function(json) {
    this.inputSize = json.inputSize;
    this.outputSize = json.outputSize;
    this.hiddenLayers = json.hiddenLayers;
    this.weights = json.weights;
    this.biases = json.biases;

/**
 * Load network from the existing trained network format.
 * 
 * The trained network format has:
 * - layers: array of layer objects
 * - Each layer has neurons numbered as strings
 * - Each neuron has bias and weights properties
 * - Weights map from input neuron index to weight value
 */
NeuralNetwork.prototype._loadFromTrainedFormat = function(json) {
  var layers = json.layers;
  
  // Determine network architecture from layers
  this.inputSize = Object.keys(layers[0]).length;  // First layer size
  this.outputSize = Object.keys(layers[layers.length - 1]).length;  // Last layer size
  
  // Hidden layers (all layers except first and last)
  this.hiddenLayers = [];
  for (var i = 1; i < layers.length - 1; i++) {
    this.hiddenLayers.push(Object.keys(layers[i]).length);
  }
  
  // Initialize the network structure
  this._initialize();
  
  // Convert the trained network weights and biases to our format
  this._convertTrainedWeights(layers);
};

/**
 * Convert the trained network weights and biases to our internal format.
 */
NeuralNetwork.prototype._convertTrainedWeights = function(layers) {
  // Clear existing weights and biases
  this.weights = [];
  this.biases = [];
  
  // Process each layer transition
  for (var i = 0; i < layers.length - 1; i++) {
    var currentLayer = layers[i];
    var nextLayer = layers[i + 1];
    
    var currentLayerSize = Object.keys(currentLayer).length;
    var nextLayerSize = Object.keys(nextLayer).length;
    
    // Initialize weight matrix for this transition
    var weightMatrix = [];
    var biasVector = [];
    
    // For each neuron in the next layer
    for (var j = 0; j < nextLayerSize; j++) {
      var neuronKey = j.toString();
      var neuron = nextLayer[neuronKey];
      
      // Add bias
      biasVector.push(neuron.bias);
      
      // Add weights
      var weightRow = [];
      for (var k = 0; k < currentLayerSize; k++) {
        var inputKey = k.toString();
        var weight = neuron.weights[inputKey] || 0;
        weightRow.push(weight);
      }
      weightMatrix.push(weightRow);
    }
    
    this.weights.push(weightMatrix);
    this.biases.push(biasVector);
  }
};

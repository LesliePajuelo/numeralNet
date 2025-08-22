# NumeralNet - GitHub Pages Version

This is the static version of NumeralNet designed to run on GitHub Pages. The neural network now runs entirely in your browser using JavaScript!

## What Changed

- **No Server Required**: The neural network runs client-side using JavaScript
- **Static Files**: All functionality is contained in HTML, CSS, and JavaScript files
- **Pre-trained Model**: Uses the existing trained neural network data from `assets/fourthBrainData.json`

## How It Works

1. **Neural Network**: The `public/js/neural-network.js` file contains a complete implementation of the neural network that can run in browsers
2. **Digit Recognition**: The `public/js/digit-recognition.js` file handles canvas drawing and processes images through the neural network
3. **Pre-trained Data**: The neural network loads the existing trained weights and biases from the assets folder

## Files Structure

```
/
├── index.html                 # Main page (GitHub Pages entry point)
├── public/
│   ├── css/                  # Bootstrap and custom styles
│   ├── js/
│   │   ├── neural-network.js # Neural network implementation
│   │   └── digit-recognition.js # Canvas and recognition logic
│   ├── lib/                  # jQuery library
│   ├── img/                  # Training results and MNIST samples
│   └── assets/               # Pre-trained neural network data
└── README-gh-pages.md        # This file
```

## Usage

1. Draw a digit (0-9) on the canvas
2. Click "recognize" to process it through the neural network
3. View the confidence scores for each possible digit

## Technical Notes

- Uses ES5 JavaScript for maximum browser compatibility
- Neural network processes 28x28 pixel images (784 inputs)
- Output is 10 neurons representing digits 0-9
- All processing happens locally in the browser

## Original Project

This is based on the original NumeralNet project that used Node.js and BrainJS. The neural network functionality has been completely reimplemented in vanilla JavaScript for browser compatibility.

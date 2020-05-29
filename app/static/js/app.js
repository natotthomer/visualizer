window.onload = function() {

  const canvas = document.getElementById("canvas");
  const audio = document.getElementById("audio");
  const context = new AudioContext(); // (Interface) Audio-processing graph

  audio.playing = function() {

    ///////// <CANVAS> INITIALIZATION //////////
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    ///////////////////////////////////////////

    let src = context.createMediaElementSource(audio); // Give the audio context an audio source,
    // to which can then be played and manipulated
    const analyser = context.createAnalyser(); // Create an analyser for the audio context
    const gainNodeToAnalyze = context.createGain();
    // volumeNode.gain.setValueAtTime(0, context.currentTime);
    src.connect(gainNodeToAnalyze); // Connects the audio context source to the analyser
    gainNodeToAnalyze.connect(analyser);
    // volumeNode.connect(context.destination); // End destination of an audio graph in a given context
    // Sends sound to the speakers or headphones

    /////////////// ANALYSER FFTSIZE ////////////////////////
    analyser.fftSize = 32768;

    // (FFT) is an algorithm that samples a signal over a period of time
    // and divides it into its frequency components (single sinusoidal oscillations).
    // It separates the mixed signals and shows what frequency is a violent vibration.

    // (FFTSize) represents the window size in samples that is used when performing a FFT

    const bufferLength = analyser.frequencyBinCount; // (read-only property)
    // Unsigned integer, half of fftSize (so in this case, bufferLength = 16384)
    // Equates to number of data values you have to play with for the visualization

    // The FFT size defines the number of bins used for dividing the window into equal strips, or bins.
    // Hence, a bin is a spectrum sample, and defines the frequency resolution of the window.

    const dataArray = new Uint8Array(bufferLength); // Converts to 8-bit unsigned integer array
    // At this point dataArray is an array with length of bufferLength but no values
    console.log('DATA-ARRAY: ', dataArray) // Check out this array of frequency values!

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    console.log('WIDTH: ', WIDTH, 'HEIGHT: ', HEIGHT)
    console.log('bufferLength', bufferLength)

    const BAR_WIDTH = 2;
    console.log('BAR_WIDTH: ', BAR_WIDTH)

    const NUM_OF_BARS = WIDTH / BAR_WIDTH;
    const SPACE_BETWEEN_BARS = (WIDTH / NUM_OF_BARS) - BAR_WIDTH;
    console.log("SPACE_BETWEEN_BARS", SPACE_BETWEEN_BARS)

    let x = 0;

    let previousCoords = [0,0];
    function renderFrame() {
      requestAnimationFrame(renderFrame); // Takes callback function to invoke before rendering

      x = 0; // reset x

      analyser.getByteFrequencyData(dataArray); // Copies the frequency data into dataArray
      // Results in a normalized array of values between 0 and 255
      // Before this step, dataArray's values are all zeros (but with length of 8192)

      ctx.fillStyle = "rgba(0,0,0,0.2)"; // Clears canvas before rendering bars (black with opacity 0.2)
      ctx.fillRect(0, 0, WIDTH, HEIGHT); // Fade effect, set opacity to 1 for sharper rendering of bars
      ctx.lineWidth = 6;
      // ctx.strokeStyle = "#333";

      let r, g, b;

      // const values = [];
      for (let i = 0; i < dataArray.length; i++) {
        const percentageOfHeight = dataArray[i] / 255;
        const BAR_HEIGHT = percentageOfHeight * HEIGHT;

        if (dataArray[i] > 210) { // pink
          r = 250
          g = 0
          b = 255
        } else if (dataArray[i] > 200) { // yellow
          r = 250
          g = 255
          b = 0
        } else if (dataArray[i] > 190) { // yellow/green
          r = 204
          g = 255
          b = 0
        } else if (dataArray[i] > 180) { // blue/green
          r = 0
          g = 219
          b = 131
        } else { // light blue
          r = 0
          g = 199
          b = 255
        }

        ctx.beginPath();
        ctx.strokeStyle = `rgb(${r},${g},${b})`;
        const y = HEIGHT - BAR_HEIGHT;
        ctx.moveTo(x, y);
        if (i !== 0) {
          ctx.quadraticCurveTo(previousCoords[0], previousCoords[1], x, y)
        }
        ctx.stroke()
        previousCoords = [x, y]
        // ctx.fillRect(x, (HEIGHT - BAR_HEIGHT), BAR_WIDTH, BAR_HEIGHT);
        
        x += BAR_WIDTH + SPACE_BETWEEN_BARS;
      }
    }

    audio.play();
    renderFrame();
  };
};
// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const file = document.getElementById('image-input') // file select
const canvas = document.getElementById('user-image'); // canvas
const ctx = canvas.getContext('2d'); // for drawing
const generate = document.querySelector("[type='submit']") // generate button
const clear = document.querySelector("[type='reset']") // generate button
const read = document.querySelector("[type='button']") // generate button
const top = document.getElementById('text-top'); // top text input
const bottom = document.getElementById('text-bottom'); // bottom text input
const synth = window.speechSynthesis; // for speaking
const voice = document.getElementById('voice-selection'); // voice selection
const volume = document.getElementById('volume-group'); // volume group
const slider = document.querySelector("[type='range']"); // actual slider
const icon = document.getElementsByTagName('img')[0];
var voices = [];

// from Mozilla (https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voice.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}
voice.remove(0);
voice.disabled = false;
// end from Mozilla


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  generate.disabled = false;
  clear.disabled = true;
  read.disabled = true;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const dim = getDimensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dim.startX, dim.startY, dim.width, dim.height);



  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

// loading image input
file.addEventListener('change', () => {
  //event.preventDefault();
  img.src = URL.createObjectURL(file.files[0]);
  img.alt = file.files[0].name;
});

// submitting text
const form = document.getElementById('generate-meme')
form.addEventListener('submit', (event) => {
  ctx.fillStyle = 'white';
  ctx.font = '75px Impact'
  ctx.textAlign = 'center'
  ctx.fillText(top.value, canvas.width/2, 75);
  ctx.fillText(bottom.value, canvas.width/2, 375);
  event.preventDefault();

  generate.disabled = true;
  clear.disabled = false;
  read.disabled = false;
});

// clear canvas and form
clear.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  generate.disabled = false;
  clear.disabled = true;
  read.disabled = true;
});

// read text
read.addEventListener('click', () => {
  let speech = new SpeechSynthesisUtterance(top.value + ' ' + bottom.value);
  
  // from Mozilla (https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
  let sound = voice.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === sound) {
      speech.voice = voices[i];
    }
  }
  speech.volume = slider.value/100;
  speechSynthesis.speak(speech);
  //end from Mozilla

});

// adjust volume
volume.addEventListener('input', () => {
  if (slider.value >= 67) {
    icon.src = 'icons/volume-level-3.svg';
  } else if (slider.value >= 34) {
    icon.src = 'icons/volume-level-2.svg';
  } else if (slider.value >= 1) {
    icon.src = 'icons/volume-level-1.svg';
  } else {
    icon.src = 'icons/volume-level-0.svg';
  }
});
"use strict";

const canvas = document.getElementById('visualizationCanvas');
const ctx = canvas.getContext('2d');
const barWidth = 20;
const barMargin = 5;
//const delay = 250;
const offset = 20;
let inProgress = false;

// Get the delay range input and delay value span
const delayRange = document.getElementById('delayRange');
const delayValue = document.getElementById('delayValue');

// Add event listener to update delay value span when input changes
delayRange.addEventListener('input', function () {
    delayValue.textContent = delayRange.value;
});

let array = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
visualize(array);

const sortButton = document.getElementById('sort');
sortButton.onclick = function () { if (!inProgress) bubbleSort(array); };

const shuffleButton = document.getElementById('shuffle');
shuffleButton.onclick = function () { if (!inProgress) shuffle(array); };

// Sort array
async function bubbleSort(arr) {
    inProgress = true;
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap the elements
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                visualize(arr, j, j + 1); // Pass the indices of swapped elements
                await sleep(delayRange.value);
            }
        }
    }
    inProgress = false;
}

// Shuffle array
async function shuffle(arr) {
    inProgress = true;
    let currentIndex = arr.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
        visualize(arr);
    }
    inProgress = false;
}

// Draw bars for each element in the array with color gradient
function visualize(arr, index1 = null, index2 = null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Define the start and end colors for the gradient
    const startColor = [202, 137, 255]; // purple-like
    const endColor = [255, 196, 121]; // orange-like

    // Iterate through each element in the array
    for (let i = 0; i < arr.length; i++) {
        // Calculate the normalized value between 0 and 1 for the current element
        const normalizedValue = (arr[i] - Math.min(...arr)) / (Math.max(...arr) - Math.min(...arr));

        // Interpolate the color based on the normalized value
        const color = getColor(startColor, endColor, normalizedValue);

        // Set the fill style to the interpolated color
        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

        // Draw the bar
        const barHeight = arr[i] * 5; // Scale the height for better visualization
        const x = (barWidth + barMargin) * i;
        const y = canvas.height - barHeight - offset;
        ctx.fillRect(x, y, barWidth, barHeight);
    }

    // Draw arrow if indices are provided
    if (index1 !== null && index2 !== null) {
        drawArrow(index1, index2);
    }
    //drawArrow(0, 18);
}

// Function to draw arrow between two bars
function drawArrow(index1, index2) {
    const x1 = (barWidth + barMargin) * index1 + barWidth / 2;
    const x2 = (barWidth + barMargin) * index2 + barWidth / 2;
    const y = canvas.height - offset;

    /*ctx.beginPath();
    ctx.moveTo(x1, y);
    //ctx.quadraticCurveTo((x1 + x2) / 2, y - 50, x2, y);
    ctx.bezierCurveTo(x1, y - 25, x2, y - 25, x2, y);
    ctx.moveTo(x1, y);
    ctx.lineTo(x1 - 7, y - 5);
    ctx.moveTo(x1, y);
    ctx.lineTo(x1 + 7, y - 5);

    ctx.moveTo(x2, y);
    ctx.lineTo(x2 - 7, y - 5);
    ctx.moveTo(x2, y);
    ctx.lineTo(x2 + 7, y - 5);

    ctx.stroke();*/

    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x1 - 5, y + 5);
    ctx.moveTo(x1, y);
    ctx.lineTo(x1 + 5, y + 5);

    ctx.moveTo(x1, y);
    ctx.lineTo(x1, y + 15);

    ctx.lineTo(x2, y + 15);

    ctx.lineTo(x2, y);

    ctx.moveTo(x2, y);
    ctx.lineTo(x2 - 5, y + 5);
    ctx.moveTo(x2, y);
    ctx.lineTo(x2 + 5, y + 5);

    ctx.stroke();
}

// Function to get color between two colors
function getColor(startColor, endColor, step) {
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * step);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * step);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * step);
    return [r, g, b];
}

// Delay function (in milliseconds)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

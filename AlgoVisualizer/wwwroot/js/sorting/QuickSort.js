"use strict";

const canvas = document.getElementById('visualizationCanvas');
const ctx = canvas.getContext('2d');
const barWidth = 20;
const barMargin = 5;
const offset = 20;

let inProgress = false;
let stopRequested = false;
let history = [];
let currentStep = -1;
let isSorted = false;

// Get the delay range input and delay value span
const delayRange = document.getElementById('delayRange');
const delayValue = document.getElementById('delayValue');

// Add event listener to update delay value span when input changes
delayRange.addEventListener('input', function () {
    delayValue.textContent = delayRange.value;
});

let array = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

const sortButton = document.getElementById('sort');
sortButton.onclick = function () { if (!inProgress) sort(); };

const shuffleButton = document.getElementById('shuffle');
shuffleButton.onclick = function () { if (!inProgress) shuffle(array); };

const stopButton = document.getElementById('stop');
stopButton.onclick = function () { stopRequested = true; };

const backButton = document.getElementById('back');
backButton.onclick = function () { if (!inProgress) stepBack(); }

const forwardButton = document.getElementById('forward');
forwardButton.onclick = function () { if (!inProgress) stepForward(); }

const codeBox = document.getElementById('codeBox');

const showCSharpButton = document.getElementById('showCSharp');
showCSharpButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-csharp">public void QuickSort(int[] arr, int low, int high)
{
    if (low < high)
    {
        int pivotIndex = Partition(arr, low, high);

        QuickSort(arr, low, pivotIndex - 1);
        QuickSort(arr, pivotIndex + 1, high);
    }
}
public int Partition(int[] arr, int low, int high)
{
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++)
    {
        if (arr[j] < pivot)
        {
            i++;
            (arr[i], arr[j]) = (arr[j], arr[i]);
        }
    }
    (arr[i + 1], arr[high]) = (arr[high], arr[i + 1]);
    return i + 1;
}</code>`;
    Prism.highlightAll();
}

const showJSButton = document.getElementById('showJS');
showJSButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-javascript">function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    let pivot = arr[arr.length - 1];
    let left = [];
    let right = [];
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
}</code>`;
    Prism.highlightAll();
}

const showPythonButton = document.getElementById('showPython');
showPythonButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-python">def quicksort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) - 1]
    left = [x for x in arr[:-1] if x < pivot]
    right = [x for x in arr[:-1] if x >= pivot]

    return quicksort(left) + [pivot] + quicksort(right)</code>`;
    Prism.highlightAll();
}

setup();

function setup() {
    visualize(array);
    showCSharpButton.click();
}

// The function being called on "start" button click 
async function sort() {
    inProgress = true;
    stopRequested = false;

    if (!isSorted){
        let arrayCopy = [...array];
        quickSort(arrayCopy);
        isSorted = true;
    }

    while (currentStep >= -1 && currentStep < history.length - 1) {
        if (stopRequested) {
            inProgress = false;
            return;
        }
        else {
            currentStep++;
            let hs = history[currentStep];
            [array[hs[0]], array[hs[1]]] = [array[hs[1]], array[hs[0]]];
            visualize(array, hs[0], hs[1]);
            await sleep(delayRange.value);
        }
    }

    inProgress = false;
}
// Function to provide history of state change
function quickSort(arr) {
    function partition(arr, low, high) {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
                if (i != j) history.push([i, j]);
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        if (i + 1 != high) history.push([i + 1, high]);

        return i + 1;
    }

    function quickSortRecursive(arr, low, high) {
        if (low < high) {
            let pi = partition(arr, low, high);

            quickSortRecursive(arr, low, pi - 1);
            quickSortRecursive(arr, pi + 1, high);
        }
    }

    quickSortRecursive(arr, 0, arr.length - 1);
}
// Make one step forward
function stepForward() {
    if (currentStep < history.length - 1) {
        currentStep++;
        let hs = history[currentStep];
        [array[hs[0]], array[hs[1]]] = [array[hs[1]], array[hs[0]]];
        visualize(array, hs[0], hs[1]); // Pass the indices of swapped elements
    }
}
// Make one step back
function stepBack() {
    if (currentStep >= 0) {
        let hs = history[currentStep];
        [array[hs[0]], array[hs[1]]] = [array[hs[1]], array[hs[0]]];
        currentStep--;
        visualize(array, hs[0], hs[1]); // Pass the indices of swapped elements
    }
}
// Shuffle array
function shuffle(arr) {
    currentStep = -1;
    inProgress = true;
    isSorted = false;
    history = [];
    let currentIndex = arr.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    visualize(arr);
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
        // Get the color based on the normalized value
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
}
// Draw arrow between two bars
function drawArrow(index1, index2) {
    const x1 = (barWidth + barMargin) * index1 + barWidth / 2;
    const x2 = (barWidth + barMargin) * index2 + barWidth / 2;
    const y = canvas.height - offset;
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

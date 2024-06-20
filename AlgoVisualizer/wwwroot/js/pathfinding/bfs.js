const gridElement = document.getElementById('grid');
const grid = [];
const rows = 20;
const cols = 20;
let start = { row: 0, col: 0 };
let end = { row: 19, col: 19 };
let isSettingStart = true;

const startButton = document.getElementById('start');
startButton.onclick = () => {
    clearGrid();
    bfs(start, end);
};

const clearButton = document.getElementById('clear');
clearButton.onclick = () => clearGrid();

const codeBox = document.getElementById('codeBox');

const showCSharpButton = document.getElementById('showCSharp');
showCSharpButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-csharp">public void BFS(int s)
{
    bool[] visited = new bool[V];
    Queue<int> queue = new Queue<int>();

    visited[s] = true;
    queue.Enqueue(s);

    while (queue.Count != 0)
    {
        s = queue.Dequeue();
        Console.Write(s + " ");

        foreach (var n in adj[s])
        {
            if (!visited[n])
            {
                visited[n] = true;
                queue.Enqueue(n);
            }
        }
    }
}</code>`;
    Prism.highlightAll();
}

const showJSButton = document.getElementById('showJS');
showJSButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-javascript">function BFS(s) {
    let visited = new Array(this.V).fill(false);
    let queue = [];

    visited[s] = true;
    queue.push(s);

    while (queue.length !== 0) {
        s = queue.shift();
        console.log(s);

        this.adj[s].forEach(n => {
            if (!visited[n]) {
                visited[n] = true;
                queue.push(n);
            }
        });
    }
}</code>`;
    Prism.highlightAll();
}

const showPythonButton = document.getElementById('showPython');
showPythonButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-python">def BFS(self, s):
    visited = [False] * self.V
    queue = deque()
    
    visited[s] = True
    queue.append(s)
    
    while queue:
        s = queue.popleft()
        print(s, end=" ")
    
        for n in self.adj[s]:
            if not visited[n]:
                visited[n] = True
                queue.append(n)</code>`;
    Prism.highlightAll();
}

setup();

function setup() {
    createGrid();
    showCSharpButton.click();
}

function createGrid() {
    gridElement.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        const rowArray = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = () => setStartOrEnd(cell, row, col);
            if (row === start.row && col === start.col) {
                cell.classList.add('start');
            } else if (row === end.row && col === end.col) {
                cell.classList.add('end');
            }
            gridElement.appendChild(cell);
            rowArray.push(cell);
        }
        grid.push(rowArray);
    }
}

function setStartOrEnd(cell, row, col) {
    if (isSettingStart) {
        grid[start.row][start.col].classList.remove('start');
        start = { row, col };
        cell.classList.add('start');
    } else {
        grid[end.row][end.col].classList.remove('end');
        end = { row, col };
        cell.classList.add('end');
    }
    isSettingStart = !isSettingStart;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bfs(start, end) {
    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 }
    ];
    const queue = [start];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const previous = Array.from({ length: rows }, () => Array(cols).fill(null));

    visited[start.row][start.col] = true;

    while (queue.length > 0) {
        const current = queue.shift();
        const { row, col } = current;
        
        for (const direction of directions) {
            const newRow = row + direction.row;
            const newCol = col + direction.col;
            
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !visited[newRow][newCol]) {
                queue.push({ row: newRow, col: newCol });
                visited[newRow][newCol] = true;
                previous[newRow][newCol] = current;
                grid[newRow][newCol].classList.add('visited');
                await sleep(50);
                if (newRow === end.row && newCol === end.col) {
                    recreatePath(previous, end);
                    return;
                }
            }
        }
    }
}

function recreatePath(previous, end) {
    let current = end;
    while (current) {
        const { row, col } = current;
        grid[row][col].classList.add('path');
        current = previous[row][col];
    }
}

function clearGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            grid[row][col].classList.remove('visited', 'path', 'start', 'end');
            if (row === start.row && col === start.col) {
                grid[row][col].classList.add('start');
            } else if (row === end.row && col === end.col) {
                grid[row][col].classList.add('end');
            }
        }
    }
}

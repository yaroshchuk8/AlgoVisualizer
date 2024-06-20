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
    dfs(start, end);
};

const clearButton = document.getElementById('clear');
clearButton.onclick = () => clearGrid();

const codeBox = document.getElementById('codeBox');

const showCSharpButton = document.getElementById('showCSharp');
showCSharpButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-csharp">class Graph
{
    private int V;
    private List<int>[] adj;
    public Graph(int v)
    {
        V = v;
        adj = new List<int>[v];
        for (int i = 0; i < v; ++i)
            adj[i] = new List<int>();
    }
    public void AddEdge(int v, int w)
    {
        adj[v].Add(w);
    }
    public void DFS(int v)
    {
        bool[] visited = new bool[V];
        DFSUtil(v, visited);
    }
    private void DFSUtil(int v, bool[] visited)
    {
        visited[v] = true;
        Console.Write(v + " ");

        foreach (int i in adj[v])
            if (!visited[i])
                DFSUtil(i, visited);
    }
}</code>`;
    Prism.highlightAll();
}

const showJSButton = document.getElementById('showJS');
showJSButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-javascript">class Graph {
    constructor(v) {
        this.V = v;
        this.adj = Array.from({ length: v }, () => []);
    }
    addEdge(v, w) {
        this.adj[v].push(w);
    }
    DFS(v) {
        let visited = new Array(this.V).fill(false);
        this.DFSUtil(v, visited);
    }
    DFSUtil(v, visited) {
        visited[v] = true;
        console.log(v);
        for (let i of this.adj[v]) {
            if (!visited[i]) {
                this.DFSUtil(i, visited);
            }
        }
    }
}</code>`;
    Prism.highlightAll();
}

const showPythonButton = document.getElementById('showPython');
showPythonButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-python">from collections import defaultdict
class Graph:
    def __init__(self):
        self.graph = defaultdict(list)
    def addEdge(self, u, v):
        self.graph[u].append(v)
    def DFS(self, v):
        visited = [False] * len(self.graph)
        self.DFSUtil(v, visited)
    def DFSUtil(self, v, visited):
        visited[v] = True
        print(v, end=' ')
        for i in self.graph[v]:
            if not visited[i]:
                self.DFSUtil(i, visited)</code>`;
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

async function dfs(start, end) {
    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 }
    ];
    const stack = [start];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const previous = Array.from({ length: rows }, () => Array(cols).fill(null));

    visited[start.row][start.col] = true;

    while (stack.length > 0) {
        const current = stack.pop();
        const { row, col } = current;

        for (const direction of directions) {
            const newRow = row + direction.row;
            const newCol = col + direction.col;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !visited[newRow][newCol]) {
                stack.push({ row: newRow, col: newCol });
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

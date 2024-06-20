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
    dijkstra(start, end);
};

const clearButton = document.getElementById('clear');
clearButton.onclick = () => clearGrid();

const codeBox = document.getElementById('codeBox');

const showCSharpButton = document.getElementById('showCSharp');
showCSharpButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-csharp">public class DijkstraAlgorithm
{
    private int V; // Number of vertices
    private List<(int, int)>[] adj; // Adjacency list of tuples (neighbor, weight)
    public DijkstraAlgorithm(int v)
    {
        V = v;
        adj = new List<(int, int)>[V];
        for (int i = 0; i < V; i++)
        {
            adj[i] = new List<(int, int)>();
        }
    }
    public void AddEdge(int u, int v, int weight)
    {
        adj[u].Add((v, weight));
        adj[v].Add((u, weight)); // If undirected graph
    }
    public int[] Dijkstra(int src)
    {
        int[] dist = new int[V];
        bool[] visited = new bool[V];
        for (int i = 0; i < V; i++)
        {
            dist[i] = int.MaxValue;
            visited[i] = false;
        }
        dist[src] = 0;
        for (int count = 0; count < V - 1; count++)
        {
            int u = MinDistance(dist, visited);
            visited[u] = true;
            foreach (var neighbor in adj[u])
            {
                int v = neighbor.Item1;
                int weight = neighbor.Item2;

                if (!visited[v] && dist[u] != int.MaxValue && dist[u] + weight < dist[v])
                {
                    dist[v] = dist[u] + weight;
                }
            }
        }
        return dist;
    }
    private int MinDistance(int[] dist, bool[] visited)
    {
        int min = int.MaxValue;
        int minIndex = -1;
        for (int v = 0; v < V; v++)
        {
            if (visited[v] == false && dist[v] <= min)
            {
                min = dist[v];
                minIndex = v;
            }
        }
        return minIndex;
    }
}</code>`;
    Prism.highlightAll();
}

const showJSButton = document.getElementById('showJS');
showJSButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-javascript">class DijkstraAlgorithm {
    constructor(vertices) {
        this.V = vertices;
        this.adj = new Array(vertices).fill(null).map(() => []);
    }
    addEdge(u, v, weight) {
        this.adj[u].push({ v, weight });
        this.adj[v].push({ v: u, weight }); // If undirected graph
    }
    dijkstra(src) {
        let dist = new Array(this.V).fill(Number.MAX_VALUE);
        let visited = new Array(this.V).fill(false);
        dist[src] = 0;
        for (let count = 0; count < this.V - 1; count++) {
            let u = this.minDistance(dist, visited);
            visited[u] = true;
            for (let neighbor of this.adj[u]) {
                let v = neighbor.v;
                let weight = neighbor.weight;
                if (!visited[v] && dist[u] !== Number.MAX_VALUE && dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                }
            }
        }
        return dist;
    }
    minDistance(dist, visited) {
        let min = Number.MAX_VALUE;
        let minIndex = -1;
        for (let v = 0; v < this.V; v++) {
            if (!visited[v] && dist[v] <= min) {
                min = dist[v];
                minIndex = v;
            }
        }
        return minIndex;
    }
}</code>`;
    Prism.highlightAll();
}

const showPythonButton = document.getElementById('showPython');
showPythonButton.onclick = function() {
    codeBox.innerHTML =
        `<code class="language-python">import heapq
class DijkstraAlgorithm:
    def __init__(self, vertices):
        self.V = vertices
        self.adj = [[] for _ in range(vertices)]
    def add_edge(self, u, v, weight):
        self.adj[u].append((v, weight))
        self.adj[v].append((u, weight))  # If undirected graph
    def dijkstra(self, src):
        dist = [float('inf')] * self.V
        visited = [False] * self.V
        dist[src] = 0
        priority_queue = [(0, src)]
        while priority_queue:
            (d, u) = heapq.heappop(priority_queue)
            if visited[u]:
                continue
            visited[u] = True
            for neighbor, weight in self.adj[u]:
                if not visited[neighbor] and dist[u] != float('inf') and dist[u] + weight < dist[neighbor]:
                    dist[neighbor] = dist[u] + weight
                    heapq.heappush(priority_queue, (dist[neighbor], neighbor))
        return dist</code>`;
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

class MinPriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
        this.items.sort((a, b) => a.distance - b.distance);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

async function dijkstra(start, end) {
    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 }
    ];
    const distances = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const previous = Array.from({ length: rows }, () => Array(cols).fill(null));
    const pq = new MinPriorityQueue();

    distances[start.row][start.col] = 0;
    pq.enqueue({ ...start, distance: 0 });

    while (!pq.isEmpty()) {
        const current = pq.dequeue();
        const { row, col } = current;

        for (const direction of directions) {
            const newRow = row + direction.row;
            const newCol = col + direction.col;
            const newDistance = distances[row][col] + 1; // Assuming uniform cost

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && newDistance < distances[newRow][newCol]) {
                distances[newRow][newCol] = newDistance;
                previous[newRow][newCol] = current;
                pq.enqueue({ row: newRow, col: newCol, distance: newDistance });
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

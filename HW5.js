/*
In this programming problem you'll code up Dijkstra's shortest-path algorithm.
Download the text file here. (Right click and save link as).
The file contains an adjacency list representation of an undirected weighted graph with 200 vertices labeled 1 to 200. Each row consists of the node tuples that are adjacent to that particular vertex along with the length of that edge. For example, the 6th row has 6 as the first entry indicating that this row corresponds to the vertex labeled 6. The next entry of this row "141,8200" indicates that there is an edge between vertex 6 and vertex 141 that has length 8200. The rest of the pairs of this row indicate the other vertices adjacent to vertex 6 and the lengths of the corresponding edges.

Your task is to run Dijkstra's shortest-path algorithm on this graph, using 1 (the first vertex) as the source vertex, and to compute the shortest-path distances between 1 and every other vertex of the graph. If there is no path between a vertex v and vertex 1, we'll define the shortest-path distance between 1 and v to be 1000000.

You should report the shortest-path distances to the following ten vertices, in order: 7,37,59,82,99,115,133,165,188,197. You should encode the distances as a comma-separated string of integers. So if you find that all ten of these vertices except 115 are at distance 1000 away from vertex 1 and 115 is 2000 distance away, then your answer should be 1000,1000,1000,1000,1000,2000,1000,1000,1000,1000. Remember the order of reporting DOES MATTER, and the string should be in the same order in which the above ten vertices are given. Please type your answer in the space provided.

IMPLEMENTATION NOTES: This graph is small enough that the straightforward O(mn) time implementation of Dijkstra's algorithm should work fine. OPTIONAL: For those of you seeking an additional challenge, try implementing the heap-based version. Note this requires a heap that supports deletions, and you'll probably need to maintain some kind of mapping between vertices and their positions in the heap.
*/

var fs = require('fs');

// load graph
var graph = fs.readFileSync('dijkstraData.txt').toString().split('\r\n');
graph.splice(graph.length - 1, 1); //remove extra item
graph.forEach(function(element, index, array) {
	graph[index] = element.split('\t');
	graph[index].splice(graph[index].length - 1, 1); // remove extra item
});

// making hash to contain the graph distances
var g = {};
graph.forEach(function(element, index, array) {
	element.forEach(function(e, i, a) {
		if (i < 1) { // initialize the containing hash
			g[e] = {};
		}
		else {
			g[a[0]][e.split(',')[0]] = parseInt(e.split(',')[1], 10);
		}
	});
});


var dijkstras = function(G, a, b) {
	// initialize
	var X = [a]; // vertices explored so far
	var A = {}; // computed shortest path distances/scores
	A[a] = 0; // source has distance of 0
	var B = [a]; // computed shortest path

	// main loop
	while (X.indexOf(b) === -1) { // while destination not in explored nodes
		var edges = [];
		var scores = [];
		var unexploredVertex = [];
		var vertexScore = [];
		for (var i = 0; i < X.length; i++) { // for all explored nodes
			debugger;
			edges = edges.concat(Object.keys(G[X[i]]));
			Object.keys(G[X[i]]).forEach(function(element, index, array) {
				scores.push(A[X[i]] + G[X[i]][element]);
			})
		};
		for (var j = 0; j < edges.length; j++) { // for all edges
			if (X.indexOf(edges[j]) === -1) { // is unexplored
				debugger;
				unexploredVertex.push(edges[j]); // added vertex name
				vertexScore.push(scores[j]); //add vertex score
			}
		}
		// pick shortest path
		if (vertexScore.length > 0) {
			var minScore = Math.min.apply(null, vertexScore);
			var ind = vertexScore.indexOf(minScore);
			debugger;
			X.push(unexploredVertex[ind]); // add to explored
			A[unexploredVertex[ind]] = minScore; // add score
			B.push(unexploredVertex[ind]); // add path
		}
	}

	return A[b];
};

//var map = {a:{b:3,c:1},b:{a:2,c:1},c:{a:4,b:1}}; // test map

var map = {'1':{'2': 10, '4': 30, '5': 100}, '2':{'3': 50}, '3': {'5': 10}, '4': {'3': 20, '5': 60}, '5': {}};
console.log(dijkstras(map, '1', '1'))
console.log(dijkstras(map, '1', '2'))
console.log(dijkstras(map, '1', '3'))
console.log(dijkstras(map, '1', '4'))
console.log(dijkstras(map, '1', '5'))
//console.log(dijkstras(map, 'a', 'c')); // should return 1
//console.log(dijkstras(map, 'a', 'b')); // should return 2

var endPoints = [7,37,59,82,99,115,133,165,188,197];
var ans = '';
for (var i = 0; i < endPoints.length; i++) {
	console.log(ans)
	ans += dijkstras(g, '1', endPoints[i] + '') + ',';
}
console.log(ans)

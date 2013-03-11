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
var graph = fs.readFileSync('kargerMinCut.txt').toString().split('\r\n');
graph.splice(graph.length-1, 1); //remove extra item
graph.forEach(function (element, index, array){
	graph[index] = element.split('\t');
	graph[index].splice(graph[index].length-1, 1); // remove extra item
});
// convert to ints
graph.forEach(function (element, index, array){
	element.forEach(function (element, index, array) {
		array[index] = parseInt(element, 10);
	});
});

// makeHash
var makeHash = function (g) {
	var hash = {};
	g.forEach(function (element, index, array){
		hash[element[0]] = element.slice(1,element.length);
	});
	return hash;
};

// test graph
var testGraph = [[1, 2, 3], [2, 1, 3, 4], [3, 1, 2, 4], [4, 2, 3]];
testGraph = makeHash(testGraph);

// karger's algorithm
var minCut = function(g) {
	if (Object.keys(g).length === 2) { // two vertices
		for (var prop in g) {
			return g[prop].length; // return minimum cut
		}
	} else { // more than two vertices
		// pick random edge
		var randEdge = randomEdge(g);
		// contract edge
			// attach second node's connections to first node
		var combined = g[randEdge[0]].concat(g[randEdge[1]]);
		g[randEdge[0]] = combined;
			// delete second node
		delete g[randEdge[1]];
			// search second node's adjacencies and replace with first node where second node appears
		for (var prop in g) {
			var elements = g[prop];
			var ind = elements.indexOf(randEdge[1]);
			while (~ind) {
				elements[ind] = parseInt(randEdge[0], 10);
				ind = elements.indexOf(randEdge[1]);
			}
		}
		// remove self loops
		for (var prop in g) {
			var elements = g[prop];
			var ind = elements.indexOf(parseInt(prop, 10));
			while (~ind) {
				elements.splice(ind, 1);
				ind = elements.indexOf(parseInt(prop, 10));
			}
		}
		// call minCut again
		return minCut(g);
	}
};

//var baseCase = [[1, 2, 2],[2, 1, 1]];
//baseCase = makeHash(baseCase);
//console.log(minCut(baseCase)); // base case

var randomEdge = function (g) {
	// generate edge list
	var edgeList = [];
	for (var prop in g) {
		var element = g[prop];
		element.forEach(function (element, index, array){
			edgeList.push([prop, element]); // adding to edge list
		});
	}
	// pick random edge
	var iRandomEdge = Math.floor(Math.random()*edgeList.length);
	return edgeList[iRandomEdge];
};

var G = makeHash(graph);
// looping to find global minimum
var N = 200^2 * Math.log(200);
var globalMin = minCut(G);
for (var i = 0; i < N; i++) {
	G = makeHash(graph);
	var min = minCut(G);
	if (min < globalMin) {
		globalMin = min;
	}
}
console.log(globalMin);

/*
The file contains the adjacency list representation of a simple undirected graph. There are 200 vertices labeled 1 to 200. The first column in the file represents the vertex label, and the particular row (other entries except the first column) tells all the vertices that the vertex is adjacent to. So for example, the 6th row looks like : "6 155    56	52	120	......". This just means that the vertex with label 6 is adjacent to (i.e., shares an edge with) the vertices with labels 155,56,52,120,......,etc

Your task is to code up and run the randomized contraction algorithm for the min cut problem and use it on the above graph to compute the min cut. (HINT: Note that you'll have to figure out an implementation of edge contractions. Initially, you might want to do this naively, creating a new graph from the old every time there's an edge contraction. But you should also think about more efficient implementations.) (WARNING: As per the video lectures, please make sure to run the algorithm many times with different random seeds, and remember the smallest cut that you ever find.) Write your numeric answer in the space provided. So e.g., if your answer is 5, just type 5 in the space provided.
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
	console.log(i);
	G = makeHash(graph);
	var min = minCut(G);
	if (min < globalMin) {
		globalMin = min;
	}
}
console.log(globalMin);

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
			g[a[0]][e.split(',')[0]] = e.split(',')[1];
		}
	});
});



// code from: https://github.com/andrewhayward/dijkstra

var Graph = (function(undefined) {

	var extractKeys = function(obj) {
		var keys = [],
			key;
		for (key in obj) {
			Object.prototype.hasOwnProperty.call(obj, key) && keys.push(key);
		}
		return keys;
	}

	var sorter = function(a, b) {
		return parseFloat(a) - parseFloat(b);
	}

	var findPaths = function(map, start, end, infinity) {
		infinity = infinity || Infinity;

		var costs = {},
		open = {
			'0': [start]
		},
		predecessors = {},
		keys;

		var addToOpen = function(cost, vertex) {
			var key = "" + cost;
			if (!open[key]) open[key] = [];
			open[key].push(vertex);
		}

		costs[start] = 0;

		while (open) {
			if (!(keys = extractKeys(open)).length) break;

			keys.sort(sorter);

			var key = keys[0],
				bucket = open[key],
				node = bucket.shift(),
				currentCost = parseFloat(key),
				adjacentNodes = map[node] || {};

			if (!bucket.length) delete open[key];

			for (var vertex in adjacentNodes) {
				if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
					var cost = adjacentNodes[vertex],
						totalCost = cost + currentCost,
						vertexCost = costs[vertex];

					if ((vertexCost === undefined) || (vertexCost > totalCost)) {
						costs[vertex] = totalCost;
						addToOpen(totalCost, vertex);
						predecessors[vertex] = node;
					}
				}
			}
		}

		if (costs[end] === undefined) {
			return null;
		}
		else {
			return predecessors;
		}

	}

	var extractShortest = function(predecessors, end) {
		var nodes = [],
			u = end;

		while (u) {
			nodes.push(u);
			predecessor = predecessors[u];
			u = predecessors[u];
		}

		nodes.reverse();
		return nodes;
	}

	var findShortestPath = function(map, nodes) {
		var start = nodes.shift(),
			end,
			predecessors,
			path = [],
			shortest;

		while (nodes.length) {
			end = nodes.shift();
			predecessors = findPaths(map, start, end);

			if (predecessors) {
				shortest = extractShortest(predecessors, end);
				if (nodes.length) {
					path.push.apply(path, shortest.slice(0, - 1));
				}
				else {
					return path.concat(shortest);
				}
			}
			else {
				return null;
			}

			start = end;
		}
	}

	var toArray = function(list, offset) {
		try {
			return Array.prototype.slice.call(list, offset);
		}
		catch (e) {
			var a = [];
			for (var i = offset || 0, l = list.length; i < l; ++i) {
				a.push(list[i]);
			}
			return a;
		}
	}

	var Graph = function(map) {
		this.map = map;
	}

	Graph.prototype.findShortestPath = function(start, end) {
		if (Object.prototype.toString.call(start) === '[object Array]') {
			return findShortestPath(this.map, start);
		}
		else if (arguments.length === 2) {
			return findShortestPath(this.map, [start, end]);
		}
		else {
			return findShortestPath(this.map, toArray(arguments));
		}
	}

	Graph.findShortestPath = function(map, start, end) {
		if (Object.prototype.toString.call(start) === '[object Array]') {
			return findShortestPath(map, start);
		}
		else if (arguments.length === 3) {
			return findShortestPath(map, [start, end]);
		}
		else {
			return findShortestPath(map, toArray(arguments, 1));
		}
	}

	return Graph;

})();

var G1 = new Graph(g);
console.log(G1.findShortestPath('1', '2'));
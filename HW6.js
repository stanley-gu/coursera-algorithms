/*
Question 1
Download the text file here. (Right click and save link as).

The goal of this problem is to implement a variant of the 2-SUM algorithm (covered in the Week 6 lecture on hash table applications).
The file contains 500,000 positive integers (there might be some repetitions!).This is your array of integers, with the ith row of the file specifying the ith entry of the array.

Your task is to compute the number of target values t in the interval [2500,4000] (inclusive) such that there are distinct numbers x,y in the input file that satisfy x+y=t. (NOTE: ensuring distinctness requires a one-line addition to the algorithm from lecture.)

Write your numeric answer (an integer between 0 and 1501) in the space provided.


OPTIONAL COMMENT: You might notice that the chosen targets are relatively small numbers. (There is a good reason for this. Can you guess what would be the problem with a similar interval of larger targets?) You are welcome to add extra optimizations that take advantage of this fact, though it is not required for the assignment.

OPTIONAL CHALLENGE: If this problem is too easy for you, try implementing your own hash table for it. For example, you could compare performance under the chaining and open addressing approaches to resolving collisions.

REQUEST FOR COMMENTS: Do you have a favorite hash table application that could serve as a programming assignment for this course? Post your idea to the discussion form, and maybe it will be used in the next iteration of this course!
*/

var fs = require('fs');

// load integer array
var ints = fs.readFileSync('IntegerArray.txt').toString().split('\r\n');
ints.splice(ints.length - 1, 1); //remove extra item
ints.forEach(function(element, index, array) {
	ints[index] = parseInt(element, 10);
});


// generate hash table
var intHash = {};
ints.forEach(function(element, index, array) {
	debugger;
	if (intHash[element] === undefined) { // element not in array
		intHash[element] = 1;
	} else {
		intHash[element] += 1;
	}
});

var countSums = function(a, b, hash) { // a and b are range of t's
		var sums = 0;
		for (var t = a; t <= b; t++) {
			for (var x in hash) {
				var numX = hash[x];
				var numY = hash[t - hash[x]];
				if (numY > 0) {
					sums += Math.min(numX, numY);
				}
			}
		}
		return sums;
	};

console.log(countSums(2500, 2501, intHash));

/*
Question 2
Download the text file here.

The goal of this problem is to implement the "Median Maintenance" algorithm (covered in the Week 5 lecture on heap applications). The text file contains a list of the integers from 1 to 10000 in unsorted order; you should treat this as a stream of numbers, arriving one by one. Letting xi denote the ith number of the file, the kth median mk is defined as the median of the numbers x1,…,xk. (So, if k is odd, then mk is ((k+1)/2)th smallest number among x1,…,xk; if k is even, then mk is the (k/2)th smallest number among x1,…,xk.)

In the box below you should type the sum of these 10000 medians, modulo 10000 (i.e., only the last 4 digits). That is, you should compute (m1+m2+m3+⋯+m10000)mod10000.

OPTIONAL EXERCISE: Compare the performance achieved by heap-based and search-tree-based implementations of the algorithm.
*/
function BinaryHeap(scoreFunction) {
	this.content = [];
	this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
	push: function(element) {
		// Add the new element to the end of the array.
		this.content.push(element);
		// Allow it to bubble up.
		this.bubbleUp(this.content.length - 1);
	},

	pop: function() {
		// Store the first element so we can return it later.
		var result = this.content[0];
		// Get the element at the end of the array.
		var end = this.content.pop();
		// If there are any elements left, put the end element at the
		// start, and let it sink down.
		if (this.content.length > 0) {
			this.content[0] = end;
			this.sinkDown(0);
		}
		return result;
	},

	remove: function(node) {
		var length = this.content.length;
		// To remove a value, we must search through the array to find
		// it.
		for (var i = 0; i < length; i++) {
			if (this.content[i] != node) continue;
			// When it is found, the process seen in 'pop' is repeated
			// to fill up the hole.
			var end = this.content.pop();
			// If the element we popped was the one we needed to remove,
			// we're done.
			if (i == length - 1) break;
			// Otherwise, we replace the removed element with the popped
			// one, and allow it to float up or sink down as appropriate.
			this.content[i] = end;
			this.bubbleUp(i);
			this.sinkDown(i);
			break;
		}
	},

	size: function() {
		return this.content.length;
	},

	bubbleUp: function(n) {
		// Fetch the element that has to be moved.
		var element = this.content[n],
			score = this.scoreFunction(element);
		// When at 0, an element can not go up any further.
		while (n > 0) {
			// Compute the parent element's index, and fetch it.
			var parentN = Math.floor((n + 1) / 2) - 1,
				parent = this.content[parentN];
			// If the parent has a lesser score, things are in order and we
			// are done.
			if (score >= this.scoreFunction(parent)) break;

			// Otherwise, swap the parent with the current element and
			// continue.
			this.content[parentN] = element;
			this.content[n] = parent;
			n = parentN;
		}
	},

	sinkDown: function(n) {
		// Look up the target element and its score.
		var length = this.content.length,
			element = this.content[n],
			elemScore = this.scoreFunction(element);

		while (true) {
			// Compute the indices of the child elements.
			var child2N = (n + 1) * 2,
				child1N = child2N - 1;
			// This is used to store the new position of the element,
			// if any.
			var swap = null;
			// If the first child exists (is inside the array)...
			if (child1N < length) {
				// Look it up and compute its score.
				var child1 = this.content[child1N],
					child1Score = this.scoreFunction(child1);
				// If the score is less than our element's, we need to swap.
				if (child1Score < elemScore) swap = child1N;
			}
			// Do the same checks for the other child.
			if (child2N < length) {
				var child2 = this.content[child2N],
					child2Score = this.scoreFunction(child2);
				if (child2Score < (swap == null ? elemScore : child1Score)) swap = child2N;
			}

			// No need to swap further, we are done.
			if (swap == null) break;

			// Otherwise, swap and continue.
			this.content[n] = this.content[swap];
			this.content[swap] = element;
			n = swap;
		}
	}
};

var minHeap = new BinaryHeap(function(x) {
	return x;
});
var maxHeap = new BinaryHeap(function(x) {
	return -x;
});

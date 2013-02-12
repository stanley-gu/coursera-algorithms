//The file contains all of the integers between 1 and 10,000 (inclusive, with no repeats) in unsorted order. The integer in the ith row of the file gives you the ith entry of an input array.
//
//    Your task is to compute the total number of comparisons used to sort the given input file by QuickSort. As you know, the number of comparisons depends on which elements are chosen as pivots, so we'll ask you to explore three different pivoting rules.
//You should not count comparisons one-by-one. Rather, when there is a recursive call on a subarray of length m, you should simply add m−1 to your running total of comparisons. (This is because the pivot element is compared to each of the other m−1 elements in the subarray in this recursive call.)
//
//WARNING: The Partition subroutine can be implemented in several different ways, and different implementations can give you differing numbers of comparisons. For this problem, you should implement the Partition subroutine exactly as it is described in the video lectures (otherwise you might get the wrong answer).
//
//DIRECTIONS FOR THIS PROBLEM:
//
//For the first part of the programming assignment, you should always use the first element of the array as the pivot element.
//
var fs = require('fs');
var array = fs.readFileSync('QuickSort.txt').toString().split("\r\n");
var ints = array.slice(0,10000);
console.log('Loaded in ' + ints.length + ' items in an array')

// Quick Sort
var quicksort = function(array, comparisons, choosePivot) {
    if (array.length <= 1) {
        var sortedArray = array;
        var numComparisons = comparisons;
        return {array: sortedArray, comparisons: numComparisons};
    } else {
        // increment count
        comparisons += array.length - 1;
        // choose pivot
        var p = choosePivot(array);
        var pivot = array[p];
        // partition
        var part = partition(array, p);
        //array = part.array;
        //p = part.p; // location of pivot after partitioning
        // sort left
        var left = quicksort(part.array.slice(0,part.p), 0, choosePivot);
        comparisons += left.comparisons;
        // sort right
        var right = quicksort(part.array.slice(part.p+1, part.array.length), 0, choosePivot);
        comparisons += right.comparisons;
        // recombine
        var combined = [];
        combined = combined.concat(left.array, part.array[part.p], right.array)
        return {array: combined, comparisons: comparisons};
    }
}

var chooseFirstPivot = function(array) {
    return 0;
}

var chooseLastPivot = function(array) {
    return array.length-1;
}

var chooseMedianPivot = function(array) {
    var first = array[0];
    var middle = array[Math.floor(array.length/2)];
    var last = array[array.length-1];
    if ((first < middle) && (last > middle)) {
        return Math.floor(array.length/2);
    } else if ((middle < first) && (first < last)) {
        return 0;
    } else {
        return array.length-1;
    }
}

var partition = function(array, p){
    var pivot = array[p];
    var length = array.length;
    // make a copy and move pivot to the front
    var array2 = array.splice();
    array2[p] = array2[0];
    array2[0] = pivot;
    // partition the array
    var i = 1;
    for (var j = 1; j < length; j++){
        //console.log('i='+i+', j='+j)
        if (array2[j] < pivot) {
            var temp = array2[j];
            array2[j] = array2[i];
            array2[i] = temp;
            i++;
        }
    }
    //console.log('array after partitioning: ' + array)
    // swap pivot
    array2[0] = array2[i-1];
    array2[i-1] = pivot;
    var answer = {array: array2, p: i-1}
    return answer;
};

debugger;
console.log(quicksort(ints, 0, chooseFirstPivot).comparisons)
console.log(quicksort(ints, 0, chooseLastPivot).comparisons)
console.log(quicksort(ints, 0, chooseMedianPivot).comparisons)

var old = fs.readFileSync('IntegerArray.txt').toString().split("\r\n").slice(0,10000);
console.log(quicksort(old, 0, chooseFirstPivot).comparisons)
console.log(quicksort(old, 0, chooseFirstPivot).comparisons)

var a = [3,2,1];
console.log(a);
partition(a,0)
console.log(a)

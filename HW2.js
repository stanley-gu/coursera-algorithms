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
ints.forEach(function(element, index, array) {
    array[index] = parseInt(element, 10);
});

console.log('Loaded in ' + ints.length + ' items in an array');

var oldArray = fs.readFileSync('IntegerArray.txt').toString().split("\r\n").slice(0,100000);
oldArray.forEach(function(element, index, array) {
    array[index] = parseInt(element, 10);
});


// Quick Sort
var quicksort = function(array, start, end, choosePivot) {
    //base case
    if ((end - start) <= 0) {
        return 0;
    } else {
        //recursive case
        // choose pivot
        var pivot = choosePivot(array, start, end);
        // partition array
        pivot = partition(array, start, end, pivot);
        // sort left half
        var leftCount = quicksort(array, start, pivot-1, choosePivot);
        // sort right half
        var rightCount = quicksort(array, pivot+1, end, choosePivot);
        var counts = end - start + leftCount + rightCount;
        return counts;
    }
};
var chooseFirstPivot = function(array, start, end) {
    return start;
};
var chooseLastPivot = function(array, start, end) {
    return end;
};
var chooseMedianPivot = function(array, start, end) {
    var first = array[start];
    var mid = Math.floor((end-start)/2) + start;
    var middle = array[mid];
    var last = array[end];
    var medArray = [first, middle, last];
    var medStruct = {};
    medStruct[first] = start;
    medStruct[middle] = mid;
    medStruct[last] = end;
    quicksort(medArray, 0, 2, chooseFirstPivot);
    return medStruct[medArray[1]];
};

var partition = function(array, start, end, pivot){
    // exchange first item with pivot
    var p = array[pivot];
    array[pivot] = array[start];
    array[start] = p;
    // begin loop
    var i = start+1;
    for (var j = start+1; j <= end; j++) {
        if (array[j] < p) {
            var temp = array[j];
            array[j] = array[i];
            array[i] = temp;
            i++;
        }
    }
    //swap pivot
    array[start] = array[i-1];
    array[i-1] = p;
    //return pivot position
    return i-1;
};

test = oldArray.slice();
count = quicksort(test.slice(), 0, test.length-1, chooseFirstPivot);
console.log(count);
count = quicksort(test.slice(), 0, test.length-1, chooseLastPivot);
console.log(count);
count = quicksort(test.slice(), 0, test.length-1, chooseMedianPivot);
console.log(count);

count = quicksort(ints.slice(), 0, ints.length-1, chooseFirstPivot);
console.log(count);
count = quicksort(ints.slice(), 0, ints.length-1, chooseLastPivot);
console.log(count);
count = quicksort(ints.slice(), 0, ints.length-1, chooseMedianPivot);
console.log(count);

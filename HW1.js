var fs = require('fs');
var array = fs.readFileSync('IntegerArray.txt').toString().split("\r\n");
var ints = array.splice(0,100000);
ints.forEach(function(element, index, array){
    array[index] = parseInt(element);
})

// Merge Sort and Count Inversions
var mergeSort = function(array, inversions) {
    if (array.length <= 1) {
        return {array: array, inversions: inversions};
    }
    else {
        var left = mergeSort(array.slice(0, array.length / 2), inversions);
        var right = mergeSort(array.slice(array.length / 2, array.length), inversions);
        //count inversions thus far
        inversions += left.inversions + right.inversions;
        left = left.array;
        right = right.array;
        var newLength = left.length + right.length;
        var sortedArray = [];
        for (var i = 0; i < newLength; i++) {
            if (left.length < 1) {
                sortedArray.push(right[0]);
                right.splice(0,1);
            } else if (right.length < 1) {
                sortedArray.push(left[0]);
                left.splice(0,1);
            } else if (left[0] < right[0]) {
                sortedArray.push(left[0]);
                left.splice(0,1);
            }
            else {
                sortedArray.push(right[0]);
                right.splice(0,1);
                inversions += left.length;
            }
        }
        return {array: sortedArray, inversions: inversions};
    }
};
var answer = mergeSort(ints,0);
console.log(answer.inversions)
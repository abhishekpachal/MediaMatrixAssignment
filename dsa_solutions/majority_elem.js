function majorityElement(arr, checkNby2) {
    let count = 0;
    let result = null;

    for (let num of arr) {
        if (count === 0) result = num;
        let increment = num == result ? 1 : -1
        // Check if the current number is the same as the last number
        // If it is, increment the count else decrement
        count += increment
    }

    if (!checkNby2) {
        return result
    }

    // Check if the result is the majority element
    count = 0;
    let len = arr.length;
    for (let num of arr) {
        if (num === result) count++;
    }
    // Check if the count is greater than n/2
    return count > Math.floor(len / 2) ? result : null;
}

let arr = [2, 2, 1, 1, 1, 2, 2]

console.log(majorityElement(arr, false))

// check if the majority element is present more than n/2 times
// But in the given scenario, checking is not required as it is written 
//"You may assume that the majority element always exists in the array."
console.log(majorityElement(arr, true))

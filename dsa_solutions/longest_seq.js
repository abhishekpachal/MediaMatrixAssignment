function longestSeq(arr) {
    // Create a set to store unique elements
    const arrSet = new Set(arr);
    let longest = 0;

    for (const num of arrSet) {
        // Check if there is no next smaller number in the set
        if (!arrSet.has(num - 1)) {
            let current = num;
            let streak = 1;
            // Check for the next consecutive bigger numbers
            while (arrSet.has(current + 1)) {
                current += 1;
                streak += 1;
            }
            // Check if current sequence is the longest or the older one
            longest = Math.max(longest, streak);
        }
    }

    return longest;
}

let arr = [100, 4, 200, 1, 3, 2]
console.log(longestSeq(arr))
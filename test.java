// Time Complexity: O(n + m)
// -------------------------
// n = length of string s (source), m = length of string t (target)
// Why?
// - We loop through all characters of 's' once to build the frequency map: O(n)
// - We loop through all characters of 't' once to reduce the frequency and compare: O(m)
// So total time = O(n + m)

// Space Complexity: O(k)
// ----------------------
// k = number of unique characters in string s
// Why?
// - We store the frequency of each unique character in 's' using a HashMap.
// - In worst case (e.g., s = "abcdef"), the map stores all n characters → O(n) space
// - However, k ≤ n, so space = O(k) which is O(n) in worst case
// So we say: Space = O(k) = O(n) in worst case
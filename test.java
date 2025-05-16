import java.util.*;

public class Solution {
    public String minWindow(String str, String target) {

        // Edge case: If source is smaller than target, no window possible
        if (str == null || target == null || str.length() < target.length()) return "";

        int i = 0; // Left pointer
        int j = 0; // Right pointer
        int n = str.length();

        // windowMap stores character counts in current window
        Map<Character, Integer> windowMap = new HashMap<>();

        // targetMap stores required frequency of each character from target
        Map<Character, Integer> targetMap = new HashMap<>();
        for (Character ch : target.toCharArray())
            targetMap.put(ch, targetMap.getOrDefault(ch, 0) + 1);

        int required = targetMap.size(); // Unique characters needed to match
        int formed = 0; // How many unique characters currently match the required frequency

        int minLen = Integer.MAX_VALUE; // Minimum length of valid window found
        int substringStart = 0; // Start index of the minimum window

        // Slide the window using the right pointer 'j'
        while (j < n) {

            char rightChar = str.charAt(j);

            // Only add character to windowMap if it's needed
            if (targetMap.containsKey(rightChar)) {
                windowMap.put(rightChar, windowMap.getOrDefault(rightChar, 0) + 1);

                // If the current character's count matches target, it's a match
                if (windowMap.get(rightChar).intValue() == targetMap.get(rightChar).intValue()) {
                    formed++;
                }
            }

            // Try to shrink the window from the left while it's valid
            while (i <= j && formed == required) {
                // Update the smallest window seen so far
                if (j - i + 1 < minLen) {
                    minLen = j - i + 1;
                    substringStart = i;
                }

                char leftChar = str.charAt(i);

                // Only decrease count in windowMap if it's a relevant character
                if (windowMap.containsKey(leftChar)) {
                    windowMap.put(leftChar, windowMap.get(leftChar) - 1);

                    // If removing this char breaks the match, decrease 'formed'
                    if (windowMap.get(leftChar).intValue() < targetMap.get(leftChar).intValue()) {
                        formed--;
                    }
                }

                i++; // Shrink from the left
            }

            j++; // Expand window from the right
        }

        // Return the smallest valid window or empty if none was found
        return minLen == Integer.MAX_VALUE ? "" : str.substring(substringStart, substringStart + minLen);
    }
}


/*
----------------------------------------------------------------------------------------
Time Complexity: O(N + M)
--------------------------
- N = length of the source string 'str'
- M = length of the target string 'target'

Why?
- We build the targetMap in O(M)
- We traverse the entire source string once with two pointers (i and j), each moving at most N times
- All map operations (get, put, containsKey) are average-case O(1)
So overall time = O(N + M)

Space Complexity: O(K)
--------------------------
- K = number of unique characters in the target string 'target'
- We store at most K characters in both targetMap and windowMap
- So total space = O(2K) = O(K)

Note:
- If we didn’t filter characters using `targetMap.containsKey()`, then windowMap could grow up to U (unique characters in 'str')
- But here we ensure windowMap only stores relevant characters, so we optimize space to O(K)
----------------------------------------------------------------------------------------
*/
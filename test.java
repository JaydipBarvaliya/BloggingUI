import java.util.*;

public class Solution {
    public String minWindow(String s, String t) {
        // Base check
        if (s == null || t == null || s.length() < t.length()) return "";

        // Step 1: Create a frequency map for characters in t
        Map<Character, Integer> targetMap = new HashMap<>();
        for (char ch : t.toCharArray()) {
            targetMap.put(ch, targetMap.getOrDefault(ch, 0) + 1);
        }

        // Step 2: Prepare to use sliding window
        Map<Character, Integer> windowMap = new HashMap<>();
        int i = 0, j = 0;  // left and right pointers
        int required = targetMap.size();  // number of unique characters we need to match
        int formed = 0;  // how many characters currently match target frequency

        // To track the best (smallest) window
        int minLen = Integer.MAX_VALUE;
        int minStart = 0;

        // Step 3: Slide the window
        while (j < s.length()) {
            char ch = s.charAt(j);
            // Add character to window map
            windowMap.put(ch, windowMap.getOrDefault(ch, 0) + 1);

            // If this character is needed and counts match, increment 'formed'
            if (targetMap.containsKey(ch) &&
                windowMap.get(ch).intValue() == targetMap.get(ch).intValue()) {
                formed++;
            }

            // Step 4: Try shrinking the window when it's valid
            while (i <= j && formed == required) {
                // Update minimum window
                if ((j - i + 1) < minLen) {
                    minLen = j - i + 1;
                    minStart = i;
                }

                // Shrink from the left
                char leftChar = s.charAt(i);
                windowMap.put(leftChar, windowMap.get(leftChar) - 1);

                // If removing leftChar breaks the requirement, reduce 'formed'
                if (targetMap.containsKey(leftChar) &&
                    windowMap.get(leftChar).intValue() < targetMap.get(leftChar).intValue()) {
                    formed--;
                }

                i++;  // move left pointer
            }

            j++;  // move right pointer
        }

        // Step 5: Return result
        return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
    }
}
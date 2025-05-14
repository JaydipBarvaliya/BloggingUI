class Solution {
    public int minMeetingRooms(List<Interval> intervals) {

        if (intervals.isEmpty()) return 0;
        if (intervals.size() == 1) return 1;

        int totalRooms = 1;
        int prevIndex = intervals.get(0).end;

        for (int i = 1; i < intervals.size(); i++) {
            Interval interval = intervals.get(i);
            if (interval.start < prevIndex) {
                totalRooms++;
            }
            prevIndex = interval.end;
        }
        return totalRooms;
    }
}
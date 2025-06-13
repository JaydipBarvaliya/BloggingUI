public static boolean areAllApprovalsSigned(List<Map<String, Object>> approvals) {
        for (Map<String, Object> approval : approvals) {
            if (approval.get("signed") == null) {
                return false; // If any approval is not signed, return false
            }
        }
        re
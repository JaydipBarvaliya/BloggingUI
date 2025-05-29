private static String handleNotFoundError(JsonNode root, String transactionType) {
    String technicalMessage = root.path("technical").asText(UNKNOWN);
    JsonNode parameters = root.path("parameters");

    return switch (transactionType) {
        case TransactionType.DELETE_DOCUMENT.getShortForm() -> {
            if (parameters != null && !parameters.isEmpty()) {
                String documentId = parameters.path("documentIds").asText(UNKNOWN);
                yield String.format("The following Document Id(s) do not exist: %s", documentId);
            }
            yield technicalMessage;
        }

        case TransactionType.REJECT_ATTACHMENTS.getShortForm() -> technicalMessage;

        default -> UNKNOWN;
    };
}
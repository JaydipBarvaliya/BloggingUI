catch (SharedServiceLayerException e) {
    Throwable cause = e.getCause(); // unwrap the actual exception

    if (cause instanceof HttpClientErrorException) {
        HttpClientErrorException httpEx = (HttpClientErrorException) cause;
        String jsonBody = httpEx.getResponseBodyAsString();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(jsonBody);

            String message = root.path("message").asText();
            String documentId = root.path("parameters").path("documentIds").asText();

            String finalMessage = String.format("The specified document does not exist: %s (%s)", documentId, message);
            throw PackageManagerUtil.buildBadRequestException(finalMessage);

        } catch (Exception parsingEx) {
            throw PackageManagerUtil.buildBadRequestException("Failed to parse error response from OneSpan.");
        }
    }

    // fallback if not the expected cause
    throw PackageManagerUtil.buildBadRequestException("Unexpected error: " + e.getMessage());
}
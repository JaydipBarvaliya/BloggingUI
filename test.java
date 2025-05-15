catch (SharedServiceLayerException e) {
    Throwable cause = e.getCause();

    if (cause instanceof HttpClientErrorException httpEx) {
        HttpStatus status = httpEx.getStatusCode();
        String jsonBody = httpEx.getResponseBodyAsString();
        log.error("Received error response: {}", jsonBody);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(jsonBody);

            if (status == HttpStatus.NOT_FOUND) {
                String documentId = root.path("parameters").path("documentIds").asText("unknown");
                String message = String.format("The following Document Id's does not exist: %s", documentId);
                throw CommonUtil.buildBadRequestException(message);

            } else if (status == HttpStatus.BAD_REQUEST) {
                String message = root.path("message").asText("unknown");
                throw CommonUtil.buildBadRequestException(message);
            }

        } catch (Exception parseException) {
            log.error("Failed to parse error response JSON: {}", jsonBody, parseException);
            throw CommonUtil.buildBadRequestException("Failed to process error response from downstream system.");
        }
    }

    throw CommonUtil.buildBadRequestException("Error while deleting multiple documents: " + e.getMessage());
}
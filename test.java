catch (HttpClientErrorException ex) {
    String responseBody = ex.getResponseBodyAsString(); // This is the full JSON body

    try {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode root = objectMapper.readTree(responseBody);

        // Extract fields
        String message = root.path("message").asText(); // e.g. "The specified documents does not exist."
        String documentId = root.path("parameters").path("documentIds").asText(); // e.g. "helloworld"

        // Build custom message
        String finalMessage = String.format("The specified document does not exist: %s (%s)", documentId, message);

        // Example: return ResponseEntity or throw custom exception
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(finalMessage);

    } catch (Exception parseEx) {
        log.error("Failed to parse OneSpan error response", parseEx);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error parsing OneSpan error response");
    }
}
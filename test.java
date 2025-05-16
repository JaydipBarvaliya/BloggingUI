package com.td.esig.api.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

public class HttpClientExceptionParser {

    public static RuntimeException parse(HttpClientErrorException httpEx) {
        try {
            String jsonBody = httpEx.getResponseBodyAsString();
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(jsonBody);

            if (httpEx.getStatusCode() == HttpStatus.NOT_FOUND) {
                String documentId = root.path("parameters").path("documentIds").asText("unknown");
                String message = String.format("The following Document Id's does not exist: %s", documentId);
                return CommonUtil.buildBadRequestException(message);

            } else if (httpEx.getStatusCode() == HttpStatus.BAD_REQUEST) {
                String message = root.path("message").asText("unknown");
                return CommonUtil.buildBadRequestException(message);
            }
        } catch (Exception ex) {
            return CommonUtil.buildBadRequestException("Failed to parse error response: " + ex.getMessage());
        }

        return CommonUtil.buildBadRequestException("Unhandled error occurred while processing response");
    }
}
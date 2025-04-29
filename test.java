HttpEntity<OneSpanSignerRequest> requestEntity = new HttpEntity<>(oneSpanPayload, httpHeaders);

ResponseEntity<String> responseEntity = eslGateway.updateSignerInfo(
    requestEntity,
    packageId,
    roleId,
    saasUrl,
    false
);
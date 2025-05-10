@Test
void deleteDocument_whenExceptionThrown_shouldReturnErrorResponse() throws JsonProcessingException {
    String eventId = "k6OpP-5r6fYAVbgs_ZawY-Kv-KW08";
    String lobId = "dna";
    String messageID = "test";
    String traceabilityID = "Postman";

    packageManagerUtil.jwtSecuredFlag = "true";

    HeaderInfo headerInfo = setupHeaderInfo();
    when(packageManagerUtil.getUpdatedHeadersInfo(any())).thenReturn(headerInfo);

    when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer dummy");
    when(request.getHeader(HttpHeaders.CONTENT_TYPE)).thenReturn("application/json");
    when(request.getHeader(HttpHeaders.ACCEPT)).thenReturn("application/json");
    when(config.getConfigProperty(ApiConstants.DEFAULT, ApiConstants.ADMIN_CLIENT_ID)).thenReturn("TestScopeClient");

    when(packageService.deleteDocument(any(), any(), any(), any()))
        .thenThrow(new SharedServiceLayerException("500", "Internal Error"));

    SharedServiceLayerException thrown = Assertions.assertThrows(
        SharedServiceLayerException.class,
        () -> esignatureeventsApiDelegate.deleteDocument(eventId, deleteDocumentRequest, lobId, messageID, traceabilityID)
    );

    Assertions.assertEquals("500", thrown.getStatus());
    Assertions.assertEquals("Internal Error", thrown.getMessage());
}
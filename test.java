@Test
void testDeleteDocumentThrowsSharedServiceLayerExceptionWithHttpClientError() throws Exception {
    // Arrange
    String packageId = "pkg123";
    DeleteDocumentRequest request = new DeleteDocumentRequest(); // populate if needed
    String saasUrl = "http://mock-saas";
    HeaderInfo headerInfo = new HeaderInfo();

    // Simulate JSON body
    String jsonBody = "{ \"parameters\": { \"documentIds\": \"doc-123\" } }";
    HttpClientErrorException httpEx = mock(HttpClientErrorException.class);
    when(httpEx.getResponseBodyAsString()).thenReturn(jsonBody);

    // Simulate the cause of the exception
    SharedServiceLayerException ssle = new SharedServiceLayerException("Outer error", httpEx);

    // Force eslGateway to throw
    when(eslGateway.deleteDocument(eq(packageId), any(), eq(saasUrl), eq(false)))
        .thenThrow(ssle);

    // Act & Assert
    SharedServiceLayerException thrown = assertThrows(
        SharedServiceLayerException.class,
        () -> packageService.deleteDocument(headerInfo, packageId, request, saasUrl, false)
    );

    assertTrue(thrown.getMessage().contains("doc-123")); // Validates parsed documentId
}
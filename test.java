@Test
void testRejectAttachment_throwsSharedServiceLayerException() throws Exception {
    // Arrange
    String eventId            = "event123";
    String partyKey           = "partyKey123";
    RejectAttachmentRequest req   = new RejectAttachmentRequest();
    String lobId              = "lob123";
    String messageID          = "message123";
    String traceabilityID     = "trace123";

    HttpHeaders httpHeaders   = setupHttpHeaders();
    HeaderInfo headerInfo     = new HeaderInfo();

    // Stub your spy to return our fake headers
    // (if you used a real @InjectMocks delegate, switch to doReturn to avoid calling the real method):
    doReturn(httpHeaders)
      .when(esignatureeventsApiDelegate)
      .buildHeaders(lobId, messageID, traceabilityID);

    // Use a loose matcher so you don’t have to match the exact HttpHeaders instance
    when(packageManagerUtil.getUpdatedHeadersInfo(any(HttpHeaders.class)))
      .thenReturn(headerInfo);
    // Ditto for the LOB lookup
    when(packageManagerUtil.getLobFromHeader(any(HttpHeaders.class)))
      .thenReturn(lobId);

    // **🔥 Here’s the key fix 🔥**
    // The last arg of rejectAttachment is a String, so use anyString(), not any(RejectAttachmentRequest.class)!
    doThrow(new SharedServiceLayerException(new Status(), "Error occurred"))
      .when(packageService)
      .rejectAttachment(
        any(HeaderInfo.class),
        anyString(),
        anyString(),
        any(RejectAttachmentRequest.class),
        anyString()         // ← was mis-typed before
      );

    // Act & Assert
    SharedServiceLayerException ex = assertThrows(
      SharedServiceLayerException.class,
      () -> esignatureeventsApiDelegate.rejectAttachment(
            eventId,
            partyKey,
            req,
            lobId,
            messageID,
            traceabilityID
      )
    );

    assertEquals("Error occurred", ex.getMessage());
}
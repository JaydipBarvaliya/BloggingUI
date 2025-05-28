when(packageService.rejectAttachment(
    any(HeaderInfo.class),
    anyString(),
    anyString(),
    any(RejectAttachmentRequest.class),
    anyString()
)).thenThrow(new SharedServiceLayerException(new Status(500), "Error occurred"));
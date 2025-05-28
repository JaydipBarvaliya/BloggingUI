doThrow(new SharedServiceLayerException(new Status(500), "Error occurred"))
    .when(packageService).rejectAttachment(
        any(HeaderInfo.class),
        anyString(), // packageId
        anyString(), // partyKey
        any(RejectAttachmentRequest.class),
        anyString()  // lobId
    );
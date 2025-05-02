Status mockStatus = new Status(400, Severity.Error, "mock exception");
doThrow(new SharedServiceLayerException(mockStatus)).when(packageService)
    .updateSigner(any(), eq(eventId), eq(partyId), eq(updateSignerRequest), eq(lobId));
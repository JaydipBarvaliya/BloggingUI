private UpdateSignerRequest buildRequestWithInvalidType(String invalidType, String phone) {
    UpdateSignerRequestSignerInner signer = new UpdateSignerRequestSignerInner();
    signer.setTelephoneNum(phone);

    UpdateSignerRequestSignerInnerAuthentication auth = new UpdateSignerRequestSignerInnerAuthentication();
    auth.setAuthenticationMethodTypeCdValue(invalidType); // Bypasses enum, sets raw value
    signer.setAuthentication(auth);

    UpdateSignerRequest request = new UpdateSignerRequest();
    request.setSigner(List.of(signer));
    return request;
}



@Test
void testDefaultInvalidAuthType_throwsException() {
    UpdateSignerRequest request = buildRequestWithInvalidType("INVALID_TYPE", "1234567890");

    SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
        validateAuthTypeUtil.validateAuthType(request, "lob")
    );

    assertEquals("Authentication.authenticationMethodTypeCd is not a valid type", ex.getMessage());
}
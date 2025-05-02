private UpdateSignerRequest buildRequestWithInvalidEnum(String invalidType, String phone) throws Exception {
    UpdateSignerRequestSignerInner signer = new UpdateSignerRequestSignerInner();
    signer.setTelephoneNum(phone);

    UpdateSignerRequestSignerInnerAuthentication auth = new UpdateSignerRequestSignerInnerAuthentication();

    // Set invalid enum using reflection
    var field = auth.getClass().getDeclaredField("authenticationMethodTypeCd");
    field.setAccessible(true);
    field.set(auth, invalidType); // forcibly inject string into enum field

    signer.setAuthentication(auth);

    UpdateSignerRequest request = new UpdateSignerRequest();
    request.setSigner(List.of(signer));
    return request;
}


@Test
void testDefaultInvalidAuthType_throwsException() throws Exception {
    UpdateSignerRequest request = buildRequestWithInvalidEnum("INVALID_TYPE", "1234567890");

    SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
        validateAuthTypeUtil.validateAuthType(request, "lob")
    );

    assertEquals("Authentication.authenticationMethodTypeCd is not a valid type", ex.getMessage());
}
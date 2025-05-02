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
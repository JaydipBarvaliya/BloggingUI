private UpdateSignerRequest buildRequest(String authTypeString, String phone) {
    UpdateSignerRequestSignerInner signer = new UpdateSignerRequestSignerInner();
    signer.setTelephoneNum(phone);

    UpdateSignerRequestSignerInnerAuthentication auth = new UpdateSignerRequestSignerInnerAuthentication();
    // simulate setting invalid enum value using raw JSON or reflection in real test, or skip setting enum entirely
    auth.setAuthenticationMethodTypeCdValue(authTypeString); // or a custom setter if available
    signer.setAuthentication(auth);

    UpdateSignerRequest request = new UpdateSignerRequest();
    request.setSigner(List.of(signer));
    return request;
}
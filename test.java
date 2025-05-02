private UpdateSignerRequest buildRequest(
    UpdateSignerRequestSignerInnerAuthentication.AuthenticationMethodTypeCdEnum authTypeEnum,
    String phone
) {
    UpdateSignerRequestSignerInner signer = new UpdateSignerRequestSignerInner();
    signer.setTelephoneNum(phone);

    UpdateSignerRequestSignerInnerAuthentication auth = new UpdateSignerRequestSignerInnerAuthentication();
    auth.setAuthenticationMethodTypeCd(authTypeEnum);
    signer.setAuthentication(auth);

    UpdateSignerRequest request = new UpdateSignerRequest();
    request.setSigner(List.of(signer));
    return request;
}
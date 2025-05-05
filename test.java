import org.apache.commons.lang3.ObjectUtils;

public OneSpanSignerInfoUpdateRequest mapToOneSpan(UpdateSignerRequestSignerInner request,
                                                    SharedServicePackage sharedServicePackage,
                                                    String roleId,
                                                    Auth auth) throws SharedServiceLayerException {

    Signer existingSigner = findExistingSigner(request.getEmailAddressTxt(), sharedServicePackage);
    OneSpanSignerInfoUpdateRequest.Signer signer = buildSigner(request, existingSigner, roleId, auth);

    OneSpanSignerInfoUpdateRequest payload = new OneSpanSignerInfoUpdateRequest();
    payload.setType("SIGNER");
    payload.setName(roleId);
    payload.setSigners(Collections.singletonList(signer));

    return payload;
}

private Signer findExistingSigner(String email, SharedServicePackage sharedServicePackage) throws SharedServiceLayerException {
    return sharedServicePackage.getRoles().stream()
            .filter(role -> role.getType() == RoleType.SIGNER)
            .flatMap(role -> role.getSigners().stream())
            .filter(signer -> StringUtils.equalsIgnoreCase(signer.getEmail(), email))
            .findFirst()
            .orElseThrow(() -> CommonUtil.buildBadRequestException("Signer not found"));
}

private OneSpanSignerInfoUpdateRequest.Signer buildSigner(UpdateSignerRequestSignerInner request,
                                                           Signer existing,
                                                           String roleId,
                                                           Auth auth) {
    OneSpanSignerInfoUpdateRequest.Signer signer = new OneSpanSignerInfoUpdateRequest.Signer();
    signer.setEmail(ObjectUtils.defaultIfNull(request.getEmailAddressTxt(), existing.getEmail()));
    signer.setFirstName(ObjectUtils.defaultIfNull(request.getFirstName(), existing.getFirstName()));
    signer.setLastName(ObjectUtils.defaultIfNull(request.getLastName(), existing.getLastName()));
    signer.setPhone(ObjectUtils.defaultIfNull(request.getTelephoneNum(), existing.getPhone()));
    signer.setTitle(ObjectUtils.defaultIfNull(request.getJobTitle(), existing.getTitle()));
    signer.setCompany(ObjectUtils.defaultIfNull(request.getOrganizationName(), existing.getCompany()));
    signer.setId(roleId);
    signer.setAuth(auth);
    return signer;
}
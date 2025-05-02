boolean isEmailAssociatedWithSigner(SharedServicePackage sharedServicePackage, String email) throws SharedServiceLayerException {
    if (CollectionUtils.isEmpty(sharedServicePackage.getRoles())) {
        return false;
    }

    for (Role role : sharedServicePackage.getRoles()) {
        if (CollectionUtils.isEmpty(role.getSigners())) {
            continue;
        }

        for (Signer signer : role.getSigners()) {
            if (signer == null || !StringUtils.equalsIgnoreCase(signer.getEmail(), email)) {
                continue;
            }

            if (RoleType.SENDER == role.getType()) {
                throw CommonUtil.buildBadRequestException("Provided email address belongs to a SENDER, not a SIGNER.");
            }

            if (RoleType.SIGNER == role.getType()) {
                return true;
            }
        }
    }

    return false;
}
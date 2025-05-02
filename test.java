boolean isEmailAssociatedWithSigner(SharedServicePackage sharedServicePackage, String email) throws SharedServiceLayerException {
    if (CollectionUtils.isEmpty(sharedServicePackage.getRoles())) {
        return false;
    }

    for (Role role : sharedServicePackage.getRoles()) {
        List<Signer> signers = role.getSigners();
        if (CollectionUtils.isEmpty(signers)) {
            continue;
        }

        for (Signer signer : signers) {
            if (signer == null || !StringUtils.equalsIgnoreCase(signer.getEmail(), email)) {
                continue;
            }

            RoleType type = role.getType();
            if (RoleType.SENDER == type) {
                throw CommonUtil.buildBadRequestException("Provided email address belongs to a SENDER, not a SIGNER.");
            }

            if (RoleType.SIGNER == type) {
                return true;
            }
        }
    }

    return false;
}
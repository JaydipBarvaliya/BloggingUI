public boolean isEmailAssociatedWithSigner(SharedServicePackage sharedServicePackage, String email)
        throws SharedServiceLayerException {

    if (CollectionUtils.isEmpty(sharedServicePackage.getRoles())) return false;

    try {
        return sharedServicePackage.getRoles().stream()
                .filter(role -> CollectionUtils.isNotEmpty(role.getSigners()))
                .flatMap(role -> role.getSigners().stream()
                        .filter(signer -> signer != null && StringUtils.equalsIgnoreCase(signer.getEmail(), email))
                        .map(signer -> {
                            RoleType type = role.getType();
                            if (type == RoleType.SENDER) {
                                throw new RuntimeException(CommonUtil.buildBadRequestException(
                                        "Provided email address belongs to a SENDER, not a SIGNER."));
                            }
                            return type == RoleType.SIGNER;
                        }))
                .anyMatch(Boolean::booleanValue);
    } catch (RuntimeException ex) {
        if (ex.getCause() instanceof SharedServiceLayerException) {
            throw (SharedServiceLayerException) ex.getCause();
        }
        throw ex;
    }
}
private boolean isEmailAssociatedWithSigner(SharedServicePackage sharedServicePackage, String email) throws SharedServiceLayerException {
    boolean emailFound = false;
    boolean isSigner = false;

    if (CollectionUtils.isNotEmpty(sharedServicePackage.getRoles())) {
        for (Role role : sharedServicePackage.getRoles()) {
            if (CollectionUtils.isNotEmpty(role.getSigners())) {
                for (Signer signer : role.getSigners()) {
                    if (signer != null && StringUtils.equalsIgnoreCase(signer.getEmail(), email)) {
                        emailFound = true;
                        if (StringUtils.equalsIgnoreCase(role.getType(), "SENDER")) {
                            throw new SharedServiceLayerException(
                                new Status(HttpStatus.BAD_REQUEST.value(), Severity.Error),
                                "Provided email address belongs to a SENDER, not a SIGNER."
                            );
                        } else if (StringUtils.equalsIgnoreCase(role.getType(), "SIGNER")) {
                            isSigner = true;
                        }
                    }
                }
            }
        }
    }

    if (!emailFound) {
        throw new SharedServiceLayerException(
            new Status(HttpStatus.BAD_REQUEST.value(), Severity.Error),
            "Provided email address not found in the transaction."
        );
    }

    return isSigner;
}

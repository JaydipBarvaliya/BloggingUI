private boolean isEmailAssociatedWithSigner(SharedServicePackage sharedServicePackage, String email) {
    List<IndividualToEvent> individuals = sharedServicePackage.getIndividualToEvent();

    boolean emailFound = false;

    if (CollectionUtils.isNotEmpty(individuals)) {
        for (IndividualToEvent individual : individuals) {
            if (individual.getIndividual() != null &&
                StringUtils.equalsIgnoreCase(individual.getIndividual().getEmailAddressTxt(), email)) {

                emailFound = true;

                // Check if it's a signer
                return StringUtils.equalsIgnoreCase(individual.getRoleCd(), "SIGNER");
            }
        }
    }

    if (!emailFound) {
        throw new SharedServiceLayerException(
            new Status(HttpStatus.BAD_REQUEST.value(), Severity.Error),
            "Provided email address not found in the transaction."
        );
    }

    // If found but roleCd was not SIGNER
    return false;
}



boolean isSigner = isEmailAssociatedWithSigner(sharedServicePackage, updateSignerInfoRequest.getEmailAddress());

if (!isSigner) {
    throw new SharedServiceLayerException(
        new Status(HttpStatus.BAD_REQUEST.value(), Severity.Error),
        "Provided email address does not belong to a signer."
    );
}

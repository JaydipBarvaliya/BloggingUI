private void validateSignerEmail(SharedServicePackage sharedServicePackage, String email) throws SharedServiceLayerException {
    List<IndividualToEvent> individuals = sharedServicePackage.getIndividualToEvent();

    boolean emailFound = false;

    if (CollectionUtils.isNotEmpty(individuals)) {
        for (IndividualToEvent individual : individuals) {
            if (individual.getIndividual() != null && 
                StringUtils.equalsIgnoreCase(individual.getIndividual().getEmailAddressTxt(), email)) {

                emailFound = true;

                if (StringUtils.equalsIgnoreCase(individual.getRoleCd(), "SENDER")) {
                    // If it's a sender, throw error
                    throw new SharedServiceLayerException(
                        new Status(HttpStatus.BAD_REQUEST.value(), Severity.Error),
                        "Provided email address belongs to Sender. Update is only allowed for Signers."
                    );
                }

                // If SIGNER, no problem. Just break and continue the update.
                break;
            }
        }
    }

    if (!emailFound) {
        throw new SharedServiceLayerException(
            new Status(HttpStatus.BAD_REQUEST.value(), Severity.Error),
            "Provided email address not found in the transaction."
        );
    }
}

List<Role> matchingRoles = sharedServicePackage.getRoles().stream()
    .filter(role -> CollectionUtils.isNotEmpty(role.getSigners()) &&
        role.getSigners().stream().anyMatch(signer -> signer.getEmail().equalsIgnoreCase(partyKey)))
    .toList();

public void mapIndividualToEvent(
        SharedServicePackage sharedServicePackage,
        List<RetrieveESignatureEventsRsIndividualToEventInner> individualToEventList,
        List<RetrieveESignatureEventsRsDocument> documentList) {

    // Step 1: If COMPLETED, set status for all
    if (sharedServicePackage.getStatus() == PackageStatus.COMPLETED) {
        individualToEventList.forEach(individualToEvent ->
            individualToEvent.setStatusCd(SignerStatus.COMPLETED.name()));
    } else {
        // Step 2: Build Role ID -> Document IDs map
        Map<String, List<String>> roleToDocumentsMap = new HashMap<>();
        sharedServicePackage.getRoles().forEach(role ->
            roleToDocumentsMap.put(role.getId(), new ArrayList<>())
        );

        documentList.stream()
            .filter(document -> document.getApprovals() != null)
            .flatMap(document -> document.getApprovals().stream()
                .map(approval -> new AbstractMap.SimpleEntry<>(approval.getRole(), document.getId())))
            .forEach(entry -> {
                String roleId = entry.getKey();
                String documentId = entry.getValue();
                roleToDocumentsMap.computeIfAbsent(roleId, k -> new ArrayList<>()).add(documentId);
            });

        // Step 3: Mark each individual as COMPLETED or INCOMPLETE
        for (RetrieveESignatureEventsRsIndividualToEventInner individualToEvent : individualToEventList) {
            String roleId = individualToEvent.getPartyEventKey();
            List<String> documentIds = roleToDocumentsMap.getOrDefault(roleId, Collections.emptyList());

            boolean allSigned = documentList.stream()
                .filter(document -> documentIds.contains(document.getId()))
                .filter(document -> document.getApprovals() != null)
                .flatMap(document -> document.getApprovals().stream())
                .filter(approval -> roleId.equals(approval.getRole()))
                .allMatch(approval -> approval.getSigned() != null);

            individualToEvent.setStatusCd(allSigned ?
                SignerStatus.COMPLETED.name() : SignerStatus.INCOMPLETE.name());
        }
    }

    // Final Step: Always run this
    mapDocumentsWithIndividuals(documentList, individualToEventList, sharedServicePackage.getDocuments());
}
for (RetrieveESignatureEventsRsIndividualToEventInner individualToEvent : individualToEventList) {
    List<RetrieveESignatureEventsRsIndividualToEventInnerDocumentToSignerInner> documentToSignerList = new ArrayList<>();

    for (Document esignLiveDocument : documentList) {
        boolean isApprover = false;
        List<Approval> approvalList = esignLiveDocument.getApprovals();

        if (CollectionUtils.isEmpty(approvalList)) {
            RetrieveESignatureEventsRsIndividualToEventInnerDocumentToSignerInner documentToSigner =
                createBasicDocumentToSigner(esignLiveDocument, null, null);
            addToRAMLIfAbsent(tdRAMLDocumentList, ramLDocMap, esignLiveDocument, documentToSigner);
            documentToSignerList.add(documentToSigner);
            continue;
        }

        for (Approval approval : approvalList) {
            if (approval.getRole().equalsIgnoreCase(individualToEvent.getPartyEventKey())) {
                RetrieveESignatureEventsRsIndividualToEventInnerDocumentToSignerInner documentToSigner =
                    createBasicDocumentToSigner(esignLiveDocument, documentToSigner, approval);
                isApprover = true;
                addToRAMLIfAbsent(tdRAMLDocumentList, ramLDocMap, esignLiveDocument, documentToSigner);
                documentToSignerList.add(documentToSigner);
            }
        }

        if (!isApprover && RoleType.SENDER.name().equals(individualToEvent.getRoleCd())) {
            RetrieveESignatureEventsRsIndividualToEventInnerDocumentToSignerInner documentToSigner =
                createBasicDocumentToSigner(esignLiveDocument, null, null);
            documentToSignerList.add(documentToSigner);
        }
    }

    individualToEvent.setDocumentToSigner(documentToSignerList);
}





private RetrieveESignatureEventsRsIndividualToEventInnerDocumentToSignerInner createBasicDocumentToSigner(
        Document esignDoc,
        RetrieveESignatureEventsRsIndividualToEventInnerDocumentToSignerInner documentToSigner,
        Approval approval) {

    RetrieveESignatureEventsRsIndividualToEventInnerDocumentToSignerInner result =
        new RetrieveESignatureEventsRsIndividualToEventInnerDocumentToSignerInner();

    mapIndividualDocumentField(esignDoc, documentInfo);
    if (approval != null) {
        mapDocumentInfoToDocumentToSigner(tdRAMLDocumentList, ramLDocMap, esignDoc, documentInfo, result, approval);
    }

    result.setDocumentName(esignDoc.getName());
    return result;
}

private void addToRAMLIfAbsent(
        List<RetrieveESignatureEventsRsDocumentInner> tdRAMLDocumentList,
        Map<String, RetrieveESignatureEventsRsDocumentInner> ramLDocMap,
        Document esignDoc,
        RetrieveESignatureEventsRsIndividualToEventInnerDocumentToSignerInner documentInfo) {
    
    if (!ramLDocMap.containsKey(esignDoc.getName())) {
        RetrieveESignatureEventsRsDocumentInner docInfo = new RetrieveESignatureEventsRsDocumentInner();
        docInfo.setDocumentName(esignDoc.getName());
        tdRAMLDocumentList.add(docInfo);
        ramLDocMap.put(esignDoc.getName(), docInfo);
    }
}








@Autowired
private UpdateSignerInfoMapper updateSignerInfoMapper;

// Inside updateSigner method
OneSpanSignerRequest payloadObj = updateSignerInfoMapper.mapToOneSpan(input, roleId, auth);
String payload = updateSignerInfoMapper.serializeWithDirtyFieldsFilter(payloadObj);
HttpEntity<String> requestEntity = new HttpEntity<>(payload, httpHeaders);
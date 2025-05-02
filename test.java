ObjectMapper mapper = new ObjectMapper();
JsonNode rootNode = mapper.readTree(responseEntity.getBody());

// Navigate to the first signer
JsonNode signerNode = rootNode.get("signers").get(0);

// Extract values from response
String responseEmail = signerNode.get("email").asText();
String responseFirstName = signerNode.get("firstName").asText();
String responseLastName = signerNode.get("lastName").asText();
String responsePhone = signerNode.get("phone").asText();
String responseCompany = signerNode.get("company").asText();
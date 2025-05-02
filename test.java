@ExtendWith(MockitoExtension.class)
class EslGatewayTest {

    @InjectMocks
    private EslGateway eslGateway;

    @Mock
    private ESLUrlTemplate baseUrl;

    @Mock
    private RestTemplate restTemplate;

    @Test
    void testUpdateSignerInfo_success() throws Exception {
        // Arrange
        String packageId = "pkg123";
        String roleId = "signer1";
        String baseURL = "https://dummy.url";
        boolean retry = false;
        String expectedUrl = "https://dummy.url/api/packages/pkg123/roles/signer1";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestEntity = new HttpEntity<>("{\"email\":\"test@email.com\"}", headers);

        // Optional: If forwardToESL is a custom method, mock it or make it public for spying

        // Act
        ResponseEntity<String> response = eslGateway.updateSignerInfo(requestEntity, packageId, roleId, baseURL, retry);

        // Assert (if forwardToESL is real, assert the output if it's deterministic)
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue()); // if mocked
    }
}
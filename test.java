import com.td.esig.common.util.SharedServiceLayerException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

public class HttpClientErrorExceptionParserTest {

    @Test
    public void shouldReturnExceptionWithNotFoundMessage() {
        String responseJson = "{ \"parameters\": { \"documentIds\": \"12345\" } }";
        HttpClientErrorException ex = new HttpClientErrorException(
                HttpStatus.NOT_FOUND,
                "Not Found",
                responseJson.getBytes(StandardCharsets.UTF_8),
                StandardCharsets.UTF_8
        );

        SharedServiceLayerException result = HttpClientErrorExceptionParser.httpClientErrorExceptionParser(ex);

        assertTrue(result.getMessage().contains("The following Document Id's does not exist: 12345"));
    }

    @Test
    public void shouldReturnExceptionWithBadRequestMessage() {
        String responseJson = "{ \"message\": \"Invalid document request\" }";
        HttpClientErrorException ex = new HttpClientErrorException(
                HttpStatus.BAD_REQUEST,
                "Bad Request",
                responseJson.getBytes(StandardCharsets.UTF_8),
                StandardCharsets.UTF_8
        );

        SharedServiceLayerException result = HttpClientErrorExceptionParser.httpClientErrorExceptionParser(ex);

        assertEquals("Invalid document request", result.getMessage());
    }

    @Test
    public void shouldReturnFallbackExceptionOnParseError() {
        String invalidJson = "Invalid JSON";
        HttpClientErrorException ex = new HttpClientErrorException(
                HttpStatus.BAD_REQUEST,
                "Bad Request",
                invalidJson.getBytes(StandardCharsets.UTF_8),
                StandardCharsets.UTF_8
        );

        SharedServiceLayerException result = HttpClientErrorExceptionParser.httpClientErrorExceptionParser(ex);

        assertTrue(result.getMessage().startsWith("Failed to parse error response:"));
    }
}
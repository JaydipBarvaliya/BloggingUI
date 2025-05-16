import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

public class BesigopsapiUtilTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void requestBodyNullCheckTest() throws SharedServiceLayerException {
        thrown.expect(SharedServiceLayerException.class);
        thrown.expectMessage("Request body is required to delete the data");

        BesigopsapiUtil.requestBodyNullCheck(null);
    }
}
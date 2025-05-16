import org.junit.Test;

public class BesigopsapiUtilTest {

    @Test
    public void requestBodyNullCheck_ShouldPass_WhenObjectIsNotNull() throws SharedServiceLayerException {
        // Pass any non-null object
        Object validObj = new Object();

        // This should not throw any exception
        BesigopsapiUtil.requestBodyNullCheck(validObj);
    }
}
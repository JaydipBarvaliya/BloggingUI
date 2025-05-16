public class ValidationUtil {

    public static void validateNotNull(Object obj, String errorMessage) {
        if (obj == null) {
            log.error(errorMessage); // Add your logger or remove this if not required here
            throw new SharedServiceLayerException(
                BesigopsapiUtil.buildBadRequestStatus(), errorMessage, null
            );
        }
    }
}
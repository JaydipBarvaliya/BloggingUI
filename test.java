/**
 * Represents the request structure required to reject attachments in OneSpan.
 * 
 * <p>This class is used to transform the incoming attachment rejection request 
 * (typically received from Postman or client APIs) into the format that is 
 * accepted by the OneSpan API when rejecting required attachments for a signer.</p>
 * 
 * <p>The structure includes a list of {@link AttachmentRequirements}, each containing 
 * relevant metadata (comment, status, ID, name, etc.) required for rejection.</p>
 */
@Data
public class RejectAttachment {
    private List<AttachmentRequirements> attachmentRequirements;

    /**
     * Represents a single attachment's rejection metadata as required by the OneSpan API.
     */
    @Data
    public static class AttachmentRequirements {
        private String comment;
        private String description;
        private String status;
        private String id;
        private String name;
    }
}
import java.util.List;

public class OneSpanRequestWrapper {

    private List<OneSpanAttachmentRequest> attachmentRequirements;

    public List<OneSpanAttachmentRequest> getAttachmentRequirements() {
        return attachmentRequirements;
    }

    public void setAttachmentRequirements(List<OneSpanAttachmentRequest> attachmentRequirements) {
        this.attachmentRequirements = attachmentRequirements;
    }

    // 🔽 Inner class
    public static class OneSpanAttachmentRequest {
        private String comment;
        private String description;
        private String status;
        private String id;
        private String name;

        // Getters and Setters
        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
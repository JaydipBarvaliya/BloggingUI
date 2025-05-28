import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class RejectAttachmentMapper {

    public RejectAttachment toInternal(RejectAttachmentRequest request) {
        List<RejectAttachment.OneSpanAttachmentRequest> mappedList = request.getAttachmentRequirements().stream()
            .map(req -> {
                RejectAttachment.OneSpanAttachmentRequest inner = new RejectAttachment.OneSpanAttachmentRequest();
                inner.setComment(req.getCommentTxt());
                inner.setDescription(req.getAttachmentDesc());
                inner.setStatus("REJECTED");
                inner.setId(req.getAttachmentId());
                inner.setName(req.getAttachmentName());
                return inner;
            }).collect(Collectors.toList());

        RejectAttachment result = new RejectAttachment();
        result.setAttachmentRequirements(mappedList);
        return result;
    }
}
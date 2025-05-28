import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring")
public interface RejectAttachmentMapper {

    @Mapping(target = "attachmentRequirements", source = "attachmentRequirements")
    RejectAttachment toInternal(RejectAttachmentRequest request);

    @Mapping(target = "comment", source = "commentTxt")
    @Mapping(target = "description", source = "attachmentDesc")
    @Mapping(target = "status", constant = "REJECTED")
    @Mapping(target = "id", source = "attachmentId")
    @Mapping(target = "name", source = "attachmentName")
    RejectAttachment.OneSpanAttachmentRequest map(RejectAttachmentRequest.AttachmentRequirementsInner inner);
}



@Mapping(target = "comment", source = "commentTxt")
@Mapping(target = "description", source = "attachmentDesc")
@Mapping(target = "status", constant = "REJECTED")
@Mapping(target = "id", source = "attachmentId")
@Mapping(target = "name", source = "attachmentName")
RejectAttachment.OneSpanAttachmentRequest map(
    RejectAttachmentRequestAttachmentRequirementsInner inner
);

package com.td.esig.api.delegate;

import com.td.esig.api.model.RejectAttachmentRequest;
import com.td.esig.api.service.PackageService;
import com.td.esig.api.util.PackageManagerUtil;
import com.td.esig.common.util.HeaderInfo;
import com.td.esig.common.util.SharedServiceLayerException;
import com.td.esig.common.util.Status;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EsignatureeventsApiDelegateImplTest {

    @Mock
    private PackageService packageService;

    @Mock
    private PackageManagerUtil packageManagerUtil;

    @Spy
    @InjectMocks
    private EsignatureeventsApiDelegateImpl delegateSpy;

    @Test
    void testRejectAttachment_throwsSharedServiceLayerException() throws Exception {
        // --- arrange ---
        String eventId         = "event123";
        String partyKey        = "partyKey123";
        RejectAttachmentRequest req = new RejectAttachmentRequest();
        String lobId           = "lob123";
        String messageID       = "message123";
        String traceabilityID  = "trace123";

        HttpHeaders httpHeaders = new HttpHeaders();
        HeaderInfo headerInfo   = new HeaderInfo();

        // stub out buildHeaders(...) to return our fake headers
        doReturn(httpHeaders)
          .when(delegateSpy)
          .buildHeaders(lobId, messageID, traceabilityID);

        // stub util to turn those headers into a HeaderInfo and back to the lobId
        when(packageManagerUtil.getUpdatedHeadersInfo(httpHeaders))
          .thenReturn(headerInfo);
        when(packageManagerUtil.getLobFromHeader(httpHeaders))
          .thenReturn(lobId);

        // stub the service to throw our SharedServiceLayerException
        SharedServiceLayerException toThrow =
          new SharedServiceLayerException(new Status(), "Error occurred");
        doThrow(toThrow)
          .when(packageService)
          .rejectAttachment(headerInfo, eventId, partyKey, req, lobId);

        // --- act & assert ---
        SharedServiceLayerException ex = assertThrows(
          SharedServiceLayerException.class,
          () -> delegateSpy.rejectAttachment(
                eventId, partyKey, req, lobId, messageID, traceabilityID)
        );
        assertEquals("Error occurred", ex.getMessage());
    }
}
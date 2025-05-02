package com.td.esig.api.delegate;

import com.td.esig.api.openapi.api.EsignatureeventsApiDelegate;
import com.td.esig.api.openapi.model.UpdateSignerRequest;
import com.td.esig.common.util.SharedServiceLayerException;
import com.td.esig.manager.PackageManagerUtil;
import com.td.esig.model.HeaderInfo;
import com.td.esig.service.PackageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class EsignatureeventsApiDelegateImplTest {

    @Mock
    private PackageService packageService;

    @Mock
    private PackageManagerUtil packageManagerUtil;

    @Mock
    private UpdateSignerRequest updateSignerRequest;

    @Mock
    private HeaderInfo headerInfo;

    @InjectMocks
    private EsignatureeventsApiDelegateImpl apiDelegate;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUpdateSigner_success() throws Exception {
        String eventId = "event123";
        String partyId = "john@email.com";
        String lobId = "dna";
        String messageId = "MSG123";
        String traceId = "TRC456";
        HttpHeaders headers = new HttpHeaders();

        when(packageManagerUtil.buildHeaders(lobId, messageId, traceId)).thenReturn(headers);
        when(packageManagerUtil.getLobFromHeader(headers)).thenReturn(lobId);

        ResponseEntity<Void> response = apiDelegate.updateSigner(eventId, partyId, updateSignerRequest, lobId, messageId, traceId);

        assertEquals(200, response.getStatusCodeValue());
        verify(packageService).updateSigner(any(), eq(eventId), eq(partyId), eq(updateSignerRequest), eq(lobId));
    }

    @Test
    void testUpdateSigner_throwsSharedServiceLayerException() throws Exception {
        String eventId = "event123";
        String partyId = "john@email.com";
        String lobId = "dna";
        String messageId = "MSG123";
        String traceId = "TRC456";
        HttpHeaders headers = new HttpHeaders();

        when(packageManagerUtil.buildHeaders(lobId, messageId, traceId)).thenReturn(headers);
        when(packageManagerUtil.getLobFromHeader(headers)).thenReturn(lobId);

        doThrow(new SharedServiceLayerException("mock exception")).when(packageService)
                .updateSigner(any(), eq(eventId), eq(partyId), eq(updateSignerRequest), eq(lobId));

        SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
                apiDelegate.updateSigner(eventId, partyId, updateSignerRequest, lobId, messageId, traceId));

        assertEquals("mock exception", ex.getMessage());
    }
}
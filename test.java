import com.td.esig.api.mapper.HeaderInfoMapper;
import com.td.esig.api.util.CommonUtil;
import com.td.esig.common.util.*;
import com.td.esig.dal.model.PerformanceStats;
import com.td.esig.dal.service.CommonDAL;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommonUtilTest {

    @Mock
    private CommonDAL commonDAL;

    @Mock
    private HeaderInfoMapper headerInfoMapper;

    @InjectMocks
    private CommonUtil commonUtil;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // manually inject appId (since @Value doesn't work in plain unit tests)
        commonUtil = new CommonUtil(commonDAL, headerInfoMapper);
        TestUtils.setField(commonUtil, "appId", "test-app");
    }

    @Test
    void testBuildBadRequestException() {
        SharedServiceLayerException exception = CommonUtil.buildBadRequestException("Invalid input");
        assertNotNull(exception);
        assertEquals(HttpStatus.BAD_REQUEST.value(), exception.getStatus().getCode());
        assertEquals("Invalid input", exception.getMessage());
    }

    @Test
    void testPopulateAndPersistStats() throws SharedServiceLayerException {
        HeaderInfo headerInfo = new HeaderInfo();
        ResponseEntity<String> response = new ResponseEntity<>("OK", HttpStatus.OK);

        doNothing().when(headerInfoMapper).populateHeaderInfo(any(), any(), any());
        doNothing().when(commonDAL).execute(any(), any());

        commonUtil.populateAndPersistStats(headerInfo, response, "SHORT");

        verify(headerInfoMapper).populateHeaderInfo(headerInfo, response, "SHORT");
        verify(commonDAL).execute(eq(CommonDAL.Actions.ADD_PERF_STATS), any(PerformanceStats.class));
        assertEquals(response, headerInfo.getApiResponseCode());
        assertTrue(headerInfo.getRequestEndTime() > 0);
    }

    @Test
    void testCreateHeaderInfo() {
        HttpHeaders headers = new HttpHeaders();
        String eventId = "event-123";
        TransactionType type = TransactionType.DELETE_DOCUMENT;

        HeaderInfo headerInfo = TestUtils.callPrivateMethod(commonUtil, "createHeaderInfo", headers, eventId, type);

        assertNotNull(headerInfo);
        assertEquals("test-app", headerInfo.getAppId());
        assertEquals("Delete Document", headerInfo.getTransactionType());
        assertEquals(eventId, headerInfo.getEventId());
        assertEquals(headers, headerInfo.getHttpHeaders());
        assertTrue(headerInfo.getApiRequestStartTime() > 0);
    }
}
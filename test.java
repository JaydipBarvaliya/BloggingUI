package com.td.esig.api.util;

import com.td.esig.api.openapi.model.*;
import com.td.esig.common.util.CommonConstants;
import com.td.esig.common.util.SharedServiceLayerException;
import com.td.esig.dal.service.ConfigurationProperties;
import com.td.esig.model.auth.Auth;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ValidateAuthTypeUtil_RareCasesTest {

    private ConfigurationProperties config;
    private ValidateAuthTypeUtil validateAuthTypeUtil;

    @BeforeEach
    void setup() {
        config = mock(ConfigurationProperties.class);
        validateAuthTypeUtil = new ValidateAuthTypeUtil(config);
    }

    private UpdateSignerRequest buildRequest(UpdateSignerRequestSignerInnerAuthentication.AuthenticationMethodTypeCdEnum authType, String phone) {
        UpdateSignerRequestSignerInner signer = new UpdateSignerRequestSignerInner();
        signer.setTelephoneNum(phone);
        UpdateSignerRequestSignerInnerAuthentication auth = new UpdateSignerRequestSignerInnerAuthentication();
        auth.setAuthenticationMethodTypeCd(authType);
        signer.setAuthentication(auth);
        UpdateSignerRequest request = new UpdateSignerRequest();
        request.setSigner(List.of(signer));
        return request;
    }

    @Test
    void testQAAuth_configValueBlank_shouldTriggerDefaultFalseLogic() {
        UpdateSignerRequest request = buildRequest(
            UpdateSignerRequestSignerInnerAuthentication.AuthenticationMethodTypeCdEnum.AUTH_CHALLENGE_UPP,
            "1234567890"
        );

        when(config.getConfigProperty("lob", CommonConstants.AUTH_QA)).thenReturn("");
        // This triggers: StringUtils.isBlank(isQAenabled)

        SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
            validateAuthTypeUtil.validateAuthType(request, "lob")
        );

        assertEquals("QA authentication is not configured for lob", ex.getMessage());
    }

    @Test
    void testQAAuth_configValueNotBlankButQAStillFalse_shouldThrow() {
        UpdateSignerRequest request = buildRequest(
            UpdateSignerRequestSignerInnerAuthentication.AuthenticationMethodTypeCdEnum.AUTH_CHALLENGE_UPP,
            "1234567890"
        );

        when(config.getConfigProperty("lob", CommonConstants.AUTH_QA)).thenReturn("false");
        // isQAenabled = "false" (from non-blank propValue)
        // This covers: if (!FALSE.equals(isQAenabled))

        SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
            validateAuthTypeUtil.validateAuthType(request, "lob")
        );

        assertEquals("QA authentication is not configured for lob", ex.getMessage());
    }
}
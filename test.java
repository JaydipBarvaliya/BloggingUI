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

class ValidateAuthTypeUtilTest {

    private ConfigurationProperties config;
    private ValidateAuthTypeUtil validateAuthTypeUtil;

    @BeforeEach
    void setup() {
        config = mock(ConfigurationProperties.class);
        validateAuthTypeUtil = new ValidateAuthTypeUtil(config);
    }

    @Test
    void testEmptySignerList_throwsException() {
        UpdateSignerRequest request = new UpdateSignerRequest();
        request.setSigner(List.of());
        SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
                validateAuthTypeUtil.validateAuthType(request, "lob")
        );
        assertEquals("Signer is mandatory", ex.getMessage());
    }

    @Test
    void testSMSAuthentication_withPhoneNumber() throws SharedServiceLayerException {
        UpdateSignerRequest request = buildRequest(CommonConstants.AUTH_SMS_UPP, "1234567890");
        Auth auth = validateAuthTypeUtil.validateAuthType(request, "lob");
        assertEquals("SMS", auth.getScheme().name());
    }

    @Test
    void testSMSAuthentication_missingPhoneNumber_throwsException() {
        UpdateSignerRequest request = buildRequest(CommonConstants.AUTH_SMS_UPP, null);
        SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
                validateAuthTypeUtil.validateAuthType(request, "lob")
        );
        assertEquals("Telephone number is mandatory for SMS authentication", ex.getMessage());
    }

    @Test
    void testEmailAuthentication_disabledInConfig_throwsException() {
        UpdateSignerRequest request = buildRequest(CommonConstants.AUTH_EMAIL_UPP, "1234567890");
        when(config.getConfigProperty("lob", CommonConstants.AUTH_EMAIL)).thenReturn("false");

        SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
                validateAuthTypeUtil.validateAuthType(request, "lob")
        );
        assertEquals("Email authentication is not configured for lob", ex.getMessage());
    }

    @Test
    void testChallengeQA_disabled_throwsException() {
        UpdateSignerRequest request = buildRequest(CommonConstants.AUTH_CHALLENGE_UPP, "1234567890");
        when(config.getConfigProperty("lob", CommonConstants.AUTH_QA)).thenReturn("false");

        SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
                validateAuthTypeUtil.validateAuthType(request, "lob")
        );
        assertEquals("QA authentication is not configured for lob", ex.getMessage());
    }

    @Test
    void testChallengeQA_missingQuestionAnswer_throwsException() {
        UpdateSignerRequest request = buildRequest(CommonConstants.AUTH_CHALLENGE_UPP, "1234567890");
        when(config.getConfigProperty("lob", CommonConstants.AUTH_QA)).thenReturn("true");
        when(config.getConfigProperty("lob", CommonConstants.AUTH_QA_QUESTION)).thenReturn("");
        when(config.getConfigProperty("lob", CommonConstants.AUTH_QA_ANSWER)).thenReturn("");

        SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
                validateAuthTypeUtil.validateAuthType(request, "lob")
        );
        assertEquals("Challenge question/answer is not configured for lob", ex.getMessage());
    }

    @Test
    void testIDVVerification_disabled_throwsException() {
        UpdateSignerRequest request = buildRequest(CommonConstants.ID_VERIFICATION, "1234567890");
        when(config.getConfigProperty("lob", CommonConstants.AUTH_ID_VERIFICATION)).thenReturn("false");

        SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
                validateAuthTypeUtil.validateAuthType(request, "lob")
        );
        assertEquals("ID Verification is not configured for lob", ex.getMessage());
    }

    @Test
    void testDefaultInvalidAuthType_throwsException() {
        UpdateSignerRequest request = buildRequest("INVALID_TYPE", "1234567890");

        SharedServiceLayerException ex = assertThrows(SharedServiceLayerException.class, () ->
                validateAuthTypeUtil.validateAuthType(request, "lob")
        );
        assertEquals("Authentication.authenticationMethodTypeCd is not a valid type", ex.getMessage());
    }

    private UpdateSignerRequest buildRequest(String authType, String phone) {
        UpdateSignerRequestSignerInner signer = new UpdateSignerRequestSignerInner();
        signer.setTelephoneNum(phone);
        UpdateSignerRequestSignerInnerAuthentication auth = new UpdateSignerRequestSignerInnerAuthentication();
        AuthenticationMethodTypeCd method = new AuthenticationMethodTypeCd();
        method.setValue(authType);
        auth.setAuthenticationMethodTypeCd(method);
        signer.setAuthentication(auth);
        UpdateSignerRequest request = new UpdateSignerRequest();
        request.setSigner(List.of(signer));
        return request;
    }
}
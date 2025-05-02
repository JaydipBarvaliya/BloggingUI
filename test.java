package com.td.esig.api.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.td.esig.api.model.OneSpanSignerInfoUpdateRequest;
import com.td.esig.api.openapi.model.UpdateSignerRequestSignerInner;
import com.td.esig.model.auth.Auth;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UpdateSignerInfoMapperTest {

    private UpdateSignerInfoMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new UpdateSignerInfoMapper();
        mapper.initMapper(); // manually call PostConstruct method
    }

    @Test
    void testMapToOneSpan() {
        UpdateSignerRequestSignerInner input = new UpdateSignerRequestSignerInner();
        input.setEmailAddressTxt("test@example.com");
        input.setFirstName("John");
        input.setLastName("Doe");
        input.setTelephoneNum("1234567890");
        input.setJobTitle("Developer");
        input.setOrganizationName("Tech Corp");

        String roleId = "role123";
        Auth auth = new Auth(); // Assuming no-arg constructor

        OneSpanSignerInfoUpdateRequest result = mapper.mapToOneSpan(input, roleId, auth);

        assertEquals("SIGNER", result.getType());
        assertEquals(roleId, result.getName());
        assertNotNull(result.getSigners());
        assertEquals(1, result.getSigners().size());

        OneSpanSignerInfoUpdateRequest.Signer signer = result.getSigners().get(0);
        assertEquals("test@example.com", signer.getEmail());
        assertEquals("John", signer.getFirstName());
        assertEquals("Doe", signer.getLastName());
        assertEquals("1234567890", signer.getPhone());
        assertEquals("Developer", signer.getTitle());
        assertEquals("Tech Corp", signer.getCompany());
        assertEquals(auth, signer.getAuth());
        assertEquals(roleId, signer.getId());
    }

    @Test
    void testSerialize() throws JsonProcessingException {
        OneSpanSignerInfoUpdateRequest payload = new OneSpanSignerInfoUpdateRequest();
        payload.setType("SIGNER");
        payload.setName("role123");

        OneSpanSignerInfoUpdateRequest.Signer signer = new OneSpanSignerInfoUpdateRequest.Signer();
        signer.setEmail("test@example.com");
        payload.setSigners(List.of(signer));

        String json = mapper.serialize(payload);
        assertTrue(json.contains("SIGNER"));
        assertTrue(json.contains("test@example.com"));
        assertTrue(json.contains("role123"));
    }
}
package com.td.esig.api.DTO;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import com.td.esig.api.openapi.model.UpdateSignerRequestSignerInner;
import com.td.esig.model.auth.Auth;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class UpdateSignerInfoMapper {

    private ObjectMapper mapper;

    @PostConstruct
    public void initMapper() {
        mapper = new ObjectMapper();
        SimpleFilterProvider filters = new SimpleFilterProvider()
                .addFilter("DirtyFieldsFilter", SimpleBeanPropertyFilter.serializeAll());
        mapper.setFilterProvider(filters);
    }

    public OneSpanSignerRequest mapToOneSpan(UpdateSignerRequestSignerInner input, String roleId, Auth auth) {
        OneSpanSignerRequest.Signer signer = new OneSpanSignerRequest.Signer();

        signer.setId(roleId);
        signer.setEmail(input.getEmailAddressTxt());
        signer.setFirstName(input.getFirstName());
        signer.setLastName(input.getLastName());
        signer.setPhone(input.getTelephoneNum());
        signer.setTitle(input.getJobTitle());
        signer.setCompany(input.getOrganizationName());
        signer.setAuth(auth);

        OneSpanSignerRequest oneSpanPayload = new OneSpanSignerRequest();
        oneSpanPayload.setType("SIGNER");
        oneSpanPayload.setName(roleId);
        oneSpanPayload.setSigners(Collections.singletonList(signer));

        return oneSpanPayload;
    }

    public String serializeWithDirtyFieldsFilter(OneSpanSignerRequest payload) throws JsonProcessingException {
        return mapper.writeValueAsString(payload);
    }
}
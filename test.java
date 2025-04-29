import lombok.Data;

@Data
public class SignerRequest {
    private String jobTitle;
    private String lastName;
    private String firstName;
    private String emailAddressTxt;
    private String telephoneNum;
    private String organizationName;
    private Authentication authentication;

    @Data
    public static class Authentication {
        private String authenticationMethodTypeCd;
    }
}






import lombok.Data;
import java.util.List;

@Data
public class OneSpanSignerRequest {
    private String type;
    private List<Signer> signers;
    private String name;

    @Data
    public static class Signer {
        private String id;
        private String email;
        private String firstName;
        private String lastName;
        private String phone;
        private String title;
        private String company;
        private Auth auth;
    }

    @Data
    public static class Auth {
        private String scheme;
    }
}




import java.util.Collections;

public class SignerMapper {

    public static OneSpanSignerRequest mapToOneSpan(SignerRequest input) {
        OneSpanSignerRequest.Signer signer = new OneSpanSignerRequest.Signer();
        signer.setId("signer1");
        signer.setEmail(input.getEmailAddressTxt());
        signer.setFirstName(input.getFirstName());
        signer.setLastName(input.getLastName());
        signer.setPhone(input.getTelephoneNum());
        signer.setTitle(input.getJobTitle());
        signer.setCompany(input.getOrganizationName());

        OneSpanSignerRequest.Auth auth = new OneSpanSignerRequest.Auth();
        auth.setScheme(mapScheme(input.getAuthentication().getAuthenticationMethodTypeCd()));
        signer.setAuth(auth);

        OneSpanSignerRequest request = new OneSpanSignerRequest();
        request.setType("SIGNER");
        request.setSigners(Collections.singletonList(signer));
        request.setName("signer1");

        return request;
    }

    private static String mapScheme(String methodCode) {
        if (methodCode == null) return "NONE";
        switch (methodCode.toUpperCase()) {
            case "SMS": return "SMS";
            case "EMAIL": return "EMAIL";
            default: return "NONE";
        }
    }
}




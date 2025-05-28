/**
 * Initializes the local ObjectMapper with custom serialization settings.
 * <p>
 * This method configures the ObjectMapper to:
 * <ul>
 *   <li>Exclude all fields with {@code null} values during serialization</li>
 *   <li>Ignore unknown filter IDs when applying filter providers</li>
 * </ul>
 * It is executed automatically by the Spring container after dependency injection
 * using the {@code @PostConstruct} lifecycle hook.
 * 
 * <p><strong>Note:</strong> Do not invoke this method manually. It is tied to the 
 * bean lifecycle and must only be triggered by Spring.
 */
@PostConstruct
public void initMapper() {
    ...
}
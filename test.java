public static boolean isSafePathComponent(String input) {
    return input != null 
        && input.matches("^[\\w.-]+$")     // alphanumeric, underscore, dash, dot
        && !input.contains("..")           // prevent directory traversal
        && !input.contains("/") 
        && !input.contains("\\");
}
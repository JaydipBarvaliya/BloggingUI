public static boolean isSafePathComponent(String input) {
    return input != null 
        && input.matches("^[\\w.-]+$")   // allow alphanumeric, underscore, dash, dot
        && !input.contains("..")         // block directory traversal
        && !input.startsWith("/")        // block absolute paths (Unix)
        && !input.contains("\\");        // block backslash (Windows)
}
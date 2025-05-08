if (!isSafePathComponent(baseFolder) || !isSafePathComponent(subFolder)) {
    throw new IllegalArgumentException("Invalid folder name.");
}



public static boolean isSafePathComponent(String input) {
    return input != null && input.matches("^[\\w\\-]+$"); // only letters, numbers, underscore, dash
}
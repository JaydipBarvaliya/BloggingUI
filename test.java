if (!isSafePathComponent(packageId)) {
    throw new IllegalArgumentException("Invalid package ID.");
}

Path imagePath = Paths.get(path, packageId + ".png").normalize();
File f = imagePath.toFile();



public static boolean isSafePathComponent(String input) {
    return input != null 
        && input.matches("^[\\w.-]+$")     // alphanumeric, underscore, dash, dot
        && !input.contains("..")           // prevent directory traversal
        && !input.contains("/") 
        && !input.contains("\\");
}
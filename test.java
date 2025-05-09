package com.td.esig.api.util;

import com.oss.signatureimport.SignatureCaptureValueConverter;
import com.td.esig.common.util.LogSanitizeUtil;
import com.td.esig.common.util.Severity;
import com.td.esig.common.util.SharedServiceLayerException;
import com.td.esig.common.util.Status;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.XSlf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.http.HttpStatus;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Base64;

@XSlf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class SignatureTransformUtil {

    /**
     * Safely create nested directories under baseFolder/subFolder.
     */
    public static String createDirectories(String baseFolder, String... subFolder) {
        log.info("createDirectories");

        // 1) Validate each component
        if (isUnsafePathComponent(baseFolder)
         || Arrays.stream(subFolder).anyMatch(SignatureTransformUtil::isUnsafePathComponent)) {
            throw new IllegalArgumentException("Invalid folder name.");
        }

        // 2) Build & normalize full path in one go
        Path safeBase = Paths.get(baseFolder).normalize();
        Path fullPath = Paths.get(baseFolder, subFolder).normalize();

        // 3) Containment check
        if (!fullPath.startsWith(safeBase)) {
            throw new IllegalArgumentException("Unsafe folder path traversal");
        }

        // 4) Create directories
        try {
            fullPath = Files.createDirectories(fullPath);
        } catch (IOException e) {
            log.error("Failed to create directory: {}", fullPath, e);
        }

        return fullPath.toString();
    }

    /**
     * Decode a Base64 PNG and write it to disk under directoryPath/packageId.png.
     */
    public static void decodeToImage(String imageString,
                                     String directoryPath,
                                     String packageId)
            throws SharedServiceLayerException {

        log.debug("decodeToImage");

        // 1) Validate packageId
        if (isUnsafePathComponent(packageId)) {
            throw new IllegalArgumentException("Invalid package ID.");
        }

        // 2) Ensure directory exists
        String targetDir = createDirectories(directoryPath, packageId);

        // 3) Build & normalize image path
        Path safeBase = Paths.get(targetDir).normalize();
        Path imagePath = safeBase.resolve(packageId + ".png").normalize();
        if (!imagePath.startsWith(safeBase)) {
            throw new IllegalArgumentException("Path traversal detected");
        }

        // 4) Decode and write
        try (ByteArrayInputStream bais =
                 new ByteArrayInputStream(Base64.getDecoder().decode(imageString))) {

            BufferedImage image = ImageIO.read(bais);
            if (image != null) {
                ImageIO.write(image, "png", imagePath.toFile());
            }
        } catch (Exception e) {
            log.error("Failed to decode image for packageId: {}, error: {}",
                      LogSanitizeUtil.sanitizeLogObj(packageId),
                      LogSanitizeUtil.sanitizeLogObj(e.getMessage()));
            throw new SharedServiceLayerException(
                new Status(HttpStatus.BAD_REQUEST.value(), Severity.Error),
                "Failed to decode signature image"
            );
        }
    }

    /**
     * Extract signature text from an existing PNG at directoryPath/packageId.png.
     */
    public static String extractFromImage(String directoryPath, String packageId) {
        log.debug("extractFromImage method");

        // 1) Validate
        if (isUnsafePathComponent(packageId)) {
            throw new IllegalArgumentException("Invalid package ID.");
        }

        // 2) Build & normalize path
        Path safeBase = Paths.get(directoryPath).normalize();
        Path imagePath = safeBase.resolve(packageId + ".png").normalize();
        if (!imagePath.startsWith(safeBase)) {
            throw new IllegalArgumentException("Path traversal detected");
        }

        // 3) Convert if exists
        try {
            if (Files.exists(imagePath)) {
                SignatureCaptureValueConverter converter = new SignatureCaptureValueConverter();
                return converter.convertImage(imagePath.toString(), 140);
            }
        } catch (IOException e) {
            log.info("Failed to extract from signature for: {}",
                     LogSanitizeUtil.sanitizeLogObj(packageId));
        }

        return null;
    }

    /**
     * Delete the directory at directoryPath/packageId safely.
     */
    public static void deleteDirectory(String directoryPath, String packageId) {
        // 1) Validate
        if (isUnsafePathComponent(packageId)) {
            throw new IllegalArgumentException("Invalid package ID.");
        }

        // 2) Build & normalize delete path
        Path safeBase = Paths.get(directoryPath).normalize();
        Path deletePath = safeBase.resolve(packageId).normalize();
        if (!deletePath.startsWith(safeBase)) {
            throw new IllegalArgumentException("Path traversal detected");
        }

        // 3) Delete
        try {
            FileUtils.forceDelete(deletePath.toFile());
        } catch (IOException e) {
            log.info("Failed to delete folder for: {}",
                     LogSanitizeUtil.sanitizeLogObj(packageId));
        }
    }

    /**
     * Rejects anything null, containing '..', slashes or backslashes, or invalid chars.
     */
    public static boolean isUnsafePathComponent(String input) {
        return input == null
            || !input.matches("^[\\w.-]+$")  // letters, digits, underscore, dash, dot
            || input.contains("..")          // no directory traversal
            || input.startsWith("/")         // no absolute Unix paths
            || input.contains("\\");         // no Windows backslashes
    }
}
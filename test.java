package com.td.esig.common.util;

import com.td.esig.common.util.CommonUtil;
import com.td.esig.common.util.SharedServiceLayerException;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

import static org.junit.jupiter.api.Assertions.*;

public class CommonUtilTest {

    @Test
    void testBuildBadRequestException() {
        String message = "Invalid input";
        SharedServiceLayerException exception = CommonUtil.buildBadRequestException(message);

        assertNotNull(exception);
        assertEquals("Invalid input", exception.getMessage());
    }

    @Test
    void testPrivateConstructor() throws Exception {
        Constructor<CommonUtil> constructor = CommonUtil.class.getDeclaredConstructor();
        constructor.setAccessible(true);

        UnsupportedOperationException thrown = assertThrows(
            InvocationTargetException.class,
            () -> constructor.newInstance()
        );

        assertTrue(thrown.getCause() instanceof UnsupportedOperationException);
        assertEquals("Utility class", thrown.getCause().getMessage());
    }
}
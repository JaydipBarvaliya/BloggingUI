@Test
void testPrivateConstructor() throws Exception {
    Constructor<CommonUtil> constructor = CommonUtil.class.getDeclaredConstructor();
    constructor.setAccessible(true);

    InvocationTargetException thrown = assertThrows(
        InvocationTargetException.class,
        constructor::newInstance
    );

    // Now validate the actual cause inside the InvocationTargetException
    Throwable cause = thrown.getCause();
    assertInstanceOf(UnsupportedOperationException.class, cause);
    assertEquals("Utility class", cause.getMessage());
}
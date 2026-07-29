package com.propertyrisk;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Smoke test verifying the Spring application context loads successfully
 * with all agents, services, and controllers wired correctly.
 */
@SpringBootTest
class PropertyRiskApplicationTests {

    @Test
    void contextLoads() {
        // Intentionally empty: a failure to load the context fails this test.
    }
}

package com.propertyrisk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Property Risk Intelligence System backend.
 *
 * <p>This application exposes REST endpoints that aggregate weather, flood,
 * and air-quality signals through a set of coordinating "agents" to produce
 * an overall property risk assessment.</p>
 */
@SpringBootApplication
public class PropertyRiskApplication {

    public static void main(String[] args) {
        SpringApplication.run(PropertyRiskApplication.class, args);
    }
}

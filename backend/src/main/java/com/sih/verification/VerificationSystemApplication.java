package com.sih.verification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VerificationSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(VerificationSystemApplication.class, args);
        System.out.println("===================================================================");
        System.out.println(" SIH26036 - Online Instrument Verification System Backend Running");
        System.out.println(" REST API Base URL: http://localhost:8080");
        System.out.println(" H2 Console (if using H2): http://localhost:8080/h2-console");
        System.out.println("===================================================================");
    }
}

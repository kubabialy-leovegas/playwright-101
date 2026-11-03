package com.example.demoshop.e2e.config

import org.springframework.boot.context.properties.ConfigurationProperties

/** Values from application.yml (prefix "e2e"); override with e.g. -De2e.base-url=http://localhost:9090 */
@ConfigurationProperties("e2e")
data class E2eProperties(
    val baseUrl: String,
)

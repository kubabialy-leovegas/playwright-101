package com.example.demoshop.backend

import org.springframework.boot.context.properties.ConfigurationProperties
import java.time.Duration

@ConfigurationProperties("shop")
data class ShopProperties(
    val paymentDelay: Duration = Duration.ofMillis(1500),
)

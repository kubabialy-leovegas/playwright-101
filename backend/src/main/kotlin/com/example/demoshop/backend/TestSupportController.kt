package com.example.demoshop.backend

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController

/**
 * Test-only endpoints, like a mock proxy rule in a real test environment:
 * the test decides how the fake payment provider answers for ITS session.
 * A real service would only enable this in test profiles.
 */
@RestController
class TestSupportController(private val sessions: SessionStore, private val properties: ShopProperties) {

    @PutMapping("/api/test/payment-provider")
    fun configurePaymentProvider(
        @RequestHeader(HttpHeaders.AUTHORIZATION, required = false) authorization: String?,
        @RequestBody request: PaymentProviderRequest,
    ): PaymentProviderConfig {
        val session = sessions.require(authorization)
        val result = PaymentResult.entries.find { it.name == request.result }
            ?: throw ApiException(HttpStatus.BAD_REQUEST, "result must be APPROVE or DECLINE")
        session.paymentProvider = PaymentProviderConfig(result, request.delayMs ?: properties.paymentDelay.toMillis())
        return session.paymentProvider
    }
}

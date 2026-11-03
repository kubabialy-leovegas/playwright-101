package com.example.demoshop.backend

import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import java.util.Collections
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

/**
 * A logged-in session. The cart belongs to the session, not to the user,
 * so tests running in parallel with the same account never see each other's carts.
 */
class Session(
    val email: String,
    @Volatile var paymentProvider: PaymentProviderConfig,
) {
    /** productId -> quantity, in the order products were added */
    val cart: MutableMap<Int, Int> = Collections.synchronizedMap(LinkedHashMap())
}

@Component
class SessionStore(private val properties: ShopProperties) {
    private val sessions = ConcurrentHashMap<String, Session>()

    fun create(email: String): String {
        val token = UUID.randomUUID().toString()
        sessions[token] = Session(email, PaymentProviderConfig(PaymentResult.APPROVE, properties.paymentDelay.toMillis()))
        return token
    }

    /** Resolves "Authorization: Bearer <token>" or answers 401. */
    fun require(authorization: String?): Session =
        sessions[token(authorization)] ?: throw ApiException(HttpStatus.UNAUTHORIZED, "Not logged in")

    fun remove(authorization: String?) {
        sessions.remove(token(authorization))
    }

    private fun token(authorization: String?) = authorization.orEmpty().removePrefix("Bearer ")
}

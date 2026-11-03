package com.example.demoshop.e2e.service

import com.example.demoshop.e2e.config.E2eProperties
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.NullNode
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient

/**
 * Raw HTTP response. Unlike a typical client it never throws on 4xx/5xx,
 * because negative scenarios need to assert on the status and error message.
 */
data class ApiResponse(val status: Int, val body: JsonNode, val mapper: ObjectMapper) {
    val error: String get() = body.path("error").asText()

    /** For Given steps: setup must succeed, otherwise the scenario is invalid. */
    fun expectSuccess(): ApiResponse = apply {
        check(status in 200..299) { "Expected 2xx but got $status: $body" }
    }

    inline fun <reified T> bodyAs(): T = mapper.treeToValue(body, T::class.java)
}

/** Client for the Demo Shop backend (server.js). One method per endpoint. */
@Component
class ShopApiClient(
    properties: E2eProperties,
    restClientBuilder: RestClient.Builder,
    private val objectMapper: ObjectMapper,
) {
    private val restClient = restClientBuilder.baseUrl(properties.baseUrl).build()

    fun health() = call(HttpMethod.GET, "/api/health")

    fun getProducts() = call(HttpMethod.GET, "/api/products")

    fun login(email: String, password: String) =
        call(HttpMethod.POST, "/api/login", body = mapOf("email" to email, "password" to password))

    fun logout(token: String) = call(HttpMethod.POST, "/api/logout", token)

    fun me(token: String) = call(HttpMethod.GET, "/api/me", token)

    fun getCart(token: String) = call(HttpMethod.GET, "/api/cart", token)

    fun addToCart(token: String, productId: Int, quantity: Int = 1) =
        call(HttpMethod.POST, "/api/cart", token, mapOf("productId" to productId, "quantity" to quantity))

    fun removeFromCart(token: String, productId: Int) = call(HttpMethod.DELETE, "/api/cart/$productId", token)

    fun clearCart(token: String) = call(HttpMethod.DELETE, "/api/cart", token)

    fun placeOrder(token: String) = call(HttpMethod.POST, "/api/orders", token)

    fun getOrder(token: String, orderId: Int) = call(HttpMethod.GET, "/api/orders/$orderId", token)

    fun sendContactRequest(request: Map<String, Any?>) = call(HttpMethod.POST, "/api/contact", body = request)

    fun configurePaymentProvider(token: String, result: String, delayMs: Long? = null) =
        call(HttpMethod.PUT, "/api/test/payment-provider", token, mapOf("result" to result, "delayMs" to delayMs).filterValues { it != null })

    private fun call(method: HttpMethod, path: String, token: String? = null, body: Any? = null): ApiResponse {
        val request = restClient.method(method).uri(path)
        token?.let { request.header(HttpHeaders.AUTHORIZATION, "Bearer $it") }
        body?.let { request.contentType(MediaType.APPLICATION_JSON).body(it) }
        return request.exchange<ApiResponse> { _, response ->
            val bytes = response.body.readAllBytes()
            val json = if (bytes.isEmpty()) NullNode.instance else objectMapper.readTree(bytes)
            ApiResponse(response.statusCode.value(), json, objectMapper)
        }!!
    }
}

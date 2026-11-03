package com.example.demoshop.e2e.config

import com.example.demoshop.e2e.service.ApiResponse

/**
 * Context to share data between steps within single scenario scope.
 */
class ScenarioContext {
    var token: String? = null

    var email: String? = null

    /** The last API response, so a "Then the response status is ..." step can check it. */
    var lastResponse: ApiResponse? = null

    var orderId: Int? = null

    private val cleanupActions: ArrayDeque<Runnable> = ArrayDeque()

    fun requireToken(): String =
        checkNotNull(token) { "No customer is logged in; add 'Given customer is logged in' to the scenario" }

    fun requireLastResponse(): ApiResponse =
        checkNotNull(lastResponse) { "No API call was made in this scenario yet" }

    fun requireOrderId(): Int =
        checkNotNull(orderId) { "No order was placed in this scenario yet" }

    /** Cleanup actions run after the scenario, newest first, even if the scenario failed. */
    fun addCleanupAction(action: Runnable) {
        cleanupActions.addFirst(action)
    }

    fun runCleanupActions() {
        val failures = cleanupActions.mapNotNull { runCatching { it.run() }.exceptionOrNull() }
        cleanupActions.clear()
        if (failures.isNotEmpty()) {
            throw AssertionError("${failures.size} cleanup action(s) failed:\n" + failures.joinToString("\n") { it.toString() })
        }
    }
}

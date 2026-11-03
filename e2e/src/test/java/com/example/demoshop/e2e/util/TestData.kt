package com.example.demoshop.e2e.util

object TestData {
    const val EMAIL = "qa@example.com"
    const val PASSWORD = "password123"

    /** A contact request that passes validation; scenarios override one field at a time. */
    fun validContactRequest(): MutableMap<String, Any?> = mutableMapOf(
        "name" to "Anna Tester",
        "topic" to "payment",
        "via" to "email",
        "message" to "My payment did not go through.",
        "terms" to true,
    )
}

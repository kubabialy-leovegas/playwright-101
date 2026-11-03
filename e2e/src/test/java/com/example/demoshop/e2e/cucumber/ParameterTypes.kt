package com.example.demoshop.e2e.cucumber

import com.example.demoshop.e2e.service.OrderStatus
import io.cucumber.java.ParameterType

/**
 * Custom {placeholders} for step expressions, so steps receive typed values
 * instead of parsing strings themselves.
 */
class ParameterTypes {

    /** "Coffee Mug, Desk Lamp" -> ["Coffee Mug", "Desk Lamp"] */
    @ParameterType("(?:[^,]*)(?:,\\s?[^,]*)*")
    fun listOfStrings(value: String): List<String> {
        return value.split(",\\s?".toPattern())
    }

    @ParameterType("PENDING|CONFIRMED|REJECTED")
    fun orderStatus(value: String): OrderStatus = OrderStatus.valueOf(value)

    /** "approves" / "declines" -> what the fake payment provider should answer */
    @ParameterType("approves|declines")
    fun paymentResult(value: String): String = if (value == "approves") "APPROVE" else "DECLINE"
}

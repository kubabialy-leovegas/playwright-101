package com.example.demoshop.backend

import java.math.BigDecimal

data class Product(val id: Int, val name: String, val category: String, val price: BigDecimal)

data class CartItem(val productId: Int, val name: String, val price: BigDecimal, val quantity: Int)

data class CartView(val items: List<CartItem>, val count: Int, val total: BigDecimal)

enum class OrderStatus { PENDING, CONFIRMED, REJECTED }

/** status and reason change later, when the payment provider answers. */
data class Order(
    val id: Int,
    val email: String,
    val items: List<CartItem>,
    val total: BigDecimal,
    @Volatile var status: OrderStatus = OrderStatus.PENDING,
    @Volatile var reason: String? = null,
)

// Request bodies. Every field is nullable, so a missing field reaches our
// validation and gets a clear message instead of a generic JSON error.

data class LoginRequest(val email: String? = null, val password: String? = null)

data class LoginResponse(val token: String, val email: String)

data class AddToCartRequest(val productId: Int? = null, val quantity: Int? = 1)

/** terms is Any? on purpose: only the JSON boolean true is accepted, not "true". */
data class ContactRequest(
    val name: String? = null,
    val topic: String? = null,
    val via: String? = null,
    val message: String? = null,
    val terms: Any? = null,
)

data class ContactResponse(val ticketId: Int, val name: String, val via: String)

enum class PaymentResult { APPROVE, DECLINE }

data class PaymentProviderConfig(val result: PaymentResult, val delayMs: Long)

data class PaymentProviderRequest(val result: String? = null, val delayMs: Long? = null)

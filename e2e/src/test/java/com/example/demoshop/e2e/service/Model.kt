package com.example.demoshop.e2e.service

import java.math.BigDecimal

data class Product(val id: Int, val name: String, val category: String, val price: BigDecimal)

data class CartItem(val productId: Int, val name: String, val price: BigDecimal, val quantity: Int)

data class Cart(val items: List<CartItem>, val count: Int, val total: BigDecimal)

enum class OrderStatus { PENDING, CONFIRMED, REJECTED }

data class Order(
    val id: Int,
    val status: OrderStatus,
    val items: List<CartItem>,
    val total: BigDecimal,
    val reason: String? = null,
)

package com.example.demoshop.backend

import org.springframework.stereotype.Component

@Component
class Catalog {
    val products = listOf(
        Product(1, "Wireless Mouse", "electronics", "19.99".toBigDecimal()),
        Product(2, "Mechanical Keyboard", "electronics", "89.00".toBigDecimal()),
        Product(3, "Coffee Mug", "home", "7.50".toBigDecimal()),
        Product(4, "Desk Lamp", "home", "24.00".toBigDecimal()),
        Product(5, "Running Shoes", "sports", "64.99".toBigDecimal()),
    )

    fun find(id: Int): Product? = products.find { it.id == id }
}

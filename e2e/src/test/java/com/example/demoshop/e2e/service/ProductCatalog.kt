package com.example.demoshop.e2e.service

import org.springframework.stereotype.Component

/**
 * Lets feature files talk about products by name ("Coffee Mug") instead of ids.
 * Loaded once per test run; the catalogue never changes.
 */
@Component
class ProductCatalog(private val shopApi: ShopApiClient) {

    private val products: List<Product> by lazy {
        shopApi.getProducts().expectSuccess().bodyAs<Array<Product>>().toList()
    }

    fun all(): List<Product> = products

    fun byName(name: String): Product =
        products.find { it.name == name }
            ?: throw IllegalArgumentException("Unknown product '$name'; known: ${products.map { it.name }}")
}

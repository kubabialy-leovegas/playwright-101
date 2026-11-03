package com.example.demoshop.backend

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ProductController(private val catalog: Catalog) {

    @GetMapping("/api/health")
    fun health() = mapOf("status" to "UP")

    @GetMapping("/api/products")
    fun products(): List<Product> = catalog.products
}

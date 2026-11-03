package com.example.demoshop.backend

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/cart")
class CartController(private val sessions: SessionStore, private val cartService: CartService) {

    @GetMapping
    fun get(@RequestHeader(HttpHeaders.AUTHORIZATION, required = false) authorization: String?) =
        cartService.view(sessions.require(authorization))

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun add(
        @RequestHeader(HttpHeaders.AUTHORIZATION, required = false) authorization: String?,
        @RequestBody request: AddToCartRequest,
    ) = cartService.add(sessions.require(authorization), request.productId, request.quantity)

    @DeleteMapping("/{productId}")
    fun remove(
        @RequestHeader(HttpHeaders.AUTHORIZATION, required = false) authorization: String?,
        @PathVariable productId: Int,
    ) = cartService.remove(sessions.require(authorization), productId)

    @DeleteMapping
    fun clear(@RequestHeader(HttpHeaders.AUTHORIZATION, required = false) authorization: String?) =
        cartService.clear(sessions.require(authorization))
}

package com.example.demoshop.backend

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(private val sessions: SessionStore) {

    private val users = mapOf("qa@example.com" to "password123")

    @PostMapping("/api/login")
    fun login(@RequestBody request: LoginRequest): LoginResponse {
        val email = request.email.orEmpty().trim()
        val password = request.password.orEmpty()
        if (email.isEmpty() || password.isEmpty()) {
            throw ApiException(HttpStatus.BAD_REQUEST, "Email and password are required")
        }
        if (users[email] != password) {
            throw ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password")
        }
        return LoginResponse(sessions.create(email), email)
    }

    @PostMapping("/api/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun logout(@RequestHeader(HttpHeaders.AUTHORIZATION, required = false) authorization: String?) {
        sessions.require(authorization)
        sessions.remove(authorization)
    }

    @GetMapping("/api/me")
    fun me(@RequestHeader(HttpHeaders.AUTHORIZATION, required = false) authorization: String?) =
        mapOf("email" to sessions.require(authorization).email)
}

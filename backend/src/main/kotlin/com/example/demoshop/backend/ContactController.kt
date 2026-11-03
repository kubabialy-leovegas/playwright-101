package com.example.demoshop.backend

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.concurrent.atomic.AtomicInteger

@RestController
class ContactController {
    private val nextTicketId = AtomicInteger(1)

    @PostMapping("/api/contact")
    @ResponseStatus(HttpStatus.CREATED)
    fun send(@RequestBody request: ContactRequest): ContactResponse {
        val errors = validate(request)
        if (errors.isNotEmpty()) throw ValidationException(errors)
        return ContactResponse(nextTicketId.getAndIncrement(), request.name!!.trim(), request.via!!)
    }

    /** Checks every field and reports all problems at once, keyed by field name. */
    private fun validate(request: ContactRequest): Map<String, String> = buildMap {
        if (request.name.isNullOrBlank()) put("name", "Name is required")
        if (request.topic !in listOf("order", "payment", "other")) put("topic", "Choose a topic")
        if (request.via !in listOf("email", "phone")) put("via", "Choose email or phone")
        if (request.message.orEmpty().trim().length < 10) put("message", "Message must be at least 10 characters")
        if (request.terms != true) put("terms", "You must accept the terms")
    }
}

package com.example.demoshop.backend

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.resource.NoResourceFoundException

/** Throw from anywhere to answer with { "error": message } and the given status. */
class ApiException(val status: HttpStatus, message: String) : RuntimeException(message)

class ValidationException(val errors: Map<String, String>) : RuntimeException("Validation failed")

/** Turns exceptions into the JSON error format every endpoint shares. */
@RestControllerAdvice
class ErrorHandler {

    @ExceptionHandler
    fun apiError(e: ApiException) = ResponseEntity.status(e.status).body(mapOf("error" to e.message))

    @ExceptionHandler
    fun validationError(e: ValidationException) =
        ResponseEntity.badRequest().body(mapOf("error" to e.message, "errors" to e.errors))

    @ExceptionHandler
    fun invalidJson(e: HttpMessageNotReadableException) = ResponseEntity.badRequest().body(mapOf("error" to "Invalid JSON"))

    @ExceptionHandler
    fun notFound(e: NoResourceFoundException) =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapOf("error" to "Not found"))
}

package com.example.demoshop.backend

import jakarta.annotation.PreDestroy
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger

@Service
class OrderService(private val cartService: CartService) {
    private val orders = ConcurrentHashMap<Int, Order>()
    private val nextId = AtomicInteger(1)

    // Plays the role of the external payment provider calling us back later.
    private val paymentProvider = Executors.newSingleThreadScheduledExecutor()

    fun place(session: Session): Order {
        val cart = cartService.view(session)
        if (cart.count == 0) throw ApiException(HttpStatus.BAD_REQUEST, "Cart is empty")

        val order = Order(nextId.getAndIncrement(), session.email, cart.items, cart.total)
        orders[order.id] = order
        session.cart.clear()

        // The payment is settled in the background. Clients have to poll
        // GET /api/orders/{id} until the status is final.
        val provider = session.paymentProvider
        paymentProvider.schedule({
            if (provider.result == PaymentResult.APPROVE) {
                order.status = OrderStatus.CONFIRMED
            } else {
                order.reason = "Payment declined"
                order.status = OrderStatus.REJECTED
            }
        }, provider.delayMs, TimeUnit.MILLISECONDS)
        return order
    }

    /** Customers only see their own orders; someone else's order is "not found". */
    fun get(session: Session, id: Int): Order =
        orders[id]?.takeIf { it.email == session.email }
            ?: throw ApiException(HttpStatus.NOT_FOUND, "Order $id not found")

    @PreDestroy
    fun shutdown() {
        paymentProvider.shutdownNow()
    }
}

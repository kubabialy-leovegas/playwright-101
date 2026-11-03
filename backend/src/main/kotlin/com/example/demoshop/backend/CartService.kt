package com.example.demoshop.backend

import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode

@Service
class CartService(private val catalog: Catalog) {

    fun view(session: Session): CartView {
        val snapshot = synchronized(session.cart) { session.cart.toMap() }
        val items = snapshot.map { (productId, quantity) ->
            val product = catalog.find(productId)!!
            CartItem(productId, product.name, product.price, quantity)
        }
        val total = items.fold(BigDecimal.ZERO) { sum, item -> sum + item.price * item.quantity.toBigDecimal() }
        return CartView(items, items.sumOf { it.quantity }, total.setScale(2, RoundingMode.HALF_UP))
    }

    fun add(session: Session, productId: Int?, quantity: Int?): CartView {
        if (quantity == null || quantity < 1) {
            throw ApiException(HttpStatus.BAD_REQUEST, "Quantity must be a positive integer")
        }
        if (productId == null || catalog.find(productId) == null) {
            throw ApiException(HttpStatus.NOT_FOUND, "Product $productId not found")
        }
        session.cart.merge(productId, quantity, Int::plus)
        return view(session)
    }

    fun remove(session: Session, productId: Int): CartView {
        session.cart.remove(productId)
            ?: throw ApiException(HttpStatus.NOT_FOUND, "Product $productId is not in the cart")
        return view(session)
    }

    fun clear(session: Session): CartView {
        session.cart.clear()
        return view(session)
    }
}

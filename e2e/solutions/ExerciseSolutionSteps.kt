package com.example.demoshop.e2e.step

import com.example.demoshop.e2e.config.ScenarioContext
import com.example.demoshop.e2e.service.Order
import com.example.demoshop.e2e.service.Product
import com.example.demoshop.e2e.service.ShopApiClient
import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import org.assertj.core.api.Assertions.assertThat
import org.springframework.beans.factory.annotation.Autowired
import java.math.BigDecimal

/**
 * Trainer solutions for the new steps in 99_exercises.feature.
 * In a real project each step would go to its domain class (ProductSteps, CartSteps...);
 * they are kept together here so the solutions are easy to find.
 */
class ExerciseSolutionSteps {

    @Autowired
    private lateinit var context: ScenarioContext

    @Autowired
    private lateinit var shopApi: ShopApiClient

    // Exercise 2
    @Then("every product has a price above {bigdecimal}")
    fun everyProductHasPriceAbove(minimum: BigDecimal) {
        val products = context.requireLastResponse().bodyAs<Array<Product>>()
        assertThat(products).isNotEmpty()
        assertThat(products).allSatisfy { assertThat(it.price).isGreaterThan(minimum) }
    }

    // Exercise 3
    @When("customer empties the cart")
    fun customerEmptiesCart() {
        context.lastResponse = shopApi.clearCart(context.requireToken())
    }

    // Exercise 5: a two-column table arrives as Map<String, String>.
    @When("customer sends a contact request with:")
    fun customerSendsContactRequest(fields: Map<String, String>) {
        val request: Map<String, Any?> = fields + ("terms" to fields.getValue("terms").toBoolean())
        context.lastResponse = shopApi.sendContactRequest(request)
    }

    // Exercise 6
    @Then("the order contains following products: {listOfStrings}")
    fun orderContainsProducts(names: List<String>) {
        val order = shopApi.getOrder(context.requireToken(), context.requireOrderId()).expectSuccess().bodyAs<Order>()
        assertThat(order.items.map { it.name }).containsExactlyInAnyOrderElementsOf(names)
    }
}

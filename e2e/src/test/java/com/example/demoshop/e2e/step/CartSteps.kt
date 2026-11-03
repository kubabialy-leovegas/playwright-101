package com.example.demoshop.e2e.step

import com.example.demoshop.e2e.config.ScenarioContext
import com.example.demoshop.e2e.service.Cart
import com.example.demoshop.e2e.service.ProductCatalog
import com.example.demoshop.e2e.service.ShopApiClient
import io.cucumber.java.en.Given
import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import org.assertj.core.api.Assertions.assertThat
import org.springframework.beans.factory.annotation.Autowired
import java.math.BigDecimal

class CartSteps {

    @Autowired
    private lateinit var context: ScenarioContext

    @Autowired
    private lateinit var shopApi: ShopApiClient

    @Autowired
    private lateinit var catalog: ProductCatalog

    @Given("customer has following products in the cart: {listOfStrings}")
    fun customerHasProductsInCart(names: List<String>) {
        names.forEach { shopApi.addToCart(context.requireToken(), catalog.byName(it).id).expectSuccess() }
    }

    @When("customer adds following products to the cart:")
    fun customerAddsProducts(rows: List<Map<String, String>>) {
        rows.forEach { row ->
            val productId = catalog.byName(row.getValue("product")).id
            context.lastResponse = shopApi.addToCart(context.requireToken(), productId, row.getValue("quantity").toInt())
        }
    }

    @When("customer adds product with id {int} to the cart")
    fun customerAddsProductById(productId: Int) {
        context.lastResponse = shopApi.addToCart(context.requireToken(), productId)
    }

    @When("customer adds {int} x {string} to the cart")
    fun customerAddsQuantity(quantity: Int, name: String) {
        context.lastResponse = shopApi.addToCart(context.requireToken(), catalog.byName(name).id, quantity)
    }

    @When("customer removes {string} from the cart")
    fun customerRemovesProduct(name: String) {
        context.lastResponse = shopApi.removeFromCart(context.requireToken(), catalog.byName(name).id)
    }

    @When("customer fetches the cart")
    fun customerFetchesCart() {
        context.lastResponse = shopApi.getCart(context.requireToken())
    }

    @Then("the cart is empty")
    fun cartIsEmpty() {
        val cart = currentCart()
        assertThat(cart.items).isEmpty()
        assertThat(cart.count).isZero()
    }

    @Then("the cart contains {int} item(s) with total {bigdecimal}")
    fun cartContains(count: Int, total: BigDecimal) {
        val cart = currentCart()
        assertThat(cart.count).isEqualTo(count)
        assertThat(cart.total).isEqualByComparingTo(total)
    }

    @Then("the cart contains following products: {listOfStrings}")
    fun cartContainsProducts(names: List<String>) {
        assertThat(currentCart().items.map { it.name }).containsExactlyInAnyOrderElementsOf(names)
    }

    private fun currentCart(): Cart = shopApi.getCart(context.requireToken()).expectSuccess().bodyAs()
}

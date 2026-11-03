package com.example.demoshop.e2e.step

import com.example.demoshop.e2e.config.ScenarioContext
import com.example.demoshop.e2e.service.Product
import com.example.demoshop.e2e.service.ShopApiClient
import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import org.assertj.core.api.Assertions.assertThat
import org.springframework.beans.factory.annotation.Autowired
import java.math.BigDecimal

/**
 * LESSON 01: every Gherkin line is matched to ONE function by the text in the annotation.
 * {int}, {string}, {bigdecimal}... are placeholders: Cucumber passes the value as a parameter.
 */
class ProductSteps {

    @Autowired
    private lateinit var context: ScenarioContext

    @Autowired
    private lateinit var shopApi: ShopApiClient

    @When("customer requests the product list")
    fun customerRequestsProducts() {
        context.lastResponse = shopApi.getProducts()
    }

    @Then("the response contains {int} products")
    fun responseContainsProducts(count: Int) {
        assertThat(products()).hasSize(count)
    }

    @Then("product {string} costs {bigdecimal}")
    fun productCosts(name: String, price: BigDecimal) {
        val product = products().find { it.name == name }
        assertThat(product).describedAs("product '%s'", name).isNotNull()
        assertThat(product!!.price).isEqualByComparingTo(price)
    }

    private fun products(): List<Product> = context.requireLastResponse().bodyAs<Array<Product>>().toList()
}

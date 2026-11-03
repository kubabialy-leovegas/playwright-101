package com.example.demoshop.e2e.step

import com.example.demoshop.e2e.config.ScenarioContext
import com.example.demoshop.e2e.service.Order
import com.example.demoshop.e2e.service.OrderStatus
import com.example.demoshop.e2e.service.ShopApiClient
import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import org.assertj.core.api.Assertions.assertThat
import org.awaitility.kotlin.await
import org.awaitility.kotlin.untilAsserted
import org.springframework.beans.factory.annotation.Autowired
import java.math.BigDecimal

class OrderSteps {

    @Autowired
    private lateinit var context: ScenarioContext

    @Autowired
    private lateinit var shopApi: ShopApiClient

    @When("customer places an order")
    fun customerPlacesOrder() {
        val response = shopApi.placeOrder(context.requireToken())
        context.lastResponse = response
        if (response.status == 201) {
            context.orderId = response.bodyAs<Order>().id
        }
    }

    @Then("the order is created in status {orderStatus} with total {bigdecimal}")
    fun orderIsCreated(status: OrderStatus, total: BigDecimal) {
        val order = context.requireLastResponse().expectSuccess().bodyAs<Order>()
        assertThat(order.status).isEqualTo(status)
        assertThat(order.total).isEqualByComparingTo(total)
    }

    /**
     * The backend settles payments in the background, so we poll until the
     * status matches (or the Awaitility timeout runs out). Never Thread.sleep.
     */
    @Then("eventually the order is in status {orderStatus}")
    fun eventuallyOrderIsInStatus(status: OrderStatus) {
        await untilAsserted {
            assertThat(currentOrder().status).isEqualTo(status)
        }
    }

    @Then("the order was rejected with reason {string}")
    fun orderWasRejected(reason: String) {
        assertThat(currentOrder().reason).isEqualTo(reason)
    }

    private fun currentOrder(): Order =
        shopApi.getOrder(context.requireToken(), context.requireOrderId()).expectSuccess().bodyAs()
}

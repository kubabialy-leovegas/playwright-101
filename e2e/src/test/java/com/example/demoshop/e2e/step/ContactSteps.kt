package com.example.demoshop.e2e.step

import com.example.demoshop.e2e.config.ScenarioContext
import com.example.demoshop.e2e.service.ShopApiClient
import com.example.demoshop.e2e.util.TestData
import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import org.assertj.core.api.Assertions.assertThat
import org.springframework.beans.factory.annotation.Autowired

class ContactSteps {

    @Autowired
    private lateinit var context: ScenarioContext

    @Autowired
    private lateinit var shopApi: ShopApiClient

    @When("customer sends a valid contact request")
    fun customerSendsValidRequest() {
        context.lastResponse = shopApi.sendContactRequest(TestData.validContactRequest())
    }

    @When("customer sends a contact request with {word} set to {string}")
    fun customerSendsRequestWith(field: String, value: String) {
        val request = TestData.validContactRequest()
        // "terms" is a checkbox, so the API expects a boolean.
        request[field] = if (field == "terms") value.toBoolean() else value
        context.lastResponse = shopApi.sendContactRequest(request)
    }

    @Then("a support ticket is created")
    fun ticketIsCreated() {
        val response = context.requireLastResponse()
        assertThat(response.status).isEqualTo(201)
        assertThat(response.body.path("ticketId").asInt()).isPositive()
    }

    @Then("field {word} is rejected with {string}")
    fun fieldIsRejected(field: String, message: String) {
        val response = context.requireLastResponse()
        assertThat(response.status).isEqualTo(400)
        assertThat(response.body.path("errors").path(field).asText()).isEqualTo(message)
    }
}

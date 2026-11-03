package com.example.demoshop.e2e.step

import com.example.demoshop.e2e.config.ScenarioContext
import com.example.demoshop.e2e.service.ApiResponse
import com.example.demoshop.e2e.service.ShopApiClient
import com.example.demoshop.e2e.util.TestData
import io.cucumber.java.en.Given
import io.cucumber.java.en.Then
import io.cucumber.java.en.When
import org.assertj.core.api.Assertions.assertThat
import org.springframework.beans.factory.annotation.Autowired

class AuthSteps {

    @Autowired
    private lateinit var context: ScenarioContext

    @Autowired
    private lateinit var shopApi: ShopApiClient

    @Given("customer is logged in")
    fun customerIsLoggedIn() {
        login(TestData.EMAIL, TestData.PASSWORD).expectSuccess()
    }

    @When("customer logs in as {string} with password {string}")
    fun customerLogsIn(email: String, password: String) {
        login(email, password)
    }

    @When("customer logs out")
    fun customerLogsOut() {
        context.lastResponse = shopApi.logout(context.requireToken())
    }

    @Then("customer has an active session")
    fun customerHasActiveSession() {
        val me = shopApi.me(context.requireToken())
        assertThat(me.status).isEqualTo(200)
        assertThat(me.body.path("email").asText()).isEqualTo(context.email)
    }

    private fun login(email: String, password: String): ApiResponse {
        val response = shopApi.login(email, password)
        context.lastResponse = response
        if (response.status == 200) {
            val token = response.body.path("token").asText()
            context.token = token
            context.email = email
            // Logging out drops the session and its cart on the server.
            context.addCleanupAction { shopApi.logout(token) }
        }
        return response
    }
}

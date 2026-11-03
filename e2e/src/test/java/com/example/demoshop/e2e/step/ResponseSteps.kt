package com.example.demoshop.e2e.step

import com.example.demoshop.e2e.config.ScenarioContext
import io.cucumber.java.en.Then
import org.assertj.core.api.Assertions.assertThat
import org.springframework.beans.factory.annotation.Autowired

/** Generic checks on the last API call, reused by every feature. */
class ResponseSteps {

    @Autowired
    private lateinit var context: ScenarioContext

    @Then("the response status is {int}")
    fun responseStatusIs(status: Int) {
        val response = context.requireLastResponse()
        assertThat(response.status).describedAs("status of response %s", response.body).isEqualTo(status)
    }

    @Then("the error message is {string}")
    fun errorMessageIs(message: String) {
        assertThat(context.requireLastResponse().error).isEqualTo(message)
    }
}

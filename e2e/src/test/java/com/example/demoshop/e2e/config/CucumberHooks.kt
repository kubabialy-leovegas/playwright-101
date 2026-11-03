package com.example.demoshop.e2e.config

import com.example.demoshop.e2e.service.ShopApiClient
import io.cucumber.java.After
import io.cucumber.java.Before
import io.cucumber.java.Scenario
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.client.ResourceAccessException

/**
 * Hooks run around EVERY scenario (lesson 03).
 * @Before: setup that is not part of the business story.
 * @After: cleanup, which runs even when the scenario failed.
 */
class CucumberHooks {

    @Autowired
    private lateinit var context: ScenarioContext

    @Autowired
    private lateinit var shopApi: ShopApiClient

    @Autowired
    private lateinit var properties: E2eProperties

    @Before
    fun failFastIfShopIsDown() {
        try {
            shopApi.health()
        } catch (e: ResourceAccessException) {
            throw IllegalStateException("Demo shop is not running at ${properties.baseUrl}; start it with `mvn spring-boot:run` in the backend folder", e)
        }
    }

    @After
    fun cleanup(scenario: Scenario) {
        // Attach the last response to the report, so a failure shows what the API actually said.
        if (scenario.isFailed) {
            context.lastResponse?.let {
                scenario.attach("HTTP ${it.status}\n${it.body.toPrettyString()}", "text/plain", "last response")
            }
        }
        context.runCleanupActions()
    }
}

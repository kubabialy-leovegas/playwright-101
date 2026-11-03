package com.example.demoshop.e2e.step

import com.example.demoshop.e2e.config.ScenarioContext
import com.example.demoshop.e2e.service.ShopApiClient
import io.cucumber.java.en.Given
import org.springframework.beans.factory.annotation.Autowired

/**
 * Controls the fake payment provider, the same idea as MockProxySteps in
 * onboarding-e2e-tests: the scenario decides what the external system answers.
 */
class PaymentProviderSteps {

    @Autowired
    private lateinit var context: ScenarioContext

    @Autowired
    private lateinit var shopApi: ShopApiClient

    @Given("payment provider {paymentResult} payments")
    fun paymentProviderAnswers(result: String) {
        shopApi.configurePaymentProvider(context.requireToken(), result).expectSuccess()
    }

    @Given("payment provider {paymentResult} payments after {long} ms")
    fun paymentProviderAnswersAfter(result: String, delayMs: Long) {
        shopApi.configurePaymentProvider(context.requireToken(), result, delayMs).expectSuccess()
    }
}

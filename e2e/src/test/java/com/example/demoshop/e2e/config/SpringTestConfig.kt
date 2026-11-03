package com.example.demoshop.e2e.config

import io.cucumber.spring.ScenarioScope
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.ScopedProxyMode

@Configuration
class SpringTestConfig {

    /** A fresh ScenarioContext for every scenario. */
    @Bean
    @ScenarioScope(proxyMode = ScopedProxyMode.NO)
    fun scenarioContext(): ScenarioContext = ScenarioContext()
}

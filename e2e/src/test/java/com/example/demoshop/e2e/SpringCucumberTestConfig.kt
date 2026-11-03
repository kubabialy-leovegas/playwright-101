package com.example.demoshop.e2e

import com.example.demoshop.e2e.config.SpringTestConfig
import io.cucumber.spring.CucumberContextConfiguration
import org.awaitility.Awaitility
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.ComponentScan
import java.time.Duration

/**
 * Glues Cucumber to Spring: step classes get their dependencies via @Autowired,
 * and application.yml is loaded like in any Spring Boot app.
 */
@ComponentScan
@EnableAutoConfiguration
@CucumberContextConfiguration
@SpringBootTest(classes = [SpringTestConfig::class], webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ConfigurationPropertiesScan
class SpringCucumberTestConfig {

    init {
        Awaitility.setDefaultPollInterval(Duration.ofMillis(250))
        Awaitility.setDefaultTimeout(DEFAULT_AWAIT_TIMEOUT)
    }

    companion object {
        val DEFAULT_AWAIT_TIMEOUT: Duration = Duration.ofSeconds(10)
    }
}

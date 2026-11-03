package com.example.demoshop.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

/**
 * Demo Shop backend: the system under test for the Cucumber workshop in ../e2e.
 * Everything is kept in memory, so a restart gives a clean shop.
 *
 * Start it with: mvn spring-boot:run
 */
@SpringBootApplication
@ConfigurationPropertiesScan
class DemoShopApplication

fun main(args: Array<String>) {
    runApplication<DemoShopApplication>(*args)
}

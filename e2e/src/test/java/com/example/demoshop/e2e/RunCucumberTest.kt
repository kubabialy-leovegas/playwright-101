package com.example.demoshop.e2e

import io.cucumber.core.options.Constants.GLUE_PROPERTY_NAME
import io.cucumber.junit.platform.engine.Constants.JUNIT_PLATFORM_NAMING_STRATEGY_PROPERTY_NAME
import io.cucumber.junit.platform.engine.Constants.PLUGIN_PROPERTY_NAME
import io.cucumber.junit.platform.engine.Constants.PLUGIN_PUBLISH_QUIET_PROPERTY_NAME
import org.junit.platform.suite.api.ConfigurationParameter
import org.junit.platform.suite.api.IncludeEngines
import org.junit.platform.suite.api.SelectClasspathResource
import org.junit.platform.suite.api.Suite

/**
 * Entry point: runs every .feature file under src/test/resources/bdd.
 * Filter by tag with: mvn test -Dcucumber.filter.tags="@lesson05 and not @slow"
 * (exercises are excluded by default in junit-platform.properties)
 */
@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("bdd")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "com.example.demoshop.e2e")
@ConfigurationParameter(key = PLUGIN_PROPERTY_NAME, value = "pretty,html:target/cucumber-report.html")
@ConfigurationParameter(key = PLUGIN_PUBLISH_QUIET_PROPERTY_NAME, value = "true")
@ConfigurationParameter(key = JUNIT_PLATFORM_NAMING_STRATEGY_PROPERTY_NAME, value = "long")
class RunCucumberTest

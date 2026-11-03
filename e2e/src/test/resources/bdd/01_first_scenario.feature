# LESSON 01: Your first scenario
#
# A feature file describes behaviour in plain English (Gherkin):
#   Feature   what we are testing
#   Scenario  one example of the behaviour
#   Given     the starting state         (setup)
#   When      the action we test          (one per scenario, ideally)
#   Then      the expected result         (assertions)
#   And/But   continue the previous kind of step
#
# Every line is "glued" to a Kotlin function with the same text,
# see step/ProductSteps.kt and step/ResponseSteps.kt.
#
# Run only this lesson:  mvn test -Dcucumber.features=classpath:bdd/01_first_scenario.feature
# Run by tag:            mvn test -Dcucumber.filter.tags=@lesson01
@lesson01
Feature: Product catalogue

  Scenario: Product list returns all products
    When customer requests the product list
    Then the response status is 200
    And the response contains 5 products

  Scenario: Product prices are correct
    When customer requests the product list
    Then product "Coffee Mug" costs 7.50
    And product "Mechanical Keyboard" costs 89.00

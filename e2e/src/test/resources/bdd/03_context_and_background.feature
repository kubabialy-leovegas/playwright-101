# LESSON 03: Sharing data between steps, Background and cleanup
#
# Steps live in different classes, but they need to share data: the login
# step gets a token, and the cart steps need that token.
# That is what config/ScenarioContext.kt is for: a fresh object for every
# scenario that every step class can @Autowired.
#
# Background runs before EVERY scenario in this file (like beforeEach).
#
# Cleanup: the login step registers "log out" as a cleanup action and
# config/CucumberHooks.kt runs it after the scenario, even if it failed.
# Tests never leave data behind for the next test.
@lesson03
Feature: Cart basics

  Background:
    Given customer is logged in

  Scenario: New session starts with an empty cart
    Then the cart is empty

  Scenario: Removing a product
    Given customer has following products in the cart: Wireless Mouse, Desk Lamp
    When customer removes "Desk Lamp" from the cart
    Then the response status is 200
    And the cart contains following products: Wireless Mouse

  Scenario: Session cannot be used after logout
    When customer logs out
    And customer fetches the cart
    Then the response status is 401
    And the error message is "Not logged in"

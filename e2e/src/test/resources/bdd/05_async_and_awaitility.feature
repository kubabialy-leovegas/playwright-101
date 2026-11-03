# LESSON 05: Asynchronous results (and why you should never sleep)
#
# A new order starts as PENDING. The payment provider answers in the
# background and only then the order becomes CONFIRMED (about 1.5 s later).
#
# A bad test would do Thread.sleep(2000):
#   - too short on a slow day  -> flaky test
#   - too long on a fast day   -> slow test suite
#
# Instead OrderSteps uses Awaitility: "await untilAsserted { ... }" repeats
# the check every 250 ms until it passes or the timeout (10 s, set in
# SpringCucumberTestConfig) runs out. Same idea as expect() auto-waiting
# in tests/06-auto-waiting.spec.ts.
@lesson05
Feature: Orders

  Background:
    Given customer is logged in

  Scenario: Order is confirmed shortly after it is placed
    Given customer has following products in the cart: Running Shoes, Coffee Mug
    When customer places an order
    Then the order is created in status PENDING with total 72.49
    And the cart is empty
    And eventually the order is in status CONFIRMED

  Scenario: Empty cart cannot be ordered
    When customer places an order
    Then the response status is 400
    And the error message is "Cart is empty"

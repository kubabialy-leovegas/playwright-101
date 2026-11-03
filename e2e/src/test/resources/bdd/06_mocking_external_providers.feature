# LESSON 06: Controlling external systems
#
# Real systems talk to providers we do not control (payments, KYC, ...).
# We cannot ask a real bank to decline a payment on demand, so test
# environments run a mock that the TEST configures before the action.
# In onboarding-e2e-tests this is MockProxySteps ("Dow Jones identifies
# player as a PEP"); here it is PaymentProviderSteps.
#
# Pattern: Given <provider answers X>  ->  When <action>  ->  Then <our system reacts>
# Compare with page.route() in tests/07-network-mocking.spec.ts.
@lesson06
Feature: Payment provider answers

  Background:
    Given customer is logged in

  Scenario: Order is confirmed when the payment provider approves it
    Given payment provider approves payments
    And customer has following products in the cart: Wireless Mouse
    When customer places an order
    Then eventually the order is in status CONFIRMED

  Scenario: Order is rejected when the payment provider declines it
    Given payment provider declines payments
    And customer has following products in the cart: Mechanical Keyboard
    When customer places an order
    Then the order is created in status PENDING with total 89.00
    And eventually the order is in status REJECTED
    And the order was rejected with reason "Payment declined"

  # Try it: lower the Awaitility timeout in SpringCucumberTestConfig to 2 s
  # and run this scenario to see what a timeout failure looks like.
  @slow
  Scenario: Slow payment provider still confirms the order
    Given payment provider approves payments after 4000 ms
    And customer has following products in the cart: Desk Lamp
    When customer places an order
    Then eventually the order is in status CONFIRMED

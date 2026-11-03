# LESSON 02: Parameters and Scenario Outlines
#
# Values in quotes or numbers in a step become function parameters:
#   When customer logs in as "qa@example.com" with password "password123"
#   @When("customer logs in as {string} with password {string}")
#
# A Scenario Outline runs once per row of the Examples table; <name> is
# replaced with the value from the column "name". It is the Cucumber way
# of data-driven tests (compare with the loop in tests/05-login-scenarios.spec.ts).
#
# Think like a QA: one happy path, then every way it can go wrong.
@lesson02
Feature: Login

  Scenario: Registered customer can log in
    When customer logs in as "qa@example.com" with password "password123"
    Then the response status is 200
    And customer has an active session

  Scenario Outline: Login is rejected for <case>
    When customer logs in as "<email>" with password "<password>"
    Then the response status is <status>
    And the error message is "<error>"

    Examples:
      | case           | email             | password    | status | error                           |
      | wrong password | qa@example.com    | nope        | 401    | Invalid email or password       |
      | unknown user   | ghost@example.com | password123 | 401    | Invalid email or password       |
      | empty email    |                   | password123 | 400    | Email and password are required |
      | empty password | qa@example.com    |             | 400    | Email and password are required |

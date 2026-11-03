# LESSON 04: Data tables and custom parameter types
#
# A data table passes many values to ONE step. The step receives it as
# List<Map<String, String>>, one map per row (see CartSteps.customerAddsProducts).
#
# Custom parameter types turn text into typed values. {listOfStrings} in
# cucumber/ParameterTypes.kt turns "Wireless Mouse, Desk Lamp" into a list.
# Feature files stay readable, steps stay simple.
@lesson04
Feature: Cart with several products

  Background:
    Given customer is logged in

  Scenario: Adding products updates count and total
    When customer adds following products to the cart:
      | product        | quantity |
      | Wireless Mouse | 2        |
      | Coffee Mug     | 1        |
    Then the response status is 201
    And the cart contains 3 items with total 47.48

  Scenario: Adding the same product twice increases its quantity
    Given customer has following products in the cart: Desk Lamp, Desk Lamp
    Then the cart contains 2 items with total 48.00
    And the cart contains following products: Desk Lamp

  Scenario: Unknown product cannot be added
    When customer adds product with id 999 to the cart
    Then the response status is 404
    And the error message is "Product 999 not found"

  Scenario Outline: Quantity <quantity> is rejected
    When customer adds <quantity> x "Coffee Mug" to the cart
    Then the response status is 400
    And the error message is "Quantity must be a positive integer"
    And the cart is empty

    Examples:
      | quantity |
      | 0        |
      | -1       |

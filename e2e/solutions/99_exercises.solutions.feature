# Trainer solutions for src/test/resources/bdd/99_exercises.feature.
# To run them: copy this file to src/test/resources/bdd/ and ExerciseSolutionSteps.kt
# to src/test/java/com/example/demoshop/e2e/step/, then:
#   mvn test -Dcucumber.filter.tags=@solution
@solution
Feature: Exercise solutions

  Scenario: 1. Removing a product that is not in the cart
    Given customer is logged in
    When customer removes "Coffee Mug" from the cart
    Then the response status is 404
    And the error message is "Product 3 is not in the cart"

  Scenario: 2. Every product has a positive price
    When customer requests the product list
    Then every product has a price above 0

  Scenario: 3. Emptying the cart
    Given customer is logged in
    And customer has following products in the cart: Coffee Mug, Desk Lamp
    When customer empties the cart
    Then the cart is empty

  Scenario Outline: 4. Order total matches the price of <product>
    Given customer is logged in
    And customer has following products in the cart: <product>
    When customer places an order
    Then the order is created in status PENDING with total <price>

    Examples:
      | product        | price |
      | Coffee Mug     | 7.50  |
      | Desk Lamp      | 24.00 |
      | Running Shoes  | 64.99 |

  Scenario: 5. Contact request from a table
    When customer sends a contact request with:
      | name    | Bob Builder                  |
      | topic   | order                        |
      | via     | phone                        |
      | message | Where is my order number 42? |
      | terms   | true                         |
    Then a support ticket is created

  Scenario: 6. Confirmed order keeps its products
    Given customer is logged in
    And customer has following products in the cart: Wireless Mouse, Coffee Mug
    When customer places an order
    Then eventually the order is in status CONFIRMED
    And the order contains following products: Wireless Mouse, Coffee Mug

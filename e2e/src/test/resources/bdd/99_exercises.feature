# EXERCISES: your turn!
#
# These scenarios are tagged @exercise and skipped by default.
# Run them with:  mvn test -Dcucumber.filter.tags=@exercise
#
# Some only need Gherkin (existing steps are enough), some need a new step
# function. When a step has no function yet, Cucumber prints a snippet you
# can copy into a step class. Stuck? Look at lessons 01 to 07.
@exercise
Feature: Exercises

  # 1. Only Gherkin. Removing a product that is not in the cart must answer
  #    404 with "Product 3 is not in the cart" (Coffee Mug has id 3).
  Scenario: 1. Removing a product that is not in the cart

  # 2. New step in ProductSteps: every product has a price above 0.
  Scenario: 2. Every product has a positive price
    When customer requests the product list
    Then every product has a price above 0

  # 3. New step in CartSteps. Hint: shopApi.clearCart(token) already exists.
  Scenario: 3. Emptying the cart
    Given customer is logged in
    And customer has following products in the cart: Coffee Mug, Desk Lamp
    When customer empties the cart
    Then the cart is empty

  # 4. Only Gherkin, as a Scenario Outline: log in, add a product, place
  #    an order and check the created total for at least 3 different products.
  Scenario: 4. Order total matches the product price

  # 5. New step with a vertical data table: receive it as Map<String, String>.
  #    Remember: "terms" must be sent as a boolean.
  Scenario: 5. Contact request from a table
    When customer sends a contact request with:
      | name    | Bob Builder                   |
      | topic   | order                         |
      | via     | phone                         |
      | message | Where is my order number 42? |
      | terms   | true                          |
    Then a support ticket is created

  # 6. Turn a requirement into a test.
  #    Requirement: "A confirmed order contains exactly the products that were in the cart."
  #    You will need a new step, e.g. "Then the order contains following products: ..."
  Scenario: 6. Confirmed order keeps its products

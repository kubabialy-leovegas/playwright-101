# LESSON 07: Testing validation like a QA
#
# Start from ONE valid request and break exactly one field per example.
# If the test fails you know exactly which rule is broken.
# (TestData.validContactRequest() holds the valid request.)
#
# Also note: these are tests for the BACKEND rules. The frontend may block
# some of these inputs (e.g. the disabled Send button), but the API must
# reject them too: anyone can call the API directly.
@lesson07
Feature: Contact form API

  Scenario: Valid contact request creates a support ticket
    When customer sends a valid contact request
    Then a support ticket is created

  Scenario Outline: Contact request is rejected when <field> is "<value>"
    When customer sends a contact request with <field> set to "<value>"
    Then field <field> is rejected with "<error>"

    Examples:
      | field   | value     | error                                  |
      | name    |           | Name is required                       |
      | topic   | billing   | Choose a topic                         |
      | via     | fax       | Choose email or phone                  |
      | message | too short | Message must be at least 10 characters |
      | terms   | false     | You must accept the terms              |

Feature: Test Login form via Chemsoft NG

    Scenario: Should be able to log in via Login form
        Given I access to Chemsoft Login portal page
        When I enter a username Ljubisa
        And I enter a password 123456
        And I click on Sign in
        Then I should get a new page Chemsoft
Feature: Logging in of a user

Scenario: A user with a SOLID account logs in the application
  Given A user with a SOLID account
  When The users logs in the application
  Then The app goes to main page
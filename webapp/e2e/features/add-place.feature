Feature: Logging in of a user

Scenario: A user adds a new place in the map
  Given A user that is logged in
  When The users adds a place
  Then The place can be seen on the map
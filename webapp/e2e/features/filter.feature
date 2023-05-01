Feature: Filtering places by category

Scenario: A user employs the filter to see places of a category he/she has already used
  Given A user that has a park in the map
  When The users selects the park category in the filter and clicks Search
  Then The park can be seen in the map

#Scenario: A user employs the filter to see places of a category he/she has not used yet
#  Given A user that has a park in the map
#  When The users selects the museum category in the filter and clicks Search
#  Then The museum can not be seen in the map (there are no places in it)
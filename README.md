# Day After Tomorrow

On Day After Tomorrow a person can enter any city and a date in the near future to get the forecast for that day, a map of the city and a list of some cool things to do while there.  It saves all searches and allows you to re-initiate those searches with the click of a button.<br>

## Screen Shot
![image](https://github.com/david-leverenz/day-after-tomorrow/assets/131185593/7dce690c-adf6-44da-81ac-b81c9ee32471)

## Links

Github Link: https://github.com/karthikmurugappan/day-after-tomorrow

## User Story
```
AS A USER that is planning to travel
I WANT to know the weather and points of interest according to that place and day
SO THAT I can plan more effectively and efficiently
```

## Acceptance Criteria
```
GIVEN
WHEN I open the webpage
THEN is a search bar to input text, a place to input a desired date, and a search button.
WHEN a city is searched for
THEN I am presented with a map of the city, and relevant data around that location.
WHEN a city and date is searched for
THEN I am presented with a relevant weather forecast.
WHEN viewing the forecast
THEN the city name, temperature, and other weather related data is presented in a current and future forecast.
WHEN I am viewing the map
THEN I can interact with the map (click and drag, zoom, etc.)
WHEN I am viewing the location POI results
THEN the infomation contains the name, type of company, address, and phone/URL if applicable.
WHEN I search for a new city
THEN previously searched cities will be saved to local storage
WHEN I want to look at my previous searched cities
THEN I can see them on the page as buttons
WHEN I click on a given button
THEN it will take me to the result page with the respective location and date previously searched
WHEN I reload the page
THEN the previous search history data persists
```

## Other Criteria
    - Two API CDNs must be used, one must be an original source.
    - It must be deployed to GitHub with a working live link and contain a screenshot of the deployed site.
    - The CSS CDN must be an approved CLI that is NOT Bootstrap.
    - It must use multiple API calls that retrieve relevant data and display appropriately on the page.
    - It must be user interactive and save/load user data with local storage.
    - Quality README, comments, and organized clean code.
    - Descriptive commit history and multiple branches.
=======

## Description
Our website uses the Tailwind CSS framework (a framework other than Bootstrap).<br>
It was deployed to GitHub Pages.<br>
It is interactive (i.e. can accept and respond to user input).<br>
It uses two different server-side APIs (four api calls).<br>
It uses modals for validation.<br>
It uses client-side storage to store persistent data.<br>
It is responsive.<br>
It has a polished and easy-to-use UI.<br>
It has a clean repository that meets quality coding standards (file structure, naming conventions, follows best practices for class/id naming conventions, indentation, quality comments, etc.).<br>
It has a quality README (with unique name, description, technologies used, screenshot (to be added after CSS changes), and link to deployed application).<br>


## Version History
Version 1.0 (Initial Release)<br>
## License
This project is licensed under the MIT License - see the LICENSE.md file for details.<br>
## Acknowledgments

* [Tailwind](https://tailwindcss.com/)
* [Flowbite](https://flowbite.com/)
* [OpenWeather](https://openweathermap.org/api)
* [tomtom](https://www.tomtom.com/)

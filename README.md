Start with
==========

npm start

Hangman game task
=====================

A classical hangman game (player vs computer). A random word is fetched via an API from a server. 
The letters count is presented to the user. It should be possible for the user to select only 1 letter at a time. 
If the player selects a letter that exists in the word, user interface should be updated accordingly so the selected letter is presented. 
If the player selects an incorrect letter, then a new element should be added to the hangman picture. 
A list of selected letters should be presented.
The game ends when the user guesses the word or run out of letter choices.

Views / Sections

* Game view - contains game front-end representation where the player/user inputs the letters one by one. A letter can be selected either by the text input or by the keyboard UI.
* Games history list - a table (with clickable rows loading the "Game history details") with the following columns: Word to guess, Selected letters, Win (yes / no possible values), datetime (format: YYYY-MM-DD HH:MM:SS).
* Game history details page - the user can select and review a game he has played via the "Game history list" section.
* Login page
* Register page


You can find the UI design in Figma here - https://bit.ly/3roMm07 (Please note that you should login in order to switch to developer's mode to be able to inspect design details)

Use Angular for the front-end implementation.

---
API
===
The API is RESTful and is using JSON as a data format.

The base url is http://3.253.2.17. CORS are enabled.

Authentication required for all endpoints except /login and /register.
There is a JWT token implementation for authentication. The token is valid for 2 hours.
You can obtain it by calling the /login endpoint with the username and password.
You should place it in <b>x-access-token</b> header for all requests that require authentication.

You can find the documentation as a Postman collection in docs/HangmanAPI.postman_collection.json. Import it in Postman to see the details.

"# FakeGameQuiz" 

This project contains the HTML5 code for the redesigned website, which is a gamified survey site. Its purpose is to measure the ability to distinguish AI-generated faces from real ones.
TOC:
-Functionality
-Structure
-Installation

1. Functionality
The survey consists of 3 phases. First, the participant is shown five faces selected from a set of 100 real and 100 generated faces. The participant is then asked to categorize them. Next, the participant receives training on how to better distinguish between them. Finally, the participant must classify another 5 images.
The participant must specify their age group. This information, along with the results from Phase 2 and the training, as well as the time taken and other data, is sent to a Google Sheets document. The measurements are stored there and can be viewed and evaluated.

Landing Page => Tutorial
    ||            ||
 Agent Dialoge
    ||
Forms
||
Quiz Part 1
|| 
Training
||
Quiz Part 2
||
End Summary => Additional Informations
||                          ||
Landing Page


2. Structure
The folders in .\Img contain the images for differentiation
The images in .\Img4Learning are for training
The images in .\LearningFakeIMage are for the post-survey exercise
The .\Archiv folder contains old source code
The .\node_modules folder contains the dependencies for the PWA

- Each page generally has separate HTML, CSS, and JS files
- The i18n.js file contains all text and translations
- Some elements that appear multiple times have their own CSS files (Agent dialog, numbered list—see tutorial)

3. Installation

Installation as a Progressive Web App (PWA) for full-screen mode
Android
1. Open the page in your browser
2. Tap the menu in the top-right corner
3. Select “Install App,” “Add to Home Screen,” or “Install”
4. Confirm by tapping “Install”
The PWA will then appear on your home screen and in your app list just like a regular app

iPhone
1. Open the page in Safari
2. Tap the Share icon
3. Scroll down and select “Add to Home Screen”
4. Tap “Add”

Link to Google Sheets
See .\HowToDeploy 
The address must be inserted into line 33 of quiz.js
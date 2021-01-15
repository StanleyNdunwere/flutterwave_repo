# flutterwave_repo
A Demo of an online store featuring payment integration with the Flutterwave v3 Payment API. Please see the ReadME section for more details on the project.

#Project Overview
The Jumga store is a demo application that lets buyers, merchants and dispatch rider register and use the platform for their varied needs leveraging the v3 Flutterwave payments API.
On Jumga there exists a number of accounts that can use the platform:
Merchants: They register on the platform and create products with a price tag for customers or users to buy
Dispactch Riders: They register on the platform to help merchants deliver the products they've purchase to the end users
Users: They register on the platform to look through and purchase products from merchants and have registered riders deliver these products to them
Guests: These are a special case of users who would rather not register on the platform but still want to make purchases nonetheless
Admin: A regulatory account that oversees the entire operations of Jumga Store.

#Setting Up The Project
#Repository Description
The Repository consists of two sub folders named:
1. flutterwave_express_main
2. flutterwave_react_main

These two folders hold two different projects. The flutterwave_express_main project contains a Node JS/Express Framework Backend API that handles all the heavy lifting behind the scenes while the flutterwave_react_main project holds the Front-End code and is mainly concerned with UI rendition.
These two apps work together to render the Jumga Store and facilitate all its features.

To set up the project pull the entire repository - flutterwave_repo into any folder of your choice
#Settng Up The Node JS Server
Once the entire repository is pulled to your machine open the flutterwave_express_main folder in any code editor of your choice (perferably VSCode). Start a new terminal and run the following commands:
- npm install [this will install all the dependencies for the express project]
- npm run start [this will start up the project on a preconfigured port of 4100]
To check that the app is running without errors you can head to your browser and try to access the homepage: http://localhost:4100
You should see a text that reads "Hello from within the framework". This confirms that your NodeJS/Express Project is running normally.



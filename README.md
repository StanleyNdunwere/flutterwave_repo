A Demo of an online store featuring payment integration with the Flutterwave v3 Payment API. Please see the ReadME section for more details on the project.

# Project Overview

The Jumga store is a demo application that lets buyers, merchants and dispatch-riders register and use the platform for their varied needs leveraging the v3 Flutterwave payments API.

On Jumga there exist several accounts that can register and use the platform:

Merchants: They register on the platform and create products with a price tag for customers or users to purchase

Dispatch Riders: They register on the platform to help merchants deliver the products they've purchase to the end-users

Users: They register on the platform to look through and purchase products from merchants and have registered riders deliver these products to them

Guests: These are special cases of users who would rather not register on the platform but still want to make purchases nonetheless

Admin: A regulatory account that oversees the entire operations of Jumga Store.

# Setting Up The Project

## Repository Description

The Repository consists of two subfolders named:

* flutterwave_express_main
* flutterwave_react_main

These two folders hold two different projects.

The flutterwave_express_main project contains a Node JS/Express Framework Backend API that handles all the heavy lifting behind the scenes

The flutterwave_react_main project holds the Front-End code and is mainly concerned with UI rendition.

These two apps work together to render the Jumga Store and facilitate all its features.

To set up the project pull the entire repository - flutterwave_repo into any folder of your choice on your PC.

## Setting Up The Express JS Application

Please note that an internet connection is required for the Express application to communicate with the online Mongo Atlas database where all the application information is stored/updated.

Once the entire repository is pulled to your machine open the flutterwave_express_main folder in any code editor of your choice (preferably VSCode). Start a new terminal and run the following commands:
```bash
npm install - (this will install all the dependencies for the express project)
npm run start - (this will start up the project on a preconfigured port of 4100)
```
To check that the app is running without errors you can head to your browser and try to access the homepage: http://localhost:4100.  You should see a text that reads:

    "Hello from within the framework"

This confirms that your NodeJS/Express Project is running normally.

## Setting Up The React Application

The React Application talks to the express application to get the information it'll need to display to the end-users. For the purpose of this simulation, the react application will be run in dev mode as compilation and building for deployment will require the set-up of a dedicated web server (Apache, Nginx, etc.) which is more involved than running the app with React's built-in server.

Open the react application folder (flutterwave_react_main) in any suitable code-editor and run the following commands in the terminal:
```sh
npm install - (installs all the dependencies)
npm run start - (starts the react application on port 3000)
```
## Connecting the React Application To The Express JS Backend API

To ensure that the React application can communicate with the Express Backend we need to configure the API URL in the React Application. This URL is the URL with which the React App will make requests to the express applications.

To do this:

* Go to the root of the React Application and locate the file named "configParams.js"
* Modify the const value apiUrl to the Express application URL i.e.
```javascript
    export const apiUrl = "http://localhost:4100/";
```

Once completed the React application should be able to send requests to the express app without issues.

# General High-Level Overview of The Application Architecture

![architecture jumga](https://i.ibb.co/GxZyH6m/uml-for-flutterwave.jpg)

# Modifying The .env on The Express JS Application

The .env file can be found at the root of the express application and contains some predefined values necessary for the express application to work as intended.

# Setting Up NGROK for Handling Callback and Redirects From Flutterwave Payments API

Ngrok is a free, secure tool that helps to expose local development servers to the internet. This tool is how our local express application will receive information from Flutterwave during the completion and verification of payments.

To set up Ngrok:

* Download the application for your PC and Unzip it in any folder of your choice - https://dashboard.ngrok.com/get-started/setup
* Navigate to the folder where Ngrok was unzipped into, start up a terminal and run the following command:
```sh
        ngrok http -host-header="localhost:[port]" [port]
```
In this case, it'll be:
```sh
        ngrok http -host-header="localhost:4100" 4100
```
The URL to be used is the URL for the Express JS application which should be running on port 4100.

Ngrok will create a secure subdomain for your application that will make it accessible on the internet for a period that should be sufficient for the testing process.

![ngrok view](https://i.ibb.co/dr2z7pw/ngrok.jpg)

Copy the forwarding address as it'll be needed to configure the express application to receive requests from Flutterwave. From the screenshot, the address shall be:

https://730d651261a1.ngrok.io  (The HTTPS link is preferred as it is SSL encrypted)

# Configure Express JS to receive Callbacks Using The Ngrok URL

Locate the .env file located in the root of the Express application and modify the last two config values (baseUrl and redirectUrl) to the ngrok URL i.e.
```sh
    ##the redirect url using ngrok
    baseUrl=https://730d651261a1.ngrok.io
    redirectUrl=https://730d651261a1.ngrok.io/orders/payment
```
Once this is done, stop and restart the Express server with the following commands to reload the .env file.

* Ctrl + C to stop the running express application
```bash 
      npm run start - to restart the stopped application
```
Now we are set to start testing the application.

# Creating Accounts

There are four types of accounts that can be created on Jumga:

* Merchant Accounts
* User Accounts
* Admin Accounts
* Dispatch Rider Accounts

The sign-up page displays a form that lets you fill in the required registration details. The required details are:

* Username,
* Email
* Password
* Account Number
* Bank Name
* Country
* Account Type

Note: Flutterwave only allows Access Bank accounts with account numbers within the following range (0690000031 - 0690000051) to process payments on the sandbox/test environment. Hence, while registering a new account please use an account number within the expected ranges (0690000031 - 0690000051).

These are the available account numbers as the ones below this range have been used to seed the application with merchants, riders, and users.

Also, while you can choose any bank of your choice during the registration process, the application auto-assigns Access Bank to your account so that it can be used to test the payment API successfully.

Once you click on the Register Button, the app performs two operations:

1. Provisions a Jumga account for you on the Jumga platform with the information stored on the Jumga Mongo DB database depending on the account type chosen during registration

2. Creates a sub-account for you on Flutterwave under the Jumga shop (Flutterwave account). Via this account merchants and dispatch riders can receive their payments. The subaccount id and Keys are retrieved and stored on the Jumga Platform to be used during payment processing. This is possible through the Flutterwave SubAccount API that supports creating, updating, accessing, and deletion of subaccounts via API requests.

Once the account registration is complete you can begin to access the customized mini-dashboard depending on your account type - if you are registered as a User, Admin, or Dispatch Rider.

# Registration Fee For Merchants:

Merchant accounts are required to pay a 20 USD Registration Fee to use the platform. For this reason, while registered merchants can log in to their account on Jumga, they'll be unable to view or access their dashboard until they make the payment of $20 to Jumga.

The process is as follows:

* The payment process is initiated by clicking the "Pay Fee" button which sends the payment request details to the Express JS application.
* The Express App promptly dispatches the request to Flutterwave to generate a secure payment link using the Flutterwave standard payment API.
* Once this link is received, the Express App returns the link as a response to the react application that upon receipt opens the link to show the Flutterwave payment modal.
* You can use the following Test Card information to complete the payment:

```python
        Card number: 5531 8866 5214 2950
        
        CVV: 564
        
        Expiry: 09/32
        
        Pin: 3310
        
        OTP: 12345
```

* Once the payment is successful, Flutterwave sends a GET request with the payment information to the specified redirect URL (ngrok URL)
* The Express Application receives the details of the payment and sends a request to Flutterwave transaction verification Endpoint to validate that the transaction was completed without errors.

Once verified, the Merchant account is set to active and they can begin adding products to their store.

# Assigning Merchants to Dispatch Riders

Merchants can choose a Dispatch Rider from the drop-down menu at the top right corner of their dashboard. All available dispatch riders are shown on the list and a merchant can choose to subscribe to their services for deliveries.

Please note that only merchants that have configured a Dispatch Rider for their services can add products to their account. Hence, to test the application, there is a need to create Dispatch Riders first to ensure there is one available for merchants signing up for Jumga services.

# Creating Products

Merchants can create products by filling out the product form. The form requests for product name, description, price, currency, delivery fee, and optionally a product photo. Each merchant can create as many products as they choose and delete or remove them at will too. These products will appear on the Jumga Home Page for users or customers to buy.

# Transaction Dashboard

A mini transaction report dashboard is available for all registered account types to monitor their transactions and purchases on Jumga

## For Admins

The dashboard shows all transactions carried out on Jumga by the merchants, users, and dispatchers. Admins also see all riders and merchants on the platform and have the power to delete them from the Jumga platform.

## For Merchants

The dashboard shows all their product sales, the amount, and currencies. They can view their products and Rider details on the dashboard too.

For Riders: The dashboard shows all their deliveries as well as the cost and commissions. They also see all the merchants attached to their services on their dashboard too.

## For Users

It shows all their purchases and orders on the platform as well as their user details.

## Account Limitations

Merchant, Rider, and Admin accounts cannot order or make purchases from Jumga with their accounts. Only users and guests can make purchases and orders on Jumga.

## About The Guest Account

Guest accounts are accounts that are not registered but are interested in making purchases on Jumga. They can buy single products directly from the Jumga store.

They can also add items to their locally persisted carts and purchase them at a later date. They however do not have a transaction dashboard as they don't have a full customer relationship with Jumga.

## User Accounts

User/Customer accounts allow customers to have a complete relationship with Jumga. They can purchase directly from Jumga using their registration information. They also have a transaction dashboard and order history feature.

# Payment Split Between Merchants, Dispatchers, and Jumga

Given the challenge's requirement, for every product X with a delivery fee Y:

* The Merchant gets 97.5% of the product X sale price
* Jumga gets 2.75% of the product X sale price
* The Dispatch Rider gets 80% of the delivery price Y
* Jumga also gets 20% of the delivery price Y

This ratio is also used to create subaccounts to ensure that all merchant accounts receive 97.5% of the product price and Rider accounts receive 80% of the delivery price.

# Payment Processing Categories

For Flutterwave payments, the process is the same. The only changes are the transaction request body. The general Flutterwave payment process follows this flow:

* Gather the payment information: customer info, amount, currency, etc
* Make a POST request to the flutterwave payments endpoint and retrieve a secure payment link
* Open the link in a browser and input valid card details to make the payment.
* Flutterwave sends the transaction information to your configured redirect URL
* Using the transaction information received verify the payment using the flutterwave payment verification endpoint
* Once payment is verified, allow access to the value the user paid for.

However, in the development of this mini-project, there was a need to categorize the payments into two broad classes:

1. Single Product Direct Payment
2. Cart Items/Multiple Product Payment

## Single Product Direct Payment

In this payment mode, users/guests view product information and proceed to make an order directly and immediately. Their payment request payload includes the product ID and quantity they intend to purchase.

The Express JS application does the job of fetching the product information including prices and delivery fees and using the split ratio stipulated in the project rules, splits the amount among merchants and riders respectively. All other platform fees are passed to the customer.

To generate the request payload, the express application fetches the merchant and dispatch rider associated with the merchants, retrieves their payment/subaccount keys, and generates a subaccount object with the amounts they are to receive using the flat_subaccount flutterwave payment scheme/transaction_charge_type.

Other information is stored in the meta and customer object and the request object is passed to the product payment handler that proceeds to initiate the transaction process. Once Flutterwave verifies the request body it generates the payment link which we use to complete and verify the payment.

Both Merchant and Rider are compensated according to the split ratio and not one cent more.

## Cart Items Multiple Payment

Since Jumga supports the addition of products to a cart, it follows that users should be able to buy and pay for all or a few items in the cart at once. This introduces a little complication in the generation of the request body, hence requiring a different approach to handling this type of payment for the following reasons:

* User may select multiple products from one merchant but we only want to credit the merchants'/riders' subaccounts in one go with the total of all the selected individual products
* Users may select multiple merchants and hence we may need to generate the subaccount objects for multiple merchants and riders
* Paying for multiple goods at once needs to be recorded as multiple orders as the products are rightfully different. This is required for consistency in reporting
* Generating an array of objects for the transaction meta instead of a simple flat transaction meta-object.

To solve these issues:

* The request body which consists of multiple products' id is iterated upon and their transaction details converted into a base64 string which we use as the meta.
* A list of all the subaccounts is taken and compressed to identify unique merchants and riders' subaccounts with each of them getting the total value of their split payments. I.e. if Merchant A owns two products in the order list, his subaccount appears only once in the payment info but with a total commission comprising of the individual commissions, he earns for the two products.

Once the request body is generated, the payment process can be initiated and completed. During the verification process, however, the transaction meta is deserialized from base64 encoded string to a JSON array identifying the individual orders and their details for storage and reporting purposes.

Merchants, Riders, and Users can view these transaction details as it concerns their accounts on their dashboards.

# Limitations

* Only orders that are of the same currency type can be processed as a group/multiple payments. This is due to the payment API that ties each payment cycle to one currency type. Hence products that are of different currencies will trigger a notification to the user to select only products with the same currency.
* The transaction charge type flat_subaccount was preferred over the split ratio option despite the latter offering lesser computational overhead because the split ratio was not applied on a subaccount level but rather on the total transaction amount. This made it impossible to accurately credit both merchant and dispatch riders in one payment processing cycle, unlike the flat_subaccount approach where each receiver is assigned a predetermined amount to be paid to their accounts.

# Conclusion

It was a lot of fun building this project, despite the distractions and commitments on the side and the January rush to accomplish a lot in a little time. The documentation is excellently put together. But there were a couple of gotchas that took a bit of trial and error to figure out - i.e. that the transaction meta-objects only accept a flat JSON file and would throw errors on encountering nested JSON files, etc.

Overall, I think the new version of the API is solidly put together and should be quite easy to understand and develop products with by all skill levels of developers.

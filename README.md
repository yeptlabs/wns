WNS.
========
##### NodeJS MVC Framework and HTTP Server based on the structure of the world's best PHP Framework: [Yii](http://yiiframework.com).


## Features

Resume in these words: `scalable, extendable, secure, customization, configurable, dynamic, smart, mvc, event, error, log, cache`

 - Ispired on **[Yii Framework](http://yiiframework.com)**
 - Build **high performance** applications
 - Full *classes*, *libraries*, *configurations*, *environment* **global and private customization**
 - *Model-View-Controller (MVC)* design pattern
 - **1 to MANY**. One *HTTP server* to *multiple servers* and *multiple applications*
 - Support **multiple domains** and **multiple subdomains**
 - Fully **event-driven**. Total event manipulation
 - Smart **template engine** and **customization**
 - Smart and powerful **cache system**
 - Complete **error handling** and **logging**
 - **Separated console and log** for each application and each server
 - Fully **scalable**
 - Fully **extendable**

## Installation

### @ Requirement

 * NodeJS v0.8.8 ([how to install](https://github.com/joyent/node))

### @ NPM mode

 Just type the following command:

     $ npm install https://github.com/yeptlabs/wnServer.git

### @ Git mode

 This mode requires the installation of `git`

     $ git clone https://github.com/yeptlabs/wnServer.git

 Then type:
 
     $ npm install

### @ Manual mode

 Just download the zip file on the top right and unzip somewhere.

## Quick start and play

 * The first step is to create a new application:
 
 Go to the folder where you downloaded the source of **webNode**

     $ node index.js newapp [domain/ip] [path to the project]

 Example:

     $ node index.js newapp 127.0.0.1 app/helloworld
   
 This will automatictally create a new application from the default inside that directory and bind the new application to the webNode loading configuration.

 * The second step is to start the **webNode server** and see running your new application
 
 On the **webNode** directory just type:

     $ node index.js
 
 And it's done! The **webNode server** will start runnning based on `config.json` configuration.

 * To view your application running just access:

     `http://[domain/ipp of the application]`

## Other information

 Soon.
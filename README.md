WebNode Server 
========

##### NodeJS MVC Framework and HTTP Server based on the structure of the world's best PHP Framework: [Yii](http://yiiframework.com).


## Features

 - Based on [Yii Framework](http://yiiframework.com).
 - Full classes, libraries, configurations, environment customization
 - Model-View-Controller (MVC) design pattern
 - HTTP Server to multiple applications
 - High performance applications with multiple domains and subdomains.
 - Smart template engine.

## Installation

### @ Requirement

 * NodeJS v0.8.8 ([how to install](https://github.com/joyent/node))

### @ Git mode

 This mode requires the installation of `git`

     $ git clone https://github.com/pedronasser/wnServer.git

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
WNS Framework.
========
##### NodeJS MVC Framework and HTTP Server inspired on the structure of the [world's best PHP Framework: Yii](http://yiiframework.com).


## Features

 - **NODEJS** - `Builded on top of Node.js`
 - **INSPIRED** - `Ispired on Yii Framework`
 - **PERFORMANCE** - `Build high performance applications`
 - **PRIVATE-CUSTOMIZATION** - `Full classes, libraries, configurations, environment global and private customization`
 - **MVC** - `Model-View-Controller (MVC) design pattern`
 - **1:N** - `One HTTP server to multiple servers and multiple applications`
 - **DOMAIN** - `Support multiple domains and subdomains`
 - **EVENT** - `Fully event-driven. Total event manipulation`
 - **TEMPLATE** - `Smart template engine and customization`
 - **CACHE** - `Smart and powerful cache system`
 - **ERROR-LOG** - `Complete error handling and logging`
 - **CONSOLE** - `Private console to each application`
 - **WEBCONSOLE** - `A powerful private web console`
 - **SCALABLE** - `Fully scalable`
 - **EXTENDABLE** - `Fully extendable`
 - **ROUTABLE** - `Fully routable`
 - **MUCH-MORE** - `See yourself...`

## Installation

### @ Requirement

 * NodeJS v0.8.8 ([how to install](https://github.com/joyent/node))

### @ NPM mode

 Just type the following command:

     $ npm install https://github.com/yeptlabs/wns.git

### @ Git mode

 This mode requires the installation of `git`

     $ git clone https://github.com/yeptlabs/wns.git

 Then type:
 
     $ npm install

### @ Manual mode

 Just download the zip file on the top right and unzip somewhere.

## Quick start and play

 * The first step is to create a new application:
 
 Go to the folder where you downloaded the source of **WNS**, then execute:

		$ node index.js newapp [domain/ip] [path to the project]

 Example:

		$ node index.js newapp 127.0.0.1 app/helloworld
   
 This will automatictally create a new application using the default structure on the the directory and bind the new application on WNS server configuration.

 * The second step is to start the **WNS** and see running your new application
 
 On the **WNS** directory just type:

		$ node index.js
 
 And it's done! The **WNS** will start runnning based on `config.json` configuration.

 * To view your application running just access:

		http://[domain/ipp of the application]

## More informations

 See more at **http://wns.yept.net/**
WNS Framework @ v1.0.1a
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
 - **SCALABLE** - `Fully scalable`
 - **EXTENDABLE** - `Fully extendable`
 - **ROUTABLE** - `Fully routable`
 - **MUCH-MORE** - `See yourself...`

## Installation

### @ Requirement

 * NodeJS ([how to install](https://github.com/joyent/node))

### @ NPM mode

 Just type the following command:

     $ npm install wnserver

 Then move the `wnserver` folder from inside of the `node_modules` folder to where you want.

### @ Git mode

 This mode requires the installation of `git`

     $ git clone https://github.com/yeptlabs/wns.git

 Then to install all dependencies, just typing inside the wns folder:
 
     $ npm install -d

### @ Manual mode

 Just download the zip file and unzip somewhere.

## Quick start and play

 * The first step is to make a copy of `default-config.json` and `default-index.js` from inside the WNS folder, and rename it to `config.json` and `index.js`.
 * The second step is to edit the `config.json` file and configure your application. The server default configuration is something like this:
```js
// THIS IS THE DEFAULT SERVER CONFIGURATION
{
	"app": {
		"{APPLICATION NAME}": {
			"appPath": "{APPLICATION DIRECTORY PATH}",
			"domain": "127.0.0.1",
			"dbEngine": "{DATABASE ENGINE | CAN BE mysql or mongodb | NULL if no database engine}"
			// YOU CAN EDIT THE REST OF THE DATABASE CONFIGURATION EDITING THE FILE
			// config.json FROM INSIDE THE APPLICATION DIRECTORY THAT WILL BE CREATED.
		}
	},
	"components": {
		"http":
			"listen":[{SERVER PORT},"127.0.0.1"]
		}
	}
}
// {Those} are the important things that you need to edit.
```

* Then you just run the WNS server, just typing inside the wnserver directory:

 Example:
 
		$ node index
   
 This will automatically create a new application using the default application structure.


 * To view your application running just access:

		http://127.0.0.1:{SERVER PORT}/

## More information

 See more at **http://wns.yept.net/**

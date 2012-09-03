MWebNode Server 
========

A NodeJS MVC Framework and HTTP Server. Based on the structure of the world's best PHP Framework: [Yii](http://yiiframework.com).

## Features

## Installation

### @ Requirement

 - NodeJS v0.8.8 ([how to install](https://github.com/joyent/nodejs))

### @ NPM mode

 This mode requires to install the last version of NPM.

   $ npm install https://github.com/pedronasser/wnServer

### @ Manual mode

 This mode requires the installation of `git` or just download the source.

## Quick start and play

 The first step is to create a new application:
 
 - Go to the folder where you downloaded the source of webNode
 
   $ node index.js newapp [domain/ip] ##[path to the project]

   Example:
   
   $ node index.js newapp 127.0.0.1 app/helloworld
   
   This will automatictally create a new application from the default inside that directory and bind the new application to the webNode loading configuration.


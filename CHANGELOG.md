WNS ChangeLog
========

## v0.0.3 (breaking changes, unstable)

- General
 - FEATURE: New ORM ActiveRecord system working with MongoDB. MySQL dont have yet, for now just query. [pedronasser]
 - "return this;" added to many functions with no return; [pedronasser]
 - some minor bug fixes. [pedronasser]
 - changed loading messages and welcome message [pedronasser]
 - some changes in the loading system [pedronasser]
 - removed app directory from repository (no need, now wnServer generates it) [pedronasser]
 - changed default http port on wnHttp component class [pedronasser]
 - changed default configurations of application and server [pedronasser]

- wnApp class
 - New events; [pedronasser]
 - Moved createController and related functions to wnHttpRequest class. [pedronasser]
 - createRequest event bug fixes. [pedronasser]

- wnComponent class
 - exec() changed, now with changable context. [pedronasser]

- wnConsole class
 - all console's stdin is now sent to wnConsole.exec() [pedronasser]

- wnServer class
 - fixed buildApplication() - application generator. [pedronasser]

- wnHttpRequest class
 - moved createController function. [pedronasser]
 - added some events. [pedronasser]
 - fixed flow of the request. [pedronasser]
 - fixed error handler. [pedronasser]

- DATABASE & ORM
 - change in db directory structure
 - new `wnDbQueryBuilder` class - represents the ORM integration
 - new `wnDbSchema` class - represents the schema structure to the DB connection
 - new `wnDbMongoQueryBuilder` class - represents the customization for mongoDB.
 - new `wnDbMysqlQuerybuilder` class - represents the customization for mySQL.
 - new `wnDbMongoSchema` class - represents the customization for mongoDB.
 - new `wnDbMysqlSchema` class - represents the customization for mySQL.
 - fixed `wnMongoDataObject` - now it uses the Mongoose driver.
 - added some CRUD functions on the `wnMongoDataObject`.
 - fixed `wnMysqlDataObject`
 - new `wnActiveRecord` class - main ORM structure.
 - fixed `wnDataObject` class - event e connect problems.
 - fixed and adds inside `wnDbConnection` class - to bring the ORM format.
 - new `wnDbQuery` class - represents the structure of any query.
 - new `wnDbQueryBuilder` class - components that build a query (wnDbQuery); 

- wnWebCompress class.
 - new Class that handles the http response compression. [pedronasser]
 - soon this class will be outside the wns source. will become a separeted package. [pedronasser]

- WNS BIN
 - chmod fix

## v0.0.12 ALPHA
- fixed **wnModule** module's path setting [pedronasser]
- fixed **wnHttp** application redirection and creation of two events (open and release) [pedronasser]
- bin file fix and new feature of creating a new server anywhere [pedronasser]
- removed default-index.js [pedronasser]
- readme changes [pedronasser]
- some **wnInit** changes. [pedronasser]

## v0.0.11 ALPHA
- new test loading system with 4 tests, for now [pedronasser]
- readme changes, all info now on the website [pedronasser]
- `source` directory renamed to `src` [pedronasser]
- many bug fixes [pedronasser]
- included project on travis-ci.org [pedronasser]

## v0.0.1 ALPHA

- Multi database engine support [pedronasser]
- Change of module's load/ready system. [pedronasser]
- Creation of default index.js and config.json files [pedronasser]
- DB integration on default app. [pedronasser]
- Automatic API documentation engine [pedronasser]
- Creation of MongoDB and mySQL dataobject. [pedronasser]
- Exec() function on wnComponent class [pedronasser]
- Console shell command exec in wnConsole context. [pedronasser]
WNS ChangeLog
========

## v0.0.5

- General
 - New class build/compilation system (> performance) [pedronasser]
 - New http benchmark. [pedronasser]
 - Fixes and changes on tests. [pedronasser]
 - Changes to remove HTTP/MVC classes from the core package. [pedronasser]
 - many bug fixes [pedronasser]

- wnComponent
 - some functions changes [pedronasser]

- wnModule
 - some functions changes. [pedronasser]

- wnConsole
 - fixed build server system. [pedronasser]
 - added some default events. [pedronasser]

- wnServer
 - Removed listen function on init(); [pedronasser]
 - added some default events. [pedronasser]

- wnApp
 - Moved createRequest from application to wnHttp. [pedronasser]

- wnHttp
 - Moved createRequest from application to wnHttp. [pedronasser]
 - Module attaching system. [pedronasser]
 - New httpRequest events. [pedronasser]
 - Some httpRequest changes. [pedronasser]

- wnController
 - new action resolve function. [pedronasser]

- wnCacheControl
 - new http header/chaching control system. [pedronasser]

- wnWebCompress
 - new http data compress. [pedronasser]

- wnUrlManager
 - Changes on addRules() [pedronasser]
 - Changes on process() [pedronasser]

- Mongo Support
 - Added `query` and `count` [pedronasser]
 - Added getCollectionName() [pedronasser]

## v0.0.4

- Genaral
 - Removed 'var self=this;' from every class in WNS. (now var self is automatically defined);

- wnModule class
 - Fixed model and script loading/preparation.

- wnDbMongoQueryBuilder class
 - Fixed lowercase bug in the collection name.
 - New COUNT and QUERY function

- wnMongoDataObject class
 - New COUNT and QUERY private functions
 - Fixed mongo driver configuration.
 - Added collection name on Mongoose.model(). It was setting a different collection name.

- wnActiveRecord
 - 'Find' events
 - New COUNT and QUERY functions.

- Test
 - Added 'appDirectory' to test server config.

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

- wnModule class.
 - Changed IMPORT system. - Now everything is imported the same way [pedronasser]
 - Fixed script preparation. [pedronasser]

- wnComponent class
 - exec() changed, now with changable context. [pedronasser]

- wnConsole class
 - all console's stdin is now sent to wnConsole.exec() [pedronasser]
 - fixed buildServer() - write wrong path [pedronasser]

- wnServer class
 - buildApplication() - new application generator. [pedronasser]

- wnHttpRequest class
 - moved createController function. [pedronasser]
 - added some events. [pedronasser]
 - fixed flow of the request. [pedronasser]
 - fixed error handler. [pedronasser]

- DATABASE & ORM
 - change in db directory structure
 - new `wnDbQueryBuilder` class - represents the ORM integration [pedronasser]
 - new `wnDbSchema` class - represents the schema structure to the DB connection [pedronasser]
 - new `wnDbMongoQueryBuilder` class - represents the customization for mongoDB. [pedronasser]
 - new `wnDbMysqlQuerybuilder` class - represents the customization for mySQL. [pedronasser]
 - new `wnDbMongoSchema` class - represents the customization for mongoDB. [pedronasser]
 - new `wnDbMysqlSchema` class - represents the customization for mySQL. [pedronasser]
 - fixed `wnMongoDataObject` - now it uses the Mongoose driver. [pedronasser] 
 - added some CRUD functions on the `wnMongoDataObject`. [pedronasser]
 - fixed `wnMysqlDataObject` [pedronasser]
 - new `wnActiveRecord` class - main ORM structure. [pedronasser]
 - fixed `wnDataObject` class - event e connect problems. [pedronasser]
 - fixed and adds inside `wnDbConnection` class - to bring the ORM format. [pedronasser]
 - new `wnDbQuery` class - represents the structure of any query. [pedronasser]
 - new `wnDbQueryBuilder` class - components that build a query (wnDbQuery); [pedronasser]

- wnWebCompress class.
 - new Class that handles the http response compression. [pedronasser]
 - soon this class will be outside the wns source. will become a separeted package. [pedronasser]

- WNS BIN
 - chmod fix [pedronasser]

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
[![WNS](http://dl.dropbox.com/u/21773527/WNS-Logo.png)](http://wns.yept.net)

## Welcome to WNS Middleware (v0.0.9) [![Build Status](https://travis-ci.org/yeptlabs/wns.png?branch=master)](https://travis-ci.org/yeptlabs/wns)

##### What's the idea?
To build your application/service, just installing packages, configuring as you like and extending **COMPONENTS** and **PACKAGES** (if you want).
You can easly integrate you application/service with any **Node.JS module**.

## Installation

    $ npm install -g wnserver

## Quick Start

#### Building your first SERVER

    $ wns --new myServer
    $ cd myServer

#### Building your first server's APP (using default template)

    $ wns --config set appDirectory apps/
    $ wns --app myApp

#### Running your application
    
Let's just install the HTTP server

    $ wnspm install http

And run it.

    $ node index

#### Installing packages to your SERVER/APP

Just go to the SERVER or APP folder and type:

    $ wnspm install [package]

Examples of packages: `http`, `mongo`, `winston`, `template`

## Oficial Packages

- **[HTTP](https://github.com/pedronasser/wns-http-package)**: Full http package
- **[MVC](https://github.com/pedronasser/wns-mvc-package)**: Classes for MVC application.
- **[DB](https://github.com/pedronasser/wns-db-package)**: Base classes for database integration
- **[MONGO](https://github.com/pedronasser/wns-mongo-package)**: Classes for MongoDB integration
- **[MYSQL](https://github.com/pedronasser/wns-mysql-package)**: Classes for MySQL integration
- **[TEMPLATE](https://github.com/pedronasser/wns-template-package)**: Classes for template system. (DustJS integration)
- **[WINSTON](https://github.com/pedronasser/wns-wiston-package)**: Classes for using Winston as log service.

For more packages, [search them here](https://npmjs.org/search?q=wns+package).

## Main Features

 - Component-based development
 - Class-based development
 - Full PACKAGE system
 - Full EVENT system
 - Easy UNIT TESTING

## Philosophy

- Intuitiveness
- Performance
- Speed
- Professional
- Security
- Modules and components
- Build as your like

## More information:

- About [LOOK HERE](http://wns.yept.net/)
- Cases [LOOK HERE](http://wns.yept.net/site/cases)
- Examples [LOOK HERE](http://wns.yept.net/site/examples)
- Community [LOOK HERE](http://wns.yept.net/site/community)
- API and Documentation [LOOK HERE](http://wns.yept.net/api/)
- FAQ [LOOK HERE](http://wns.yept.net/site/faq/)

## License MIT

Copyright (c) 2012- Pedro Nasser <pedronasser@yept.net>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom
the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

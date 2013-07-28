<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{view.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{self.desc}">
    <meta name="author" content="{app.author}">

    <!-- Le styles -->
    <link href="/css/bootstrap.min.css" rel="stylesheet">
    <style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
    </style>
    <link href="/css/bootstrap-responsive.min.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="/js/html5shiv.js"></script>
    <![endif]-->

  </head>

  <body>

    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="brand" href="/">{app.title}</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
            	{#app.menu}{#.}
            		<li><a href="{link}">{name}</a></li>
            	{/.}{/app.menu}
            </ul>
            <form class="navbar-form pull-right">
              <input class="span2" type="text" placeholder="Email">{~s}
              <input class="span2" type="password" placeholder="Password">{~s}
              <button type="submit" class="btn">Sign in</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="container">

{content}

      <hr>

      <footer>
        <p style='text-align:right'>© {app.title} - Powered by <a href='http://wns.yept.net/'>WNS Middleware</p></p>
      </footer>

    </div>

    <script src="/js/jquery.js"></script>
    <script src="/js/bootstrap.min.js"></script>

  </body>
</html>

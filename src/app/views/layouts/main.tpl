<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{view.title}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{self.desc}">
    <link href="/css/bootstrap.css" rel="stylesheet">
    <link href="/css/app.css" rel="stylesheet">

    <!--[if lt IE 9]>
      <script src="/js/html5shiv.js"></script>
      <script src="/js/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/">{app.title}</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
          {#app.menu}{#.}
            <li><a href="{link}">{name}</a></li>
          {/.}{/app.menu}
          </ul>
          <form class="navbar-form navbar-right" action='/site/signin'>
            <div class="form-group">
              <input type="text" placeholder="Email" class="form-control">
            </div>
            <div class="form-group">
              <input type="password" placeholder="Password" class="form-control">
            </div>
            <button type="submit" class="btn btn-success">Sign in</button>
          </form>
        </div><!--/.navbar-collapse -->
      </div>
    </div>

    {content}

    <hr>

    <div class="container">
      <footer>
        <p style='text-align:right'>&copy; {app.title} - Powered by <b><a href='http://wns.yept.net/'>WNS Middleware</a></b></p>
      </footer>
    </div>

    <!-- Place where WNS will embed required scripts -->
    <[SCRIPT]>

  </body>
</html>
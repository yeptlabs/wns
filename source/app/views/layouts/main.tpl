<!doctype html>
<html lang="en"><head>

	<meta charset="utf-8" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title>{view.title}</title>
	<meta name="description" content="{view.description}" />
	<meta name="keywords" content="{view.keywords}" />
	<meta name="Robots" CONTENT="INDEX, FOLLOW" />

	<link rel="stylesheet" type="text/css" href="/css/style.css" media="all">
	<script type='text/javascript' src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>

</head>
	<body>

		<div id="body">

			<div id="header">
				<h1>{app.title}</h1>
				<ul id='menu'>
					<li><a href='/site/index'>Home</a></li>
				</ul>
			</div>
			
			<div id="main">
				<div id="content">
					{content}
				</div>
			</div>

			<div id="bottom">
				© {app.title} - All rights reserved
			</div>
	
		</div>
	</body>
</html>

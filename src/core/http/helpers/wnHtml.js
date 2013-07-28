/**
 * Source of the wnHtml class.
 * 
 * @author: Pedro Nasser
 * @link: http://wns.yept.net/
 * @license: http://yept.net/projects/wns/#license
 * @copyright: Copyright &copy; 2012 WNS
 */

/**
 * wnClass is a static class that provides a collection of helper methods for creating HTML views.
 * This is a port from Yii Framework (https://raw.github.com/yiisoft/yii/master/framework/web/helpers/CHtml.php)
 *
 * @author {AUTHOR}
 * @package package.http.helpers
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * WNS Class dependencies
	 */
	extend: ['wnComponent'],

	/**
	 * NPM dependencies
	 */
	dependencies: [],

	/**
	 * PRIVATE
	 */
	private: {},

	/**
	 * Public Variables
	 */
	public: {

		ID_PREFIX: 'wn',

		/**
		 * @var string the CSS class for displaying error summaries (see {@link errorSummary}).
		 */
		errorSummaryCss:'errorSummary',
		/**
		 * @var string the CSS class for displaying error messages (see {@link error}).
		 */
		errorMessageCss:'errorMessage',
		/**
		 * @var string the CSS class for highlighting error inputs. Form inputs will be appended
		 * with this CSS class if they have input errors.
		 */
		errorCss:'error',
		/**
		 * @var string the tag name for the error container tag. Defaults to 'div'.
		 * @since 1.1.13
		 */
		errorContainerTag:'div',
		/**
		 * @var string the CSS class for required labels. Defaults to 'required'.
		 * @see label
		 */
		requiredCss:'required',
		/**
		 * @var string the HTML code to be prepended to the required label.
		 * @see label
		 */
		beforeRequiredLabel:'',
		/**
		 * @var string the HTML code to be appended to the required label.
		 * @see label
		 */
		afterRequiredLabel:' <span class:"required">*</span>',
		/**
		 * @var integer the counter for generating automatic input field names.
		 */
		count:0,
		/**
		 * Sets the default style for attaching jQuery event handlers.
		 *
		 * If set to true (default), event handlers are delegated.
		 * Event handlers are attached to the document body and can process events
		 * from descendant elements that are added to the document at a later time.
		 *
		 * If set to false, event handlers are directly bound.
		 * Event handlers are attached directly to the DOM element, that must already exist
		 * on the page. Elements injected into the page at a later time will not be processed.
		 *
		 * You can override this setting for a particular element by setting the htmlOptions delegate attribute
		 * (see {@link clientChange}).
		 *
		 * For more information about attaching jQuery event handler see {@link http://api.jquery.com/on/}
		 * @since 1.1.9
		 * @see clientChange
		 */
		liveEvents:true,
		/**
		 * @var boolean whether to close single tags. Defaults to true. Can be set to false for HTML5.
		 * @since 1.1.13
		 */
		closeSingleTags:true,
		/**
		 * @var boolean whether to render special attributes value. Defaults to true. Can be set to false for HTML5.
		 * @since 1.1.13
		 */
		renderSpecialAttributesValue:true,

	},

	/**
	 * Extended methods
	 */
	methods: {

		/**
		 * Encodes special characters into HTML entities.
		 * The {@link CApplication::charset application charset} will be used for encoding.
		 * @param string $text data to be encoded
		 * @return string the encoded data
		 * @see http://www.php.net/manual/en/function.htmlspecialchars.php
		 */
		encode: function (text)
		{
			return this.getParent().html.encoder.htmlspecialchars(text,'ENT_QUOTES',this.getParent().charset);
		},

		/**
		 * Replace an array of strings with other array
		 * of string on the target string.
		 * @param array $find find
		 * @param array $replace replace
		 * @param string $string target string
		 * @return string result
		 */
		replaceArray: function(find, replace, string) {
		  var replaceString = string+'';
		  for (var i = 0; i < find.length; i++) {
		    replaceString = replaceString.replace(find[i], replace[i]);
		  }
		  return replaceString;
		},

		/**
		 * PHP's strstr() function in Javascript.
		 * @param string $haystack haystack
		 * @param string $haystack needle
		 * @param boolean $bool bool
		 * @return string result
		 */
		strstr: function(haystack, needle, bool) {
		  var pos = 0;

		  haystack += '';
		  pos = haystack.indexOf(needle);
		  if (pos == -1) {
		    return false;
		  } else {
		    if (bool) {
		      return haystack.substr(0, pos);
		    } else {
		      return haystack.slice(pos);
		    }
		  }
		},

		/**
		 * Decodes special HTML entities back to the corresponding characters.
		 * This is the opposite of {@link encode()}.
		 * @param string $text data to be decoded
		 * @return string the decoded data
		 * @see http://www.php.net/manual/en/function.htmlspecialchars-decode.php
		 * @since 1.1.8
		 */
		decode: function (text)
		{
			return this.getParent().html.encoder.htmlspecialchars_decode(text,'ENT_QUOTES');
		},

		/**
		 * Encodes special characters in an array of strings into HTML entities.
		 * Both the array keys and values will be encoded if needed.
		 * If a value is an array, this method will also encode it recursively.
		 * The {@link CApplication::charset application charset} will be used for encoding.
		 * @param array $data data to be encoded
		 * @return array the encoded data
		 * @see http://www.php.net/manual/en/function.htmlspecialchars.php
		 */
		encodeArray: function (data)
		{
			d=[];
			for (d in data)
			{
				var key = d, value = data[d];
				if('string' === typeof (key))
					key=this.getParent().html.encoder.htmlspecialchars(key,'ENT_QUOTES',this.getParent().charset);
				if('string' === typeof (value))
					value=this.getParent().html.encoder.htmlspecialchars(value,'ENT_QUOTES',this.getParent().charset);
				else if(Array.isArray(value))
					value=self.encodeArray(value);
				d[key]=value;
			}
			return d;
		},

		/**
		 * Generates an HTML element.
		 * @param string $tag the tag name
		 * @param object $htmlOptions the element attributes. The values will be HTML-encoded using {@link encode()}.
		 * If an 'encode' attribute is given and its value is false,
		 * the rest of the attribute values will NOT be HTML-encoded.
		 * Since version 1.1.5, attributes whose value is null will not be rendered.
		 * @param mixed $content the content to be enclosed between open and close element tags. It will not be HTML-encoded.
		 * If false, it means there is no body content.
		 * @param boolean $closeTag whether to generate the close tag.
		 * @return string the generated HTML element tag
		 */
		tag: function (tag,htmlOptions,content,closeTag)
		{
			var tag = tag!=undefined ? tag : '',
				content = content!=undefined ? content : false,
				closeTag = closeTag!=undefined ? closeTag : true;
			html='<' + tag + self.renderAttributes(htmlOptions||{});
			if(content===false)
				return closeTag && self.closeSingleTags ? html+' />' : html+'>';
			else
				return closeTag ? html+'>'+content+'</'+tag+'>' : html+'>'+content;
		},

		/**
		 * Generates an open HTML element.
		 * @param string $tag the tag name
		 * @param object $htmlOptions the element attributes. The values will be HTML-encoded using {@link encode()}.
		 * If an 'encode' attribute is given and its value is false,
		 * the rest of the attribute values will NOT be HTML-encoded.
		 * Since version 1.1.5, attributes whose value is null will not be rendered.
		 * @return string the generated HTML element tag
		 */
		openTag: function (tag,htmlOptions)
		{
			return '<' + tag + self.renderAttributes(htmlOptions) + '>';
		},

		/**
		 * Generates a close HTML element.
		 * @param string $tag the tag name
		 * @return string the generated HTML element tag
		 */
		closeTag: function (tag)
		{
			return '</'+tag+'>';
		},

		/**
		 * Encloses the given string within a CDATA tag.
		 * @param string $text the string to be enclosed
		 * @return string the CDATA tag with the enclosed content.
		 */
		cdata: function (text)
		{
			return '<![CDATA[' + text + ']]>';
		},

		/**
		 * Generates a meta tag that can be inserted in the head section of HTML page.
		 * @param string content content attribute of the meta tag
		 * @param string $name name attribute of the meta tag. If null, the attribute will not be generated
		 * @param string $httpEquiv http-equiv attribute of the meta tag. If null, the attribute will not be generated
		 * @param object $options other options in name-value pairs (e.g. 'scheme', 'lang')
		 * @return string the generated meta tag
		 */
		metaTag: function (content,name,httpEquiv,options)
		{
			var options = options || {};
			if(name!==null)
				options['name']=name;
			if(httpEquiv!==null)
				options['http-equiv']=httpEquiv;
			options['content']=content;
			return self.tag('meta',options);
		},

		/**
		 * Generates a link tag that can be inserted in the head section of HTML page.
		 * Do not confuse this method with {@link link()}. The latter generates a hyperlink.
		 * @param string $relation rel attribute of the link tag. If null, the attribute will not be generated.
		 * @param string $type type attribute of the link tag. If null, the attribute will not be generated.
		 * @param string $href href attribute of the link tag. If null, the attribute will not be generated.
		 * @param string $media media attribute of the link tag. If null, the attribute will not be generated.
		 * @param array $options other options in name-value pairs
		 * @return string the generated link tag
		 */
		linkTag: function (relation,type,href,media,options)
		{
			var options = options || {};
			if(relation!==null)
				options['rel']=relation||'';
			if(type!==null)
				options['type']=type||'';
			if(href!==null)
				options['href']=href||'';
			if(media!==null)
				options['media']=media||'';
			return self.tag('link',options);
		},

		/**
		 * Encloses the given CSS content with a CSS tag.
		 * @param string $text the CSS content
		 * @param string $media the media that this CSS should apply to.
		 * @return string the CSS properly enclosed
		 */
		css: function (text,media)
		{
			if(media!=='')
				media=' media="'+(media||'')+'"';
			return "<style type=\"text/css\""+media+">\n/*<![CDATA[*/\n"+(text||'')+"\n/*]]>*/\n</style>";
		},

		/**
		 * Registers a 'refresh' meta tag.
		 * This method can be invoked anywhere in a view. It will register a 'refresh'
		 * meta tag with {@link CClientScript} so that the page can be refreshed in
		 * the specified seconds.
		 * @param integer $seconds the number of seconds to wait before refreshing the page
		 * @param string $url the URL to which the page should be redirected to. If empty, it means the current page.
		 * @since 1.1.1
		 */
		refresh: function (seconds,url)
		{
			// content=seconds+"";
			// if(url&&url!=='')
			// 	content+=';url='+self.normalizeUrl(url+'');
			// this.getParent().clientScript.registerMetaTag(content,null,'refresh');
		},

		/**
		 * Links to the specified CSS file.
		 * @param string $url the CSS URL
		 * @param string $media the media that this CSS should apply to.
		 * @return string the CSS link.
		 */
		cssFile: function (url,media)
		{
			return self.linkTag('stylesheet','text/css',url,media!=='' ? media : null);
		},

		/**
		 * Encloses the given JavaScript within a script tag.
		 * @param string $text the JavaScript to be enclosed
		 * @param object $htmlOptions additional HTML attributes (see {@link tag})
		 * @return string the enclosed JavaScript
		 */
		script: function (text,htmlOptions)
		{
			defaultHtmlOptions={
				'type':'text/javascript',
			};
			htmlOptions=Object.extend(true,defaultHtmlOptions,htmlOptions);
			return self.tag('script',htmlOptions,"\n/*<![CDATA[*/\n"+(text||'')+"\n/*]]>*/\n");
		},

		/**
		 * Includes a JavaScript file.
		 * @param string $url URL for the JavaScript file
		 * @param object $htmlOptions additional HTML attributes (see {@link tag})
		 * @return string the JavaScript file tag
		 */
		scriptFile: function (url,htmlOptions)
		{
			defaultHtmlOptions={
				'type':'text/javascript',
				'src':url||''
			};
			htmlOptions=Object.extend(true,defaultHtmlOptions,htmlOptions);
			return self.tag('script',htmlOptions,'');
		},

		/**
		 * Generates an opening form tag.
		 * This is a shortcut to {@link beginForm}.
		 * @param mixed $action the form action URL (see {@link normalizeUrl} for details about this parameter.)
		 * @param string $method form method (e.g. post, get)
		 * @param object $htmlOptions additional HTML attributes (see {@link tag}).
		 * @return string the generated form tag.
		 */
		form: function (action,method,htmlOptions)
		{
			var method = method || 'post',
				action = action || '';
			return self.beginForm(action,method,htmlOptions);
		},

		/**
		 * Generates an opening form tag.
		 * Note, only the open tag is generated. A close tag should be placed manually
		 * at the end of the form.
		 * @param mixed $action the form action URL (see {@link normalizeUrl} for details about this parameter.)
		 * @param string $method form method (e.g. post, get)
		 * @param object $htmlOptions additional HTML attributes (see {@link tag}).
		 * @return string the generated form tag.
		 * @see endForm
		 */
		beginForm: function (action,method,htmlOptions)
		{
			var method = method || 'post',
				action = action || '',
				htmlOptions = htmlOptions || {};
			htmlOptions['action']=_url=self.normalizeUrl(action)+'';
			htmlOptions['method']=method;
			form=self.tag('form',htmlOptions,false,false);
			hiddens=[];
			if('get'!==method.toLowerCase() && (pos=_url.indexOf('?'))!==-1)
			{
				var explode = _url.substr(pos+1).split('&');
				for (e in explode)
				{
					var pair = explode[e];
					if((pos=pair.indexOf('='))!==-1)
						hiddens.push(self.hiddenField(decodeURIComponent(pair.substr(0,pos).replace(/\+/g, ' ')),decodeURIComponent(url.parse(pair.substr(pos+1), true).path.replace(/\+/g, ' ')),{'id':false}));
					else
						hiddens.push(self.hiddenField(decodeURIComponent(pair.replace(/\+/g, ' ')),'',{'id':false}));
				}
			}
			request=this.getParent().request;
			// if(request.enableCsrfValidation && !strcasecmp(method,'post'))
			// 	hiddens.push(self.hiddenField(request.csrfTokenName,request.getCsrfToken(),{'id':false}));
			// if(hiddens!==[])
			// 	form+="\n"+self.tag('div',{'style':'display:none'},hiddens.join("\n"));
			return form;
		},

		/**
		 * Generates a closing form tag.
		 * @return string the generated tag
		 * @see beginForm
		 */
		endForm: function ()
		{
			return '</form>';
		},

		/**
		 * Generates a stateful form tag.
		 * A stateful form tag is similar to {@link form} except that it renders an additional
		 * hidden field for storing persistent page states. You should use this method to generate
		 * a form tag if you want to access persistent page states when the form is submitted.
		 * @param mixed $action the form action URL (see {@link normalizeUrl} for details about this parameter.)
		 * @param string $method form method (e.g. post, get)
		 * @param object $htmlOptions additional HTML attributes (see {@link tag}).
		 * @return string the generated form tag.
		 */
		statefulForm: function (action,method,htmlOptions)
		{
			var method = method || 'post',
				action = action || '';
			return self.form(action,method,htmlOptions)+"\n"+
				self.tag('div',{'style':'display:none'},self.pageStateField(''));
		},

		// *
		//  * Generates a hidden field for storing persistent page states.
		//  * This method is internally used by {@link statefulForm}.
		//  * @param string $value the persistent page states in serialized format
		//  * @return string the generated hidden field
		 
		pageStateField: function (value)
		{
			return '<input type="hidden" name="'+this.getParent().controller.stateInputName+'" value="'+value+'" />';
		},

		/**
		 * Generates a hyperlink tag.
		 * @param string $text link body. It will NOT be HTML-encoded. Therefore you can pass in HTML code such as an image tag.
		 * @param mixed $url a URL or an action route that can be used to create a URL.
		 * See {@link normalizeUrl} for more details about how to specify this parameter.
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated hyperlink
		 * @see normalizeUrl
		 * @see clientChange
		 */
		link: function (text,url,htmlOptions)
		{
			var url = url || '#';
			if(url!=='')
				htmlOptions['href']=self.normalizeUrl(url);
			self.clientChange('click',htmlOptions);
			return self.tag('a',htmlOptions,text);
		},

		/**
		 * Generates a mailto link.
		 * @param string $text link body. It will NOT be HTML-encoded. Therefore you can pass in HTML code such as an image tag.
		 * @param string $email email address. If this is empty, the first parameter (link body) will be treated as the email address.
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated mailto link
		 * @see clientChange
		 */
		mailto: function (text,email,htmlOptions)
		{
			if(email==='')
				email=text;
			return self.link(text,'mailto:'+email,htmlOptions,true);
		},

		/**
		 * Generates an image tag.
		 * @param string $src the image URL
		 * @param string $alt the alternative text display
		 * @param object $htmlOptions additional HTML attributes (see {@link tag}).
		 * @return string the generated image tag
		 */
		image: function (src,alt,htmlOptions)
		{
			htmlOptions['src']=src;
			htmlOptions['alt']=alt||'';
			return self.tag('img',htmlOptions);
		},

		/**
		 * Generates a button.
		 * @param string $label the button label
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated button tag
		 * @see clientChange
		 */
		button: function (label,htmlOptions)
		{
			var label = label||'button';
			if(undefined === (htmlOptions['name']))
			{
				if(htmlOptions.name !== undefined)
					htmlOptions.name=self.ID_PREFIX+self.count++;
			}
			if(undefined === (htmlOptions['type']))
				htmlOptions['type']='button';
			if(undefined === (htmlOptions['value']))
				htmlOptions['value']=label;
			self.clientChange('click',htmlOptions);
			return self.tag('input',htmlOptions);
		},

		/**
		 * Generates a button using HTML button tag.
		 * This method is similar to {@link button} except that it generates a 'button'
		 * tag instead of 'input' tag.
		 * @param string $label the button label. Note that this value will be directly inserted in the button element
		 * without being HTML-encoded.
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated button tag
		 * @see clientChange
		 */
		htmlButton: function (label,htmlOptions)
		{
			var label = label||'button';
			if(undefined === (htmlOptions['name']))
				htmlOptions['name']=self.ID_PREFIX+self.count++;
			if(undefined === (htmlOptions['type']))
				htmlOptions['type']='button';
			self.clientChange('click',htmlOptions);
			return self.tag('button',htmlOptions,label);
		},

		/**
		 * Generates a submit button.
		 * @param string $label the button label
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated button tag
		 * @see clientChange
		 */
		submitButton: function (label,htmlOptions)
		{
			var label = label||'submit';
			htmlOptions['type']='submit';
			return self.button(label,htmlOptions);
		},

		/**
		 * Generates a reset button.
		 * @param string $label the button label
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated button tag
		 * @see clientChange
		 */
		resetButton: function (label,htmlOptions)
		{
			var label = label||'reset';
			htmlOptions['type']='reset';
			return self.button(label,htmlOptions);
		},

		/**
		 * Generates an image submit button.
		 * @param string $src the image URL
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated button tag
		 * @see clientChange
		 */
		imageButton: function (src,htmlOptions)
		{
			htmlOptions['src']=src||'';
			htmlOptions['type']='image';
			return self.button('submit',htmlOptions);
		},

		/**
		 * Generates a link submit button.
		 * @param string $label the button label
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated button tag
		 * @see clientChange
		 */
		linkButton: function (label,htmlOptions)
		{
			var label = label||'submit';
			if(undefined === (htmlOptions['submit']))
				htmlOptions['submit']=(undefined !== htmlOptions['href']) ? htmlOptions['href'] : '';
			return self.link(label,'#',htmlOptions);
		},

		/**
		 * Generates a label tag.
		 * @param string $label label text. Note, you should HTML-encode the text if needed.
		 * @param string $for the ID of the HTML element that this label is associated with.
		 * If this is false, the 'for' attribute for the label tag will not be rendered.
		 * @param object $htmlOptions additional HTML attributes.
		 * The following HTML option is recognized:
		 * <ul>
		 * <li>required: if this is set and is true, the label will be styled
		 * with CSS class 'required' (customizable with self.$requiredCss),
		 * and be decorated with {@link self.beforeRequiredLabel} and
		 * {@link self.afterRequiredLabel}.</li>
		 * </ul>
		 * @return string the generated label tag
		 */
		label: function (label,_for,htmlOptions)
		{
			if(_for===false)
				delete (htmlOptions['for']);
			else
				htmlOptions['for']=_for;
			if('undefined' === typeof (htmlOptions['required']))
			{
				if(htmlOptions['required'])
				{
					if('undefined' === typeof (htmlOptions['class']))
						htmlOptions['class']+=' '+self.requiredCss;
					else
						htmlOptions['class']=self.requiredCss;
					label=self.beforeRequiredLabel.label.self.afterRequiredLabel;
				}
				delete (htmlOptions['required']);
			}
			return self.tag('label',htmlOptions,label);
		},

		/**
		 * Generates a text field input.
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see inputField
		 */
		textField: function (name,value,htmlOptions)
		{
			self.clientChange('change',htmlOptions);
			return self.inputField('text',name,value,htmlOptions);
		},

		/**
		 * Generates a number field input.
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see inputField
		 * @since 1.1.14
		 */
		numberField: function (name,value,htmlOptions)
		{
			self.clientChange('change',htmlOptions);
			return self.inputField('number',name,value,htmlOptions);
		},

		/**
		 * Generates a range field input.
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see inputField
		 * @since 1.1.14
		 */
		rangeField: function (name,value,htmlOptions)
		{
			self.clientChange('change',htmlOptions);
			return self.inputField('range',name,value,htmlOptions);
		},

		/**
		 * Generates a date field input.
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see inputField
		 * @since 1.1.14
		 */
		dateField: function (name,value,htmlOptions)
		{
			self.clientChange('change',htmlOptions);
			return self.inputField('date',name,value,htmlOptions);
		},

		/**
		 * Generates a time field input.
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see inputField
		 * @since 1.1.14
		 */
		timeField: function (name,value,htmlOptions)
		{
			self.clientChange('change',htmlOptions);
			return self.inputField('time',name,value,htmlOptions);
		},

		/**
		 * Generates an email field input.
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see inputField
		 * @since 1.1.14
		 */
		emailField: function (name,value,htmlOptions)
		{
			self.clientChange('change',htmlOptions);
			return self.inputField('email',name,value,htmlOptions);
		},

		/**
		 * Generates a telephone field input.
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see inputField
		 * @since 1.1.14
		 */
		telField: function (name,value,htmlOptions)
		{
			self.clientChange('change',htmlOptions);
			return self.inputField('tel',name,value,htmlOptions);
		},

		/**
		 * Generates a URL field input.
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see inputField
		 * @since 1.1.14
		 */
		urlField: function (name,value,htmlOptions)
		{
			self.clientChange('change',htmlOptions);
			return self.inputField('url',name,value,htmlOptions);
		},

		/**
		 * Generates a hidden input.
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes (see {@link tag}).
		 * @return string the generated input field
		 * @see inputField
		 */
		hiddenField: function (name,value,htmlOptions)
		{
			return self.inputField('hidden',name,value,htmlOptions);
		},

		/**
		 * Generates a password field input.
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see inputField
		 */
		passwordField: function (name,value,htmlOptions)
		{
			self.clientChange('change',htmlOptions);
			return self.inputField('password',name,value,htmlOptions);
		},

		/**
		 * Generates a file input.
		 * Note, you have to set the enclosing form's 'enctype' attribute to be 'multipart/form-data'.
		 * After the form is submitted, the uploaded file information can be obtained via $_FILES[$name] (see
		 * PHP documentation).
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes (see {@link tag}).
		 * @return string the generated input field
		 * @see inputField
		 */
		fileField: function (name,value,htmlOptions)
		{
			return self.inputField('file',name,value,htmlOptions);
		},

		/**
		 * Generates a text area input.
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated text area
		 * @see clientChange
		 * @see inputField
		 */
		textArea: function (name,value,htmlOptions)
		{
			var name = arguments[0] || '';
			var value = (typeof arguments[1]=='string'?arguments[1]:'');
			var htmlOptions = (typeof arguments[1]=='object'?arguments[1]:arguments[2]) || {};3
			htmlOptions['name']=name||'';
			if(undefined === (htmlOptions['id']))
				htmlOptions['id']=self.getIdByName(name);
			else if(htmlOptions['id']===false)
				delete (htmlOptions['id']);
			self.clientChange('change',htmlOptions);
			var tag = self.tag('textarea',htmlOptions,(undefined !== htmlOptions['encode'] && !htmlOptions['encode']) ? value : self.encode(value));
			return tag;
		},

		/**
		 * Generates a radio button.
		 * @param string $name the input name
		 * @param boolean $checked whether the radio button is checked
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * Since version 1.1.2, a special option named 'uncheckValue' is available that can be used to specify
		 * the value returned when the radio button is not checked. When set, a hidden field is rendered so that
		 * when the radio button is not checked, we can still obtain the posted uncheck value.
		 * If 'uncheckValue' is not set or set to NULL, the hidden field will not be rendered.
		 * @return string the generated radio button
		 * @see clientChange
		 * @see inputField
		 */
		radioButton: function (name,checked,htmlOptions)
		{
			if(checked)
				htmlOptions['checked']='checked';
			else
				delete (htmlOptions['checked']);
			value=(undefined !== htmlOptions['value']) ? htmlOptions['value'] : 1;
			self.clientChange('click',htmlOptions);

			if(htmlOptions.uncheckedValue!==undefined)
			{
				uncheck=htmlOptions['uncheckValue'];
				delete (htmlOptions['uncheckValue']);
			}
			else
				uncheck=null;

			if(uncheck!==null)
			{
				// add a hidden field so that if the radio button is not selected, it still submits a value
				if('undefined' === typeof (htmlOptions['id']) && htmlOptions['id']!==false)
					uncheckOptions={'id':self.ID_PREFIX+htmlOptions['id']};
				else
					uncheckOptions={'id':false};
				hidden=self.hiddenField(name,uncheck,uncheckOptions);
			}
			else
				hidden='';

			// add a hidden field so that if the radio button is not selected, it still submits a value
			return hidden + self.inputField('radio',name,value,htmlOptions);
		},

		/**
		 * Generates a check box.
		 * @param string $name the input name
		 * @param boolean $checked whether the check box is checked
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * Since version 1.1.2, a special option named 'uncheckValue' is available that can be used to specify
		 * the value returned when the checkbox is not checked. When set, a hidden field is rendered so that
		 * when the checkbox is not checked, we can still obtain the posted uncheck value.
		 * If 'uncheckValue' is not set or set to NULL, the hidden field will not be rendered.
		 * @return string the generated check box
		 * @see clientChange
		 * @see inputField
		 */
		checkBox: function (name,checked,htmlOptions)
		{
			if(checked)
				htmlOptions['checked']='checked';
			else
				delete (htmlOptions['checked']);
			value=(undefined !== htmlOptions['value']) ? htmlOptions['value'] : 1;
			self.clientChange('click',htmlOptions);

			if(htmlOptions.uncheckValue!==undefined)
			{
				uncheck=htmlOptions['uncheckValue'];
				delete (htmlOptions['uncheckValue']);
			}
			else
				uncheck=null;

			if(uncheck!==null)
			{
				// add a hidden field so that if the check box is not checked, it still submits a value
				if('undefined' === typeof (htmlOptions['id']) && htmlOptions['id']!==false)
					uncheckOptions={'id':self.ID_PREFIX+htmlOptions['id']};
				else
					uncheckOptions={'id':false};
				hidden=self.hiddenField(name,uncheck,uncheckOptions);
			}
			else
				hidden='';

			// add a hidden field so that if the check box is not checked, it still submits a value
			return hidden + self.inputField('checkbox',name,value,htmlOptions);
		},

		/**
		 * Generates a drop down list.
		 * @param string $name the input name
		 * @param string $select the selected value
		 * @param array $data data for generating the list options (value=>display).
		 * You may use {@link listData} to generate this data.
		 * Please refer to {@link listOptions} on how this data is used to generate the list options.
		 * Note, the values and labels will be automatically HTML-encoded by this method.
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are recognized. See {@link clientChange} and {@link tag} for more details.
		 * In addition, the following options are also supported specifically for dropdown list:
		 * <ul>
		 * <li>encode: boolean, specifies whether to encode the values. Defaults to true.</li>
		 * <li>prompt: string, specifies the prompt text shown as the first list option. Its value is empty. Note, the prompt text will NOT be HTML-encoded.</li>
		 * <li>empty: string, specifies the text corresponding to empty selection. Its value is empty.
		 * The 'empty' option can also be an array of value-label pairs.
		 * Each pair will be used to render a list option at the beginning. Note, the text label will NOT be HTML-encoded.</li>
		 * <li>options: array, specifies additional attributes for each OPTION tag.
		 *     The array keys must be the option values, and the array values are the extra
		 *     OPTION tag attributes in the name-value pairs. For example,
		 * <pre>
		 *     array(
		 *         'value1':array('disabled':true, 'label':'value 1'),
		 *         'value2':array('label':'value 2'),
		 *     );
		 * </pre>
		 * </li>
		 * </ul>
		 * Since 1.1.13, a special option named 'unselectValue' is available. It can be used to set the value
		 * that will be returned when no option is selected in multiple mode. When set, a hidden field is
		 * rendered so that if no option is selected in multiple mode, we can still obtain the posted
		 * unselect value. If 'unselectValue' is not set or set to NULL, the hidden field will not be rendered.
		 * @return string the generated drop down list
		 * @see clientChange
		 * @see inputField
		 * @see listData
		 */
		dropDownList: function (name,select,data,htmlOptions)
		{
			htmlOptions['name']=name;

			if(undefined === (htmlOptions['id']))
				htmlOptions['id']=self.getIdByName(name);
			else if(htmlOptions['id']===false)
				delete (htmlOptions['id']);

			self.clientChange('change',htmlOptions);
			options="\n"+self.listOptions(select,data,htmlOptions);
			hidden='';

			if(!self.getParent().html.encoder.isEmpty(htmlOptions['multiple']))
			{
				if(substr(htmlOptions['name'],-2)!=='[]')
					htmlOptions['name']+='[]';

				if('undefined' === typeof (htmlOptions['unselectValue']))
				{
					hiddenOptions=(undefined !== htmlOptions['id']) ? {'id':self.ID_PREFIX+htmlOptions['id']} : {'id':false};
					hidden=self.hiddenField(substr(htmlOptions['name'],0,-2),htmlOptions['unselectValue'],hiddenOptions);
					delete (htmlOptions['unselectValue']);
				}
			}
			// add a hidden field so that if the option is not selected, it still submits a value
			return hidden + self.tag('select',htmlOptions,options);
		},

		/**
		 * Generates a list box.
		 * @param string $name the input name
		 * @param mixed $select the selected value(s). This can be either a string for single selection or an array for multiple selections.
		 * @param array $data data for generating the list options (value=>display)
		 * You may use {@link listData} to generate this data.
		 * Please refer to {@link listOptions} on how this data is used to generate the list options.
		 * Note, the values and labels will be automatically HTML-encoded by this method.
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized. See {@link clientChange} and {@link tag} for more details.
		 * In addition, the following options are also supported specifically for list box:
		 * <ul>
		 * <li>encode: boolean, specifies whether to encode the values. Defaults to true.</li>
		 * <li>prompt: string, specifies the prompt text shown as the first list option. Its value is empty. Note, the prompt text will NOT be HTML-encoded.</li>
		 * <li>empty: string, specifies the text corresponding to empty selection. Its value is empty.
		 * The 'empty' option can also be an array of value-label pairs.
		 * Each pair will be used to render a list option at the beginning. Note, the text label will NOT be HTML-encoded.</li>
		 * <li>options: array, specifies additional attributes for each OPTION tag.
		 *     The array keys must be the option values, and the array values are the extra
		 *     OPTION tag attributes in the name-value pairs. For example,
		 * <pre>
		 *     array(
		 *         'value1':array('disabled':true, 'label':'value 1'),
		 *         'value2':array('label':'value 2'),
		 *     );
		 * </pre>
		 * </li>
		 * </ul>
		 * @return string the generated list box
		 * @see clientChange
		 * @see inputField
		 * @see listData
		 */
		listBox: function (name,select,data,htmlOptions)
		{
			if(undefined === (htmlOptions['size']))
				htmlOptions['size']=4;
			if(!self.getParent().html.encoder.isEmpty(htmlOptions['multiple']))
			{
				if(substr(name,-2)!=='[]')
					name+='[]';
			}
			return self.dropDownList(name,select,data,htmlOptions);
		},

		/**
		 * Generates a check box list.
		 * A check box list allows multiple selection, like {@link listBox}.
		 * As a result, the corresponding POST value is an array.
		 * @param string $name name of the check box list. You can use this name to retrieve
		 * the selected value(s) once the form is submitted.
		 * @param mixed $select selection of the check boxes. This can be either a string
		 * for single selection or an array for multiple selections.
		 * @param array $data value-label pairs used to generate the check box list.
		 * Note, the values will be automatically HTML-encoded, while the labels will not.
		 * @param object $htmlOptions additional HTML options. The options will be applied to
		 * each checkbox input. The following special options are recognized:
		 * <ul>
		 * <li>template: string, specifies how each checkbox is rendered. Defaults
		 * to "{input} {label}", where "{input}" will be replaced by the generated
		 * check box input tag while "{label}" be replaced by the corresponding check box label,
		 * {beginLabel} will be replaced by &lt;label&gt; with labelOptions, {labelTitle} will be replaced
		 * by the corresponding check box label title and {endLabel} will be replaced by &lt;/label&gt;</li>
		 * <li>separator: string, specifies the string that separates the generated check boxes.</li>
		 * <li>checkAll: string, specifies the label for the "check all" checkbox.
		 * If this option is specified, a 'check all' checkbox will be displayed. Clicking on
		 * this checkbox will cause all checkboxes checked or unchecked.</li>
		 * <li>checkAllLast: boolean, specifies whether the 'check all' checkbox should be
		 * displayed at the end of the checkbox list. If this option is not set (default)
		 * or is false, the 'check all' checkbox will be displayed at the beginning of
		 * the checkbox list.</li>
		 * <li>labelOptions: array, specifies the additional HTML attributes to be rendered
		 * for every label tag in the list.</li>
		 * <li>container: string, specifies the checkboxes enclosing tag. Defaults to 'span'.
		 * If the value is an empty string, no enclosing tag will be generated</li>
		 * <li>baseID: string, specifies the base ID prefix to be used for checkboxes in the list.
		 * This option is available since version 1.1.13.</li>
		 * </ul>
		 * @return string the generated check box list
		 */
		checkBoxList: function (name,select,data,htmlOptions)
		{
			template=(undefined !== htmlOptions['template'])?htmlOptions['template']:'{input} {label}';
			separator=(undefined !== htmlOptions['separator'])?htmlOptions['separator']:"<br/>\n";
			container=(undefined !== htmlOptions['container'])?htmlOptions['container']:'span';
			delete (htmlOptions['template'],htmlOptions['separator'],htmlOptions['container']);

			if(substr(name,-2)!=='[]')
				name+='[]';

			if('undefined' === typeof (htmlOptions['checkAll']))
			{
				checkAllLabel=htmlOptions['checkAll'];
				checkAllLast=(undefined !== htmlOptions['checkAllLast']) && htmlOptions['checkAllLast'];
			}
			delete (htmlOptions['checkAll'],htmlOptions['checkAllLast']);

			labelOptions=(undefined !== htmlOptions['labelOptions'])?htmlOptions['labelOptions']:{};
			delete (htmlOptions['labelOptions']);

			items=[];
			baseID=(undefined !== htmlOptions['baseID']) ? htmlOptions['baseID'] : self.getIdByName(name);
			delete (htmlOptions['baseID']);
			id=0;
			checkAll=true;

			for(d in data)
			{
				var value=d, labelTitle=data[d]
				checked=!Array.isArray(select) && !strcmp(value,select) || Array.isArray(select) && in_array(value,select);
				checkAll=checkAll && checked;
				htmlOptions['value']=value;
				htmlOptions['id']=baseID+'_'+id++;
				option=self.checkBox(name,checked,htmlOptions);
				beginLabel=self.openTag('label',labelOptions);
				label=self.label(labelTitle,htmlOptions['id'],labelOptions);
				endLabel=self.closeTag('label');
				items.push(self.strtr(template,{
					'{input}':option,
					'{beginLabel}':beginLabel,
					'{label}':label,
					'{labelTitle}':labelTitle,
					'{endLabel}':endLabel,
				}));
			}

			if('undefined' === typeof (checkAllLabel))
			{
				htmlOptions['value']=1;
				htmlOptions['id']=id=baseID+'_all';
				option=self.checkBox(id,checkAll,htmlOptions);
				beginLabel=self.openTag('label',labelOptions);
				label=self.label(checkAllLabel,id,labelOptions);
				endLabel=self.closeTag('label');
				item=self.strtr(template,{
					'{input}':option,
					'{beginLabel}':beginLabel,
					'{label}':label,
					'{labelTitle}':checkAllLabel,
					'{endLabel}':endLabel,
				});
				if(checkAllLast)
					items.push(item);
				else
					items.unshift(item)
				name=self.strtr(name,{'[':'\\[',']':'\\]'});
				var js="\n";
				js+="		jQuery('#$id').click(function() {\n";
				js+="		jQuery(\"input[name='$name']\").prop('checked', this.checked);\n";
				js+="	});\n";
				js+="	jQuery(\"input[name='$name']\").click(function() {\n";
				js+="		jQuery('#$id').prop('checked', !jQuery(\"input[name='$name']:not(:checked)\").length);\n";
				js+="	});\n";
				js+="	jQuery('#$id').prop('checked', !jQuery(\"input[name='$name']:not(:checked)\").length);";
				cs=this.getParent().getClientScript();
				cs.registerCoreScript('jquery');
				cs.registerScript(id,js);
			}

			if(self.getParent().html.encoder.isEmpty(container))
				return implode(separator,items);
			else
				return self.tag(container,{'id':baseID},implode(separator,items));
		},

		/**
		 * Generates a radio button list.
		 * A radio button list is like a {@link checkBoxList check box list}, except that
		 * it only allows single selection.
		 * @param string $name name of the radio button list. You can use this name to retrieve
		 * the selected value(s) once the form is submitted.
		 * @param string $select selection of the radio buttons.
		 * @param array $data value-label pairs used to generate the radio button list.
		 * Note, the values will be automatically HTML-encoded, while the labels will not.
		 * @param object $htmlOptions additional HTML options. The options will be applied to
		 * each radio button input. The following special options are recognized:
		 * <ul>
		 * <li>template: string, specifies how each radio button is rendered. Defaults
		 * to "{input} {label}", where "{input}" will be replaced by the generated
		 * radio button input tag while "{label}" will be replaced by the corresponding radio button label,
		 * {beginLabel} will be replaced by &lt;label&gt; with labelOptions, {labelTitle} will be replaced
		 * by the corresponding radio button label title and {endLabel} will be replaced by &lt;/label&gt;</li>
		 * <li>separator: string, specifies the string that separates the generated radio buttons. Defaults to new line (<br/>).</li>
		 * <li>labelOptions: array, specifies the additional HTML attributes to be rendered
		 * for every label tag in the list.</li>
		 * <li>container: string, specifies the radio buttons enclosing tag. Defaults to 'span'.
		 * If the value is an empty string, no enclosing tag will be generated</li>
		 * <li>baseID: string, specifies the base ID prefix to be used for radio buttons in the list.
		 * This option is available since version 1.1.13.</li>
		 * <li>empty: string, specifies the text corresponding to empty selection. Its value is empty.
		 * The 'empty' option can also be an array of value-label pairs.
		 * Each pair will be used to render a radio button at the beginning. Note, the text label will NOT be HTML-encoded.
		 * This option is available since version 1.1.14.</li>
		 * </ul>
		 * @return string the generated radio button list
		 */
		radioButtonList: function (name,select,data,htmlOptions)
		{
			template=(undefined !== htmlOptions['template'])?htmlOptions['template']:'{input} {label}';
			separator=(undefined !== htmlOptions['separator'])?htmlOptions['separator']:"<br/>\n";
			container=(undefined !== htmlOptions['container'])?htmlOptions['container']:'span';
			delete (htmlOptions['template'],htmlOptions['separator'],htmlOptions['container']);

			labelOptions=(undefined !== htmlOptions['labelOptions'])?htmlOptions['labelOptions']:{};
			delete (htmlOptions['labelOptions']);

			if('undefined' === typeof (htmlOptions['empty']))
			{
				if(!Array.isArray(htmlOptions['empty']))
					htmlOptions['empty']={'':htmlOptions['empty']};
				data=Object.extend(htmlOptions['empty'],data);
				delete (htmlOptions['empty']);
			}

			items=[];
			baseID=(undefined !== htmlOptions['baseID']) ? htmlOptions['baseID'] : self.getIdByName(name);
			delete (htmlOptions['baseID']);
			id=0;
			for(d in data)
			{
				var value=d, labelTitle=data[d]
				checked=!strcmp(value,select);
				htmlOptions['value']=value;
				htmlOptions['id']=baseID+'_'+id++;
				option=self.radioButton(name,checked,htmlOptions);
				beginLabel=self.openTag('label',labelOptions);
				label=self.label(labelTitle,htmlOptions['id'],labelOptions);
				endLabel=self.closeTag('label');
				items.push(self.strtr(template,{
					'{input}':option,
					'{beginLabel}':beginLabel,
					'{label}':label,
					'{labelTitle}':labelTitle,
					'{endLabel}':endLabel,
				}));
			}
			if(self.getParent().html.encoder.isEmpty(container))
				return implode(separator,items);
			else
				return self.tag(container,{'id':baseID},implode(separator,items));
		},

		/**
		 * Generates a link that can initiate AJAX requests.
		 * @param string $text the link body (it will NOT be HTML-encoded.)
		 * @param mixed $url the URL for the AJAX request. If empty, it is assumed to be the current URL. See {@link normalizeUrl} for more details.
		 * @param object $ajaxOptions AJAX options (see {@link ajax})
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated link
		 * @see normalizeUrl
		 * @see ajax
		 */
		ajaxLink: function (text,url,ajaxOptions,htmlOptions)
		{
			if(undefined === (htmlOptions['href']))
				htmlOptions['href']='#';
			ajaxOptions['url']=url;
			htmlOptions['ajax']=ajaxOptions;
			self.clientChange('click',htmlOptions);
			return self.tag('a',htmlOptions,text);
		},

		/**
		 * Generates a push button that can initiate AJAX requests.
		 * @param string $label the button label
		 * @param mixed $url the URL for the AJAX request. If empty, it is assumed to be the current URL. See {@link normalizeUrl} for more details.
		 * @param object $ajaxOptions AJAX options (see {@link ajax})
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated button
		 */
		ajaxButton: function (label,url,ajaxOptions,htmlOptions)
		{
			ajaxOptions['url']=url;
			htmlOptions['ajax']=ajaxOptions;
			return self.button(label,htmlOptions);
		},

		/**
		 * Generates a push button that can submit the current form in POST method.
		 * @param string $label the button label
		 * @param mixed $url the URL for the AJAX request. If empty, it is assumed to be the current URL. See {@link normalizeUrl} for more details.
		 * @param object $ajaxOptions AJAX options (see {@link ajax})
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated button
		 */
		ajaxSubmitButton: function (label,url,ajaxOptions,htmlOptions)
		{
			ajaxOptions['type']='POST';
			htmlOptions['type']='submit';
			return self.ajaxButton(label,url,ajaxOptions,htmlOptions);
		},

		/**
		 * Generates the JavaScript that initiates an AJAX request.
		 * @param array $options AJAX options. The valid options are specified in the jQuery ajax documentation.
		 * The following special options are added for convenience:
		 * <ul>
		 * <li>update: string, specifies the selector whose HTML content should be replaced
		 *   by the AJAX request result.</li>
		 * <li>replace: string, specifies the selector whose target should be replaced
		 *   by the AJAX request result.</li>
		 * </ul>
		 * Note, if you specify the 'success' option, the above options will be ignored.
		 * @return string the generated JavaScript
		 * @see http://docs.jquery.com/Ajax/jQuery.ajax#options
		 */
		// ajax: function (options)
		// {
		// 	this.getParent().getClientScript().registerCoreScript('jquery');
		// 	if(undefined === (options['url']))
		// 		options['url']=new CJavaScriptExpression('location.href');
		// 	else
		// 		options['url']=self.normalizeUrl(options['url']);
		// 	if(undefined === (options['cache']))
		// 		options['cache']=false;
		// 	if(undefined === (options['data']) && (undefined !== options['type']))
		// 		options['data']=new CJavaScriptExpression('jQuery(this).parents("form").serialize()');
		// 	var list = ['beforeSend','complete','error','success'];
		// 	for(n in list)
		// 	{
		// 		var name = list[n];
		// 		if('undefined' === typeof (options[name]) && !(options[name] instanceof CJavaScriptExpression))
		// 			options[name]=new CJavaScriptExpression(options[name]);
		// 	}
		// 	if('undefined' === typeof (options['update']))
		// 	{
		// 		if(undefined === (options['success']))
		// 			options['success']=new CJavaScriptExpression('function(html){jQuery("'+options['update']+'").html(html)}');
		// 		delete (options['update']);
		// 	}
		// 	if('undefined' === typeof (options['replace']))
		// 	{
		// 		if(undefined === (options['success']))
		// 			options['success']=new CJavaScriptExpression('function(html){jQuery("'+options['replace']+'").replaceWith(html)}');
		// 		delete (options['replace']);
		// 	}
		// 	return 'jQuery.ajax('+CJavaScript::encode(options)+');';
		// },

		/**
		 * Generates the URL for the published assets.
		 * @param string $path the path of the asset to be published
		 * @param boolean $hashByName whether the published directory should be named as the hashed basename.
		 * If false, the name will be the hashed dirname of the path being published.
		 * Defaults to false. Set true if the path being published is shared among
		 * different extensions.
		 * @return string the asset URL
		 */
		asset: function (path,hashByName)
		{
			return this.getParent().getAssetManager().publish(path,hashByName||false);
		},

		/**
		 * Normalizes the input parameter to be a valid URL.
		 *
		 * If the input parameter is an empty string, the currently requested URL will be returned.
		 *
		 * If the input parameter is a non-empty string, it is treated as a valid URL and will
		 * be returned without any change.
		 *
		 * If the input parameter is an array, it is treated as a controller route and a list of
		 * GET parameters, and the {@link CController::createUrl} method will be invoked to
		 * create a URL. In this case, the first array element refers to the controller route,
		 * and the rest key-value pairs refer to the additional GET parameters for the URL.
		 * For example, <code>array('post/list', 'page':3)</code> may be used to generate the URL
		 * <code>/index.php?r=post/list&page=3</code>.
		 *
		 * @param mixed $url the parameter to be used to generate a valid URL
		 * @return string the normalized URL
		 */
		normalizeUrl: function (url)
		{
			// if(Array.isArray(url))
			// {
			// 	if('undefined' === typeof (url[0]))
			// 	{
			// 		if((c=this.getParent().controller)!==null)
			// 			url=c.createUrl(url[0],url.splice(1));
			// 		else
			// 			url=this.getParent().createUrl(url[0],url.splice(1));
			// 	}
			// 	else
			// 		url='';
			// }
			// return url==='' ? this.getParent().getUrl() : url;
			return url;
		},

		/**
		 * Generates an input HTML tag.
		 * This method generates an input HTML tag based on the given input name and value.
		 * @param string $type the input type (e.g. 'text', 'radio')
		 * @param string $name the input name
		 * @param string $value the input value
		 * @param object $htmlOptions additional HTML attributes for the HTML tag (see {@link tag}).
		 * @return string the generated input tag
		 */
		inputField: function (type,name,value,htmlOptions)
		{
			var htmlOptions = htmlOptions || {};
			htmlOptions['type']=type||'text';
			htmlOptions['value']=value||'';
			htmlOptions['name']=name||'';
			if(undefined === (htmlOptions['id']))
				htmlOptions['id']=self.getIdByName(name);
			else if(htmlOptions['id']===false)
				delete (htmlOptions['id']);
			return self.tag('input',htmlOptions);
		},

		/**
		 * Generates a label tag for a model attribute.
		 * The label text is the attribute label and the label is associated with
		 * the input for the attribute (see {@link CModel::getAttributeLabel}.
		 * If the attribute has input error, the label's CSS class will be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. The following special options are recognized:
		 * <ul>
		 * <li>required: if this is set and is true, the label will be styled
		 * with CSS class 'required' (customizable with self.$requiredCss),
		 * and be decorated with {@link self.beforeRequiredLabel} and
		 * {@link self.afterRequiredLabel}.</li>
		 * <li>label: this specifies the label to be displayed. If this is not set,
		 * {@link CModel::getAttributeLabel} will be called to get the label for display.
		 * If the label is specified as false, no label will be rendered.</li>
		 * </ul>
		 * @return string the generated label tag
		 */
		activeLabel: function (model,attribute,htmlOptions)
		{
			var htmlOptions = htmlOptions || {};
			if('undefined' !== typeof (htmlOptions['for']))
			{
				var _for=htmlOptions['for'];
				delete (htmlOptions['for']);
			}
			else
				var _for=self.getIdByName(self.resolveName(model,attribute));
			if('undefined' !== typeof (htmlOptions['label']))
			{
				if((label=htmlOptions['label'])===false)
					return '';
				delete (htmlOptions['label']);
			}
			else
				label=model.getAttributeLabel(attribute);
			if(model.hasErrors(attribute))
				self.addErrorCss(htmlOptions);
			return self.label(label,_for,htmlOptions);
		},

		/**
		 * Generates a label tag for a model attribute.
		 * This is an enhanced version of {@link activeLabel}. It will render additional
		 * CSS class and mark when the attribute is required.
		 * In particular, it calls {@link CModel::isAttributeRequired} to determine
		 * if the attribute is required.
		 * If so, it will add a CSS class {@link self.requiredCss} to the label,
		 * and decorate the label with {@link self.beforeRequiredLabel} and
		 * {@link self.afterRequiredLabel}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes.
		 * @return string the generated label tag
		 */
		activeLabelEx: function (model,attribute,htmlOptions)
		{
			realAttribute=attribute;
			self.resolveName(model,attribute); // strip off square brackets if any
			htmlOptions['required']=model.isAttributeRequired(attribute);
			return self.activeLabel(model,realAttribute,htmlOptions);
		},

		/**
		 * Generates a text field input for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see activeInputField
		 */
		activeTextField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			self.clientChange('change',htmlOptions);
			return self.activeInputField('text',model,attribute,htmlOptions);
		},

		/**
		 * Generates a search field input for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see activeInputField
		 * @since 1.1.14
		 */
		activeSearchField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			self.clientChange('change',htmlOptions);
			return self.activeInputField('search',model,attribute,htmlOptions);
		},

		/**
		 * Generates a url field input for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see activeInputField
		 * @since 1.1.11
		 */
		activeUrlField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			self.clientChange('change',htmlOptions);
			return self.activeInputField('url',model,attribute,htmlOptions);
		},

		/**
		 * Generates an email field input for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see activeInputField
		 * @since 1.1.11
		 */
		activeEmailField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			self.clientChange('change',htmlOptions);
			return self.activeInputField('email',model,attribute,htmlOptions);
		},

		/**
		 * Generates a number field input for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see activeInputField
		 * @since 1.1.11
		 */
		activeNumberField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			self.clientChange('change',htmlOptions);
			return self.activeInputField('number',model,attribute,htmlOptions);
		},

		/**
		 * Generates a range field input for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see activeInputField
		 * @since 1.1.11
		 */
		activeRangeField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			self.clientChange('change',htmlOptions);
			return self.activeInputField('range',model,attribute,htmlOptions);
		},

		/**
		 * Generates a date field input for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see activeInputField
		 * @since 1.1.11
		 */
		activeDateField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			self.clientChange('change',htmlOptions);
			return self.activeInputField('date',model,attribute,htmlOptions);
		},

		/**
		 * Generates a time field input for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see activeInputField
		 * @since 1.1.14
		 */
		activeTimeField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			self.clientChange('change',htmlOptions);
			return self.activeInputField('time',model,attribute,htmlOptions);
		},

		/**
		 * Generates a telephone field input for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see activeInputField
		 * @since 1.1.14
		 */
		activeTelField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			self.clientChange('change',htmlOptions);
			return self.activeInputField('tel',model,attribute,htmlOptions);
		},

		/**
		 * Generates a hidden input for a model attribute.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes.
		 * @return string the generated input field
		 * @see activeInputField
		 */
		activeHiddenField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			return self.activeInputField('hidden',model,attribute,htmlOptions);
		},

		/**
		 * Generates a password field input for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated input field
		 * @see clientChange
		 * @see activeInputField
		 */
		activePasswordField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			self.clientChange('change',htmlOptions);
			return self.activeInputField('password',model,attribute,htmlOptions);
		},

		/**
		 * Generates a text area input for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * @return string the generated text area
		 * @see clientChange
		 */
		activeTextArea: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			self.clientChange('change',htmlOptions);
			if(model.hasErrors(attribute))
				self.addErrorCss(htmlOptions);
			if('undefined' === typeof (htmlOptions['value']))
			{
				text=htmlOptions['value'];
				delete (htmlOptions['value']);
			}
			else
				text=self.resolveValue(model,attribute);
			return self.tag('textarea',htmlOptions,(undefined !== htmlOptions['encode']) && !htmlOptions['encode'] ? text : self.encode(text));
		},

		/**
		 * Generates a file input for a model attribute.
		 * Note, you have to set the enclosing form's 'enctype' attribute to be 'multipart/form-data'.
		 * After the form is submitted, the uploaded file information can be obtained via $_FILES (see
		 * PHP documentation).
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes (see {@link tag}).
		 * @return string the generated input field
		 * @see activeInputField
		 */
		activeFileField: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			// add a hidden field so that if a model only has a file field, we can
			// still use (undefined !== _POST[$modelClass]) to detect if the input is submitted
			hiddenOptions=(undefined !== htmlOptions['id']) ? {'id':self.ID_PREFIX+htmlOptions['id']} : {'id':false};
			return self.hiddenField(htmlOptions['name'],'',hiddenOptions)
				+ self.activeInputField('file',model,attribute,htmlOptions);
		},

		/**
		 * Generates a radio button for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * A special option named 'uncheckValue' is available that can be used to specify
		 * the value returned when the radio button is not checked. By default, this value is '0'.
		 * Internally, a hidden field is rendered so that when the radio button is not checked,
		 * we can still obtain the posted uncheck value.
		 * If 'uncheckValue' is set as NULL, the hidden field will not be rendered.
		 * @return string the generated radio button
		 * @see clientChange
		 * @see activeInputField
		 */
		activeRadioButton: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			if(undefined === (htmlOptions['value']))
				htmlOptions['value']=1;
			if(undefined === (htmlOptions['checked']) && self.resolveValue(model,attribute)==htmlOptions['value'])
				htmlOptions['checked']='checked';
			self.clientChange('click',htmlOptions);

			if(htmlOptions.uncheckValue!==undefined)
			{
				uncheck=htmlOptions['uncheckValue'];
				delete (htmlOptions['uncheckValue']);
			}
			else
				uncheck='0';

			hiddenOptions=(undefined !== htmlOptions['id']) ? {'id':self.ID_PREFIX+htmlOptions['id']} : {'id':false};
			hidden=uncheck!==null ? self.hiddenField(htmlOptions['name'],uncheck,hiddenOptions) : '';

			// add a hidden field so that if the radio button is not selected, it still submits a value
			return hidden + self.activeInputField('radio',model,attribute,htmlOptions);
		},

		/**
		 * Generates a check box for a model attribute.
		 * The attribute is assumed to take either true or false value.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are also recognized (see {@link clientChange} and {@link tag} for more details.)
		 * A special option named 'uncheckValue' is available that can be used to specify
		 * the value returned when the checkbox is not checked. By default, this value is '0'.
		 * Internally, a hidden field is rendered so that when the checkbox is not checked,
		 * we can still obtain the posted uncheck value.
		 * If 'uncheckValue' is set as NULL, the hidden field will not be rendered.
		 * @return string the generated check box
		 * @see clientChange
		 * @see activeInputField
		 */
		activeCheckBox: function (model,attribute,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			if(undefined === (htmlOptions['value']))
				htmlOptions['value']=1;
			if(undefined === (htmlOptions['checked']) && self.resolveValue(model,attribute)==htmlOptions['value'])
				htmlOptions['checked']='checked';
			self.clientChange('click',htmlOptions);

			if(htmlOptions.uncheckValue!==undefined)
			{
				uncheck=htmlOptions['uncheckValue'];
				delete (htmlOptions['uncheckValue']);
			}
			else
				uncheck='0';

			hiddenOptions=(undefined !== htmlOptions['id']) ? {'id':self.ID_PREFIX+htmlOptions['id']} : {'id':false};
			hidden=uncheck!==null ? self.hiddenField(htmlOptions['name'],uncheck,hiddenOptions) : '';

			return hidden + self.activeInputField('checkbox',model,attribute,htmlOptions);
		},

		/**
		 * Generates a drop down list for a model attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param array $data data for generating the list options (value=>display)
		 * You may use {@link listData} to generate this data.
		 * Please refer to {@link listOptions} on how this data is used to generate the list options.
		 * Note, the values and labels will be automatically HTML-encoded by this method.
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are recognized. See {@link clientChange} and {@link tag} for more details.
		 * In addition, the following options are also supported:
		 * <ul>
		 * <li>encode: boolean, specifies whether to encode the values. Defaults to true.</li>
		 * <li>prompt: string, specifies the prompt text shown as the first list option. Its value is empty.  Note, the prompt text will NOT be HTML-encoded.</li>
		 * <li>empty: string, specifies the text corresponding to empty selection. Its value is empty.
		 * The 'empty' option can also be an array of value-label pairs.
		 * Each pair will be used to render a list option at the beginning. Note, the text label will NOT be HTML-encoded.</li>
		 * <li>options: array, specifies additional attributes for each OPTION tag.
		 *     The array keys must be the option values, and the array values are the extra
		 *     OPTION tag attributes in the name-value pairs. For example,
		 * <pre>
		 *     array(
		 *         'value1':array('disabled':true, 'label':'value 1'),
		 *         'value2':array('label':'value 2'),
		 *     );
		 * </pre>
		 * </li>
		 * </ul>
		 * Since 1.1.13, a special option named 'unselectValue' is available. It can be used to set the value
		 * that will be returned when no option is selected in multiple mode. When set, a hidden field is
		 * rendered so that if no option is selected in multiple mode, we can still obtain the posted
		 * unselect value. If 'unselectValue' is not set or set to NULL, the hidden field will not be rendered.
		 * @return string the generated drop down list
		 * @see clientChange
		 * @see listData
		 */
		activeDropDownList: function (model,attribute,data,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			selection=self.resolveValue(model,attribute);
			options="\n"+self.listOptions(selection,data,htmlOptions);
			self.clientChange('change',htmlOptions);

			if(model.hasErrors(attribute))
				self.addErrorCss(htmlOptions);

			hidden='';
			if(!self.getParent().html.encoder.isEmpty(htmlOptions['multiple']))
			{
				if(substr(htmlOptions['name'],-2)!=='[]')
					htmlOptions['name']+='[]';

				if('undefined' === typeof (htmlOptions['unselectValue']))
				{
					hiddenOptions=(undefined !== htmlOptions['id']) ? {'id':self.ID_PREFIX+htmlOptions['id']} : {'id':false};
					hidden=self.hiddenField(substr(htmlOptions['name'],0,-2),htmlOptions['unselectValue'],hiddenOptions);
					delete (htmlOptions['unselectValue']);
				}
			}
			return hidden + self.tag('select',htmlOptions,options);
		},

		/**
		 * Generates a list box for a model attribute.
		 * The model attribute value is used as the selection.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param array $data data for generating the list options (value=>display)
		 * You may use {@link listData} to generate this data.
		 * Please refer to {@link listOptions} on how this data is used to generate the list options.
		 * Note, the values and labels will be automatically HTML-encoded by this method.
		 * @param object $htmlOptions additional HTML attributes. Besides normal HTML attributes, a few special
		 * attributes are recognized. See {@link clientChange} and {@link tag} for more details.
		 * In addition, the following options are also supported:
		 * <ul>
		 * <li>encode: boolean, specifies whether to encode the values. Defaults to true.</li>
		 * <li>prompt: string, specifies the prompt text shown as the first list option. Its value is empty. Note, the prompt text will NOT be HTML-encoded.</li>
		 * <li>empty: string, specifies the text corresponding to empty selection. Its value is empty.
		 * The 'empty' option can also be an array of value-label pairs.
		 * Each pair will be used to render a list option at the beginning. Note, the text label will NOT be HTML-encoded.</li>
		 * <li>options: array, specifies additional attributes for each OPTION tag.
		 *     The array keys must be the option values, and the array values are the extra
		 *     OPTION tag attributes in the name-value pairs. For example,
		 * <pre>
		 *     array(
		 *         'value1':array('disabled':true, 'label':'value 1'),
		 *         'value2':array('label':'value 2'),
		 *     );
		 * </pre>
		 * </li>
		 * </ul>
		 * @return string the generated list box
		 * @see clientChange
		 * @see listData
		 */
		activeListBox: function (model,attribute,data,htmlOptions)
		{
			if(undefined === (htmlOptions['size']))
				htmlOptions['size']=4;
			return self.activeDropDownList(model,attribute,data,htmlOptions);
		},

		/**
		 * Generates a check box list for a model attribute.
		 * The model attribute value is used as the selection.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * Note that a check box list allows multiple selection, like {@link listBox}.
		 * As a result, the corresponding POST value is an array. In case no selection
		 * is made, the corresponding POST value is an empty string.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param array $data value-label pairs used to generate the check box list.
		 * Note, the values will be automatically HTML-encoded, while the labels will not.
		 * @param object $htmlOptions additional HTML options. The options will be applied to
		 * each checkbox input. The following special options are recognized:
		 * <ul>
		 * <li>template: string, specifies how each checkbox is rendered. Defaults
		 * to "{input} {label}", where "{input}" will be replaced by the generated
		 * check box input tag while "{label}" will be replaced by the corresponding check box label.</li>
		 * <li>separator: string, specifies the string that separates the generated check boxes.</li>
		 * <li>checkAll: string, specifies the label for the "check all" checkbox.
		 * If this option is specified, a 'check all' checkbox will be displayed. Clicking on
		 * this checkbox will cause all checkboxes checked or unchecked.</li>
		 * <li>checkAllLast: boolean, specifies whether the 'check all' checkbox should be
		 * displayed at the end of the checkbox list. If this option is not set (default)
		 * or is false, the 'check all' checkbox will be displayed at the beginning of
		 * the checkbox list.</li>
		 * <li>encode: boolean, specifies whether to encode HTML-encode tag attributes and values. Defaults to true.</li>
		 * </ul>
		 * Since 1.1.7, a special option named 'uncheckValue' is available. It can be used to set the value
		 * that will be returned when the checkbox is not checked. By default, this value is ''.
		 * Internally, a hidden field is rendered so when the checkbox is not checked, we can still
		 * obtain the value. If 'uncheckValue' is set to NULL, there will be no hidden field rendered.
		 * @return string the generated check box list
		 * @see checkBoxList
		 */
		activeCheckBoxList: function (model,attribute,data,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			selection=self.resolveValue(model,attribute);
			if(model.hasErrors(attribute))
				self.addErrorCss(htmlOptions);
			name=htmlOptions['name'];
			delete (htmlOptions['name']);

			if(htmlOptions.uncheckValue!==undefined)
			{
				uncheck=htmlOptions['uncheckValue'];
				delete (htmlOptions['uncheckValue']);
			}
			else
				uncheck='';

			hiddenOptions=(undefined !== htmlOptions['id']) ? {'id':self.ID_PREFIX+htmlOptions['id']} : {'id':false};
			hidden=uncheck!==null ? self.hiddenField(name,uncheck,hiddenOptions) : '';

			return hidden + self.checkBoxList(name,selection,data,htmlOptions);
		},

		/**
		 * Generates a radio button list for a model attribute.
		 * The model attribute value is used as the selection.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param array $data value-label pairs used to generate the radio button list.
		 * Note, the values will be automatically HTML-encoded, while the labels will not.
		 * @param object $htmlOptions additional HTML options. The options will be applied to
		 * each radio button input. The following special options are recognized:
		 * <ul>
		 * <li>template: string, specifies how each radio button is rendered. Defaults
		 * to "{input} {label}", where "{input}" will be replaced by the generated
		 * radio button input tag while "{label}" will be replaced by the corresponding radio button label.</li>
		 * <li>separator: string, specifies the string that separates the generated radio buttons. Defaults to new line (<br/>).</li>
		 * <li>encode: boolean, specifies whether to encode HTML-encode tag attributes and values. Defaults to true.</li>
		 * </ul>
		 * Since version 1.1.7, a special option named 'uncheckValue' is available that can be used to specify the value
		 * returned when the radio button is not checked. By default, this value is ''. Internally, a hidden field is
		 * rendered so that when the radio button is not checked, we can still obtain the posted uncheck value.
		 * If 'uncheckValue' is set as NULL, the hidden field will not be rendered.
		 * @return string the generated radio button list
		 * @see radioButtonList
		 */
		activeRadioButtonList: function (model,attribute,data,htmlOptions)
		{
			self.resolveNameID(model,attribute,htmlOptions);
			selection=self.resolveValue(model,attribute);
			if(model.hasErrors(attribute))
				self.addErrorCss(htmlOptions);
			name=htmlOptions['name'];
			delete (htmlOptions['name']);

			if(htmlOptions.uncheckValue!==undefined)
			{
				uncheck=htmlOptions['uncheckValue'];
				delete (htmlOptions['uncheckValue']);
			}
			else
				uncheck='';

			hiddenOptions=(undefined !== htmlOptions['id']) ? {'id':self.ID_PREFIX+htmlOptions['id']} : {'id':false};
			hidden=uncheck!==null ? self.hiddenField(name,uncheck,hiddenOptions) : '';

			return hidden + self.radioButtonList(name,selection,data,htmlOptions);
		},

		/**
		 * Displays a summary of validation errors for one or several models.
		 * @param mixed $model the models whose input errors are to be displayed. This can be either
		 * a single model or an array of models.
		 * @param string $header a piece of HTML code that appears in front of the errors
		 * @param string $footer a piece of HTML code that appears at the end of the errors
		 * @param object $htmlOptions additional HTML attributes to be rendered in the container div tag.
		 * A special option named 'firstError' is recognized, which when set true, will
		 * make the error summary to show only the first error message of each attribute.
		 * If this is not set or is false, all error messages will be displayed.
		 * This option has been available since version 1.1.3.
		 * @return string the error summary. Empty if no errors are found.
		 * @see CModel::getErrors
		 * @see errorSummaryCss
		 */
		errorSummary: function (model,header,footer,htmlOptions)
		{
			content='';
			if(!Array.isArray(model))
				model=[model];
			if('undefined' === typeof (htmlOptions['firstError']))
			{
				firstError=htmlOptions['firstError'];
				delete (htmlOptions['firstError']);
			}
			else
				firstError=false;
			for(i in model)
			{
				var m=model[i];
				for(b in m.getErrors())
				{
					var errors = m.getErrors()[b];
					for(c in errors)
					{
						var error = errors[d];
						if(error!='')
							content+="<li>"+error+"</li>\n";
						if(firstError)
							break;
					}
				}
			}
			if(content!=='')
			{
				if(header===null)
					header='<p>'+'Please fix the following input errors:'+'</p>';
				if(undefined === (htmlOptions['class']))
					htmlOptions['class']=self.errorSummaryCss;
				return self.tag('div',htmlOptions,header+"\n<ul>\ncontent</ul>".footer);
			}
			else
				return '';
		},

		/**
		 * Displays the first validation error for a model attribute.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute name
		 * @param object $htmlOptions additional HTML attributes to be rendered in the container tag.
		 * @return string the error display. Empty if no errors are found.
		 * @see CModel::getErrors
		 * @see errorMessageCss
		 * @see $errorContainerTag
		 */
		error: function (model,attribute,htmlOptions)
		{
			self.resolveName(model,attribute); // turn [a][b]attr into attr
			error=model.getError(attribute);
			if(error!='')
			{
				if(undefined === (htmlOptions['class']))
					htmlOptions['class']=self.errorMessageCss;
				return self.tag(self.errorContainerTag,htmlOptions,error);
			}
			else
				return '';
		},

		/**
		 * Generates the data suitable for list-based HTML elements.
		 * The generated data can be used in {@link dropDownList}, {@link listBox}, {@link checkBoxList},
		 * {@link radioButtonList}, and their active-versions (such as {@link activeDropDownList}).
		 * Note, this method does not HTML-encode the generated data. You may call {@link encodeArray} to
		 * encode it if needed.
		 * Please refer to the {@link value} method on how to specify value field, text field and group field.
		 * You can also pass anonymous functions as second, third and fourth arguments which calculates
		 * text field value (PHP 5.3+ only) since 1.1.13. Your anonymous function should receive one argument,
		 * which is the model, the current &lt;option&gt; tag is generated from.
		 *
		 * <pre>
		 * self.listData(posts,'id',function(post) {
		 * 	return self.encode(post.title);
		 * });
		 * </pre>
		 *
		 * @param array $models a list of model objects. This parameter
		 * can also be an array of associative arrays (e.g. results of {@link CDbCommand::queryAll}).
		 * @param mixed $valueField the attribute name or anonymous function (PHP 5.3+) for list option values
		 * @param mixed $textField the attribute name or anonymous function (PHP 5.3+) for list option texts
		 * @param mixed $groupField the attribute name or anonymous function (PHP 5.3+) for list option group names. If empty, no group will be generated.
		 * @return array the list data that can be used in {@link dropDownList}, {@link listBox}, etc.
		 */
		listData: function (models,valueField,textField,groupField)
		{
			var groupField = groupField || '';
			listData=[];
			if(groupField==='')
			{
				for(m in models)
				{
					var model = models[m];
					value=self.value(model,valueField);
					text=self.value(model,textField);
					listData[value]=text;
				}
			}
			else
			{
				for(m in models)
				{
					var model = models[m];
					group=self.value(model,groupField);
					value=self.value(model,valueField);
					text=self.value(model,textField);
					if(group===null)
						listData[value]=text;
					else
						listData[group][value]=text;
				}
			}
			return listData;
		},

		/**
		 * Evaluates the value of the specified attribute for the given model.
		 * The attribute name can be given in a dot syntax. For example, if the attribute
		 * is "author.firstName", this method will return the value of "$model.author.firstName".
		 * A default value (passed as the last parameter) will be returned if the attribute does
		 * not exist or is broken in the middle (e.g. $model.author is null).
		 * The model can be either an object or an array. If the latter, the attribute is treated
		 * as a key of the array. For the example of "author.firstName", if would mean the array value
		 * "$model['author']['firstName']".
		 *
		 * Anonymous function could also be used for attribute calculation since 1.1.13
		 * (attribute parameter; PHP 5.3+ only) as follows:
		 * <pre>
		 * $taskClosedSecondsAgo=self.value(closedTask,function(model) {
		 * 	return time()-$model.closed_at;
		 * });
		 * </pre>
		 * Your anonymous function should receive one argument, which is the model, the current
		 * value is calculated from. This feature could be used together with the {@link listData}.
		 * Please refer to its documentation for more details.
		 *
		 * @param mixed $model the model. This can be either an object or an array.
		 * @param mixed $attribute the attribute name (use dot to concatenate multiple attributes)
		 * or anonymous function (PHP 5.3+). Remember that functions created by "create_function"
		 * are not supported by this method. Also note that numeric value is meaningless when
		 * first parameter is object typed.
		 * @param mixed $defaultValue the default value to return when the attribute does not exist.
		 * @return mixed the attribute value.
		 */
		value: function (model,attribute,defaultValue)
		{
			if(!attribute)
			{
				var explode = attribute.split('.');
				for(e in explode)
				{
					var name = explode[e];
					if ('object' === typeof (model) && undefined !== model.getAttribute(name))
						model=model.getAttribute(name);
					else if (Array.isArray(model) && (undefined !== model.getAttribute(name)))
						model=model.getAttribute(name);
					else
						return defaultValue;
				}
			}
			else
				return attribute(model);

			return model;
		},

		/**
		 * Generates a valid HTML ID based on name.
		 * @param string name name from which to generate HTML ID
		 * @return string the ID generated based on name.
		 */
		getIdByName: function (name)
		{
			return this.replaceArray(['[]', '][', '[', ']', ' '], ['', '_', '_', '', '_'], name);
		},

		/**
		 * Generates input field ID for a model attribute.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @return string the generated input field ID
		 */
		activeId: function (model,attribute)
		{
			return self.getIdByName(self.activeName(model,attribute));
		},

		/**
		 * Generates input field name for a model attribute.
		 * Unlike {@link resolveName}, this method does NOT modify the attribute name.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @return string the generated input field name
		 */
		activeName: function (model,attribute)
		{
			a=attribute; // because the attribute name may be changed by resolveName
			return self.resolveName(model,a);
		},

		/**
		 * Generates an input HTML tag for a model attribute.
		 * This method generates an input HTML tag based on the given data model and attribute.
		 * If the attribute has input error, the input field's CSS class will
		 * be appended with {@link errorCss}.
		 * This enables highlighting the incorrect input.
		 * @param string $type the input type (e.g. 'text', 'radio')
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions additional HTML attributes for the HTML tag
		 * @return string the generated input tag
		 */
		activeInputField: function (type,model,attribute,htmlOptions)
		{
			htmlOptions['type']=type;
			if(type==='text' || type==='password')
			{
				// if(undefined === (htmlOptions['maxlength']))
				// {
				// 	var validators = model.getValidators(attribute);
				// 	for(v in validators)
				// 	{
				// 		var validator = validators[v];
				// 		if(validator instanceof CStringValidator && validator.max!==null)
				// 		{
				// 			htmlOptions['maxlength']=validator.max;
				// 			break;
				// 		}
				// 	}
				// }
				// else if(htmlOptions['maxlength']===false)
				// 	delete (htmlOptions['maxlength']);
			}

			if(type==='file')
				delete (htmlOptions['value']);
			else if(undefined === (htmlOptions['value']))
				htmlOptions['value']=self.resolveValue(model,attribute);
			if(model.hasErrors(attribute))
				self.addErrorCss(htmlOptions);
			return self.tag('input',htmlOptions);
		},

		/**
		 * Generates the list options.
		 * @param mixed $selection the selected value(s). This can be either a string for single selection or an array for multiple selections.
		 * @param array $listData the option data (see {@link listData})
		 * @param object $htmlOptions additional HTML attributes. The following two special attributes are recognized:
		 * <ul>
		 * <li>encode: boolean, specifies whether to encode the values. Defaults to true.</li>
		 * <li>prompt: string, specifies the prompt text shown as the first list option. Its value is empty. Note, the prompt text will NOT be HTML-encoded.</li>
		 * <li>empty: string, specifies the text corresponding to empty selection. Its value is empty.
		 * The 'empty' option can also be an array of value-label pairs.
		 * Each pair will be used to render a list option at the beginning. Note, the text label will NOT be HTML-encoded.</li>
		 * <li>options: array, specifies additional attributes for each OPTION tag.
		 *     The array keys must be the option values, and the array values are the extra
		 *     OPTION tag attributes in the name-value pairs. For example,
		 * <pre>
		 *     array(
		 *         'value1':array('disabled':true, 'label':'value 1'),
		 *         'value2':array('label':'value 2'),
		 *     );
		 * </pre>
		 * </li>
		 * <li>key: string, specifies the name of key attribute of the selection object(s).
		 * This is used when the selection is represented in terms of objects. In this case,
		 * the property named by the key option of the objects will be treated as the actual selection value.
		 * This option defaults to 'primaryKey', meaning using the 'primaryKey' property value of the objects in the selection.
		 * This option has been available since version 1.1.3.</li>
		 * </ul>
		 * @return string the generated list options
		 */
		listOptions: function (selection,listData,htmlOptions)
		{
			raw=(undefined !== htmlOptions['encode']) && !htmlOptions['encode'];
			content='';
			if('undefined' === typeof (htmlOptions['prompt']))
			{
				content+='<option value="">'+self.strtr(htmlOptions['prompt'],{'<':'&lt;', '>':'&gt;'})+"</option>\n";
				delete (htmlOptions['prompt']);
			}
			if('undefined' === typeof (htmlOptions['empty']))
			{
				if(!Array.isArray(htmlOptions['empty']))
					htmlOptions['empty']={'':htmlOptions['empty']};
				for(e in htmlOptions['empty'])
					var value = e, label = htmlOptions['empty'][e];
					content+='<option value="'+self.encode(value)+'">'+self.strtr(label,{'<':'&lt;', '>':'&gt;'})+"</option>\n";
				delete (htmlOptions['empty']);
			}

			if('undefined' === typeof (htmlOptions['options']))
			{
				options=htmlOptions['options'];
				delete (htmlOptions['options']);
			}
			else
				options={};

			key=(undefined !== htmlOptions['key']) ? htmlOptions['key'] : 'primaryKey';
			if(Array.isArray(selection))
			{
				for(s in selection)
				{
					var i = s, item = selection[s];
					if('object' === typeof (item))
						selection[i]=item.key;
				}
			}
			else if('object' === typeof (selection))
				selection=selection.key;

			for(l in listData)
			{
				var key = l, value = listData[l];
				if(Array.isArray(value))
				{
					content+='<optgroup label="'+(raw?key : self.encode(key))+"\">\n";
					dummy={'options':options};
					if('undefined' === typeof (htmlOptions['encode']))
						dummy['encode']=htmlOptions['encode'];
					content+=self.listOptions(selection,value,dummy);
					content+='</optgroup>'+"\n";
				}
				else
				{
					attributes={'value':''+key, 'encode':!raw};
					if(!Array.isArray(selection) && key !== selection || Array.isArray(selection) && in_array(key,selection))
						attributes['selected']='selected';
					if('undefined' === typeof (options[key]))
						attributes=Object.extend(attributes,options[key]);
					content+=self.tag('option',attributes,raw?''+value : self.encode(''+value))+"\n";
				}
			}

			delete (htmlOptions['key']);

			return content;
		},

		/**
		 * Generates the JavaScript with the specified client changes.
		 * @param string $event event name (without 'on')
		 * @param object $htmlOptions HTML attributes which may contain the following special attributes
		 * specifying the client change behaviors:
		 * <ul>
		 * <li>submit: string, specifies the URL to submit to. If the current element has a parent form, that form will be
		 * submitted, and if 'submit' is non-empty its value will replace the form's URL. If there is no parent form the
		 * data listed in 'params' will be submitted instead (via POST method), to the URL in 'submit' or the currently
		 * requested URL if 'submit' is empty. Please note that if the 'csrf' setting is true, the CSRF token will be
		 * included in the params too.</li>
		 * <li>params: array, name-value pairs that should be submitted together with the form. This is only used when 'submit' option is specified.</li>
		 * <li>csrf: boolean, whether a CSRF token should be automatically included in 'params' when {@link CHttpRequest::enableCsrfValidation} is true. Defaults to false.
		 * You may want to set this to be true if there is no enclosing form around this element.
		 * This option is meaningful only when 'submit' option is set.</li>
		 * <li>return: boolean, the return value of the javascript. Defaults to false, meaning that the execution of
		 * javascript would not cause the default behavior of the event.</li>
		 * <li>confirm: string, specifies the message that should show in a pop-up confirmation dialog.</li>
		 * <li>ajax: array, specifies the AJAX options (see {@link ajax}).</li>
		 * <li>live: boolean, whether the event handler should be delegated or directly bound.
		 * If not set, {@link liveEvents} will be used. This option has been available since version 1.1.11.</li>
		 * </ul>
		 * This parameter has been available since version 1.1.1.
		 */
		clientChange: function (event,htmlOptions)
		{
			// if(undefined === (htmlOptions['submit']) && undefined === (htmlOptions['confirm']) && undefined === (htmlOptions['ajax']))
			// 	return;

			// if('undefined' === typeof (htmlOptions['live']))
			// {
			// 	live=htmlOptions['live'];
			// 	delete (htmlOptions['live']);
			// }
			// else
			// 	live = self.liveEvents;

			// if('undefined' === typeof (htmlOptions['return']) && htmlOptions['return'])
			// 	return 'return true';
			// else
			// 	return 'return false';

			// if('undefined' === typeof (htmlOptions['on'+event]))
			// {
			// 	handler=trim(htmlOptions['on'+event],';')+';';
			// 	delete (htmlOptions['on'+event]);
			// }
			// else
			// 	handler='';

			// if('undefined' === typeof (htmlOptions['id']))
			// 	id=htmlOptions['id'];
			// else
			// 	id=htmlOptions['id']=(undefined !== htmlOptions['name'])?htmlOptions['name']:self.ID_PREFIX.self.count++;

			// cs=this.getParent().getClientScript();
			// cs.registerCoreScript('jquery');

			// if('undefined' === typeof (htmlOptions['submit']))
			// {
			// 	cs.registerCoreScript('yii');
			// 	request=this.getParent().getRequest();
			// 	if(request.enableCsrfValidation && (undefined !== htmlOptions['csrf']) && htmlOptions['csrf'])
			// 		htmlOptions['params'][request.csrfTokenName]=request.getCsrfToken();
			// 	if('undefined' === typeof (htmlOptions['params']))
			// 		params=CJavaScript::encode(htmlOptions['params']);
			// 	else
			// 		params='{}';
			// 	if(htmlOptions['submit']!=='')
			// 		url=CJavaScript::quote(self.normalizeUrl(htmlOptions['submit']));
			// 	else
			// 		url='';
			// 	handler+="jQuery.yii.submitForm(this,'url',params);{return};";
			// }

			// if('undefined' === typeof (htmlOptions['ajax']))
			// 	handler+=self.ajax(htmlOptions['ajax'])+"{return};";

			// if('undefined' === typeof (htmlOptions['confirm']))
			// {
			// 	confirm='confirm(\''+CJavaScript::quote(htmlOptions['confirm'])+'\')';
			// 	if(handler!=='')
			// 		handler="if(confirm) {"+handler+"} else return false;";
			// 	else
			// 		handler="return confirm;";
			// }

			// if(live)
			// 	cs.registerScript('Yii.CHtml.#' + id, "jQuery('body').on('event','#id',function(){{handler}});");
			// else
			// 	cs.registerScript('Yii.CHtml.#' + id, "jQuery('#id').on('event', function(){{handler}});");
			// delete (htmlOptions['params'],htmlOptions['submit'],htmlOptions['ajax'],htmlOptions['confirm'],htmlOptions['return'],htmlOptions['csrf']);
		},

		/**
		 * Generates input name and ID for a model attribute.
		 * This method will update the HTML options by setting appropriate 'name' and 'id' attributes.
		 * This method may also modify the attribute name if the name
		 * contains square brackets (mainly used in tabular input).
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @param object $htmlOptions the HTML options
		 */
		resolveNameID: function (model,attribute,htmlOptions)
		{
			if(undefined === (htmlOptions['name']))
				htmlOptions['name']=self.resolveName(model,attribute);
			if(undefined === (htmlOptions['id']))
				htmlOptions['id']=self.getIdByName(htmlOptions['name']);
			else if(htmlOptions['id']===false)
				delete (htmlOptions['id']);
		},

		/**
		 * Generates input name for a model attribute.
		 * Note, the attribute name may be modified after calling this method if the name
		 * contains square brackets (mainly used in tabular input) before the real attribute name.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute
		 * @return string the input name
		 */
		resolveName: function (model,attribute)
		{
			var attribute = attribute || '';
			if((pos=attribute.indexOf('['))!==-1)
			{
				if(pos!==0)  // e.g. name[a][b]
					return model.getClassName()+'['+attribute.substr(0,pos)+']'+attribute.substr(pos);
				if((pos=attribute.indexOf(']'))!==-1 && pos!==attribute.length-1)  // e.g. [a][b]name
				{
					sub=attribute.substr(0,pos+1);
					attribute=attribute.substr(pos+1);
					return model.getClassName()+'['+attribute+']';
				}
				if(preg_match('/\](\w+\[.*)/',attribute,matches))
				{
					name=model.getClassName()+'['+this.replaceArray(']','][',(this.strstr(attribute,{'][':']','[':']'})).replace(/\]$/g,''))+']';
					attribute=matches[1];
					return name;
				}
			}
			return model.getClassName()+'['+attribute+']';
		},

		/**
		 * Evaluates the attribute value of the model.
		 * This method can recognize the attribute name written in array format.
		 * For example, if the attribute name is 'name[a][b]', the value "$model.name['a']['b']" will be returned.
		 * @param CModel $model the data model
		 * @param string $attribute the attribute name
		 * @return mixed the attribute value
		 * @since 1.1.3
		 */
		resolveValue: function (model,attribute)
		{
			// if((pos=attribute.indexOf('['))!==-1)
			// {
			// 	// if(pos===0) // [a]name[b][c], should ignore [a]
			// 	// {
			// 	// 	if(preg_match('/\](\w+(\[.+)?)/',attribute,matches))
			// 	// 		attribute=matches[1]; // we get: name[b][c]
			// 	// 	if((pos=attribute.indexOf('['))===-1)
			// 	// 		return model.attribute;
			// 	// }
			// 	name=attribute.substr(0,pos);
			// 	value=model.name;
			// 	var explode = (attribute.substr(pos+1)).replace(/\s+$/g,'').split('][')
			// 	for(e in explode)
			// 	{
			// 		var id = explode[e];
			// 		if((Array.isArray(value)) && (undefined !== value[id]))
			// 			value=value[id];
			// 		else
			// 			return null;
			// 	}
			// 	return value;
			// }
			// else
			return model.getAttribute(attribute) || '';
		},

		/**
		 * Appends {@link errorCss} to the 'class' attribute.
		 * @param object $htmlOptions HTML options to be modified
		 */
		addErrorCss: function (htmlOptions)
		{
			if(self.getParent().html.encoder.isEmpty(self.errorCss))
				return;

			if('undefined' === typeof (htmlOptions['class']))
				htmlOptions['class']+=' '+self.errorCss;
			else
				htmlOptions['class']=self.errorCss;
		},

		/**
		 * Renders the HTML tag attributes.
		 * Since version 1.1.5, attributes whose value is null will not be rendered.
		 * Special attributes, such as 'checked', 'disabled', 'readonly', will be rendered
		 * properly based on their corresponding boolean value.
		 * @param object $htmlOptions attributes to be rendered
		 * @return string the rendering result
		 */
		renderAttributes: function (htmlOptions)
		{
			var specialAttributes={
				'async':1,
				'autofocus':1,
				'autoplay':1,
				'checked':1,
				'controls':1,
				'declare':1,
				'default':1,
				'defer':1,
				'disabled':1,
				'formnovalidate':1,
				'hidden':1,
				'ismap':1,
				'loop':1,
				'multiple':1,
				'muted':1,
				'nohref':1,
				'noresize':1,
				'novalidate':1,
				'open':1,
				'readonly':1,
				'required':1,
				'reversed':1,
				'scoped':1,
				'seamless':1,
				'selected':1,
				'typemustmatch':1,
			};

			if(htmlOptions===[])
				return '';

			html='';
			if(undefined === htmlOptions['encode'])
			{
				raw=!htmlOptions['encode'];
				delete (htmlOptions['encode']);
			}
			else
				raw=false;

			for(h in htmlOptions)
			{
				var name = h, value = htmlOptions[h];
				if(undefined !== specialAttributes[name])
				{
					if(value)
					{
						html += ' ' + name;
						if(self.renderSpecialAttributesValue)
							html += '="' + name + '"';
					}
				}
				else if(value!==null)
				{
					html += ' ' + name + '="' + (raw ? value : self.encode(value)) + '"';
				}
			}

			return html;
		}

	}

};   	

/**
 * Source of the wnHtmlEncoder class.
 * 
 * @author: Pedro Nasser
 * @link: http://pedroncs.com/projects/webnode/
 * @license: http://pedroncs.com/projects/webnode/#license
 * @copyright: Copyright &copy; 2012 WebNode Server
 */

/**
 * {full_description}
 *
 * @author Pedro Nasser
 * @version $Id$
 * @pagackge system.base
 * @since 1.0.0
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: [],

	/**
	 * PRIVATE
	 */
	private: {},

	/**
	 * Public Variables
	 */
	public: {},

	/**
	 * Methods
	 */
	methods: {

        /**
         * Initialization
         */
		init: function () {
			this.EncodeType = "entity";
			this.arr1 = new Array('&nbsp;', '&iexcl;', '&cent;', '&pound;', '&curren;', '&yen;', '&brvbar;', '&sect;', '&uml;', '&copy;', '&ordf;', '&laquo;', '&not;', '&shy;', '&reg;', '&macr;', '&deg;', '&plusmn;', '&sup2;', '&sup3;', '&acute;', '&micro;', '&para;', '&middot;', '&cedil;', '&sup1;', '&ordm;', '&raquo;', '&frac14;', '&frac12;', '&frac34;', '&iquest;', '&Agrave;', '&Aacute;', '&Acirc;', '&Atilde;', '&Auml;', '&Aring;', '&Aelig;', '&Ccedil;', '&Egrave;', '&Eacute;', '&Ecirc;', '&Euml;', '&Igrave;', '&Iacute;', '&Icirc;', '&Iuml;', '&ETH;', '&Ntilde;', '&Ograve;', '&Oacute;', '&Ocirc;', '&Otilde;', '&Ouml;', '&times;', '&Oslash;', '&Ugrave;', '&Uacute;', '&Ucirc;', '&Uuml;', '&Yacute;', '&THORN;', '&szlig;', '&agrave;', '&aacute;', '&acirc;', '&atilde;', '&auml;', '&aring;', '&aelig;', '&ccedil;', '&egrave;', '&eacute;', '&ecirc;', '&euml;', '&igrave;', '&iacute;', '&icirc;', '&iuml;', '&eth;', '&ntilde;', '&ograve;', '&oacute;', '&ocirc;', '&otilde;', '&ouml;', '&divide;', '&Oslash;', '&ugrave;', '&uacute;', '&ucirc;', '&uuml;', '&yacute;', '&thorn;', '&yuml;', '&quot;', '&amp;', '&lt;', '&gt;', '&oelig;', '&oelig;', '&scaron;', '&scaron;', '&yuml;', '&circ;', '&tilde;', '&ensp;', '&emsp;', '&thinsp;', '&zwnj;', '&zwj;', '&lrm;', '&rlm;', '&ndash;', '&mdash;', '&lsquo;', '&rsquo;', '&sbquo;', '&ldquo;', '&rdquo;', '&bdquo;', '&dagger;', '&dagger;', '&permil;', '&lsaquo;', '&rsaquo;', '&euro;', '&fnof;', '&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;', '&zeta;', '&eta;', '&theta;', '&iota;', '&kappa;', '&lambda;', '&mu;', '&nu;', '&xi;', '&omicron;', '&pi;', '&rho;', '&sigma;', '&tau;', '&upsilon;', '&phi;', '&chi;', '&psi;', '&omega;', '&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;', '&zeta;', '&eta;', '&theta;', '&iota;', '&kappa;', '&lambda;', '&mu;', '&nu;', '&xi;', '&omicron;', '&pi;', '&rho;', '&sigmaf;', '&sigma;', '&tau;', '&upsilon;', '&phi;', '&chi;', '&psi;', '&omega;', '&thetasym;', '&upsih;', '&piv;', '&bull;', '&hellip;', '&prime;', '&prime;', '&oline;', '&frasl;', '&weierp;', '&image;', '&real;', '&trade;', '&alefsym;', '&larr;', '&uarr;', '&rarr;', '&darr;', '&harr;', '&crarr;', '&larr;', '&uarr;', '&rarr;', '&darr;', '&harr;', '&forall;', '&part;', '&exist;', '&empty;', '&nabla;', '&isin;', '&notin;', '&ni;', '&prod;', '&sum;', '&minus;', '&lowast;', '&radic;', '&prop;', '&infin;', '&ang;', '&and;', '&or;', '&cap;', '&cup;', '&int;', '&there4;', '&sim;', '&cong;', '&asymp;', '&ne;', '&equiv;', '&le;', '&ge;', '&sub;', '&sup;', '&nsub;', '&sube;', '&supe;', '&oplus;', '&otimes;', '&perp;', '&sdot;', '&lceil;', '&rceil;', '&lfloor;', '&rfloor;', '&lang;', '&rang;', '&loz;', '&spades;', '&clubs;', '&hearts;', '&diams;');
	        this.arr2 = new Array('&#160;', '&#161;', '&#162;', '&#163;', '&#164;', '&#165;', '&#166;', '&#167;', '&#168;', '&#169;', '&#170;', '&#171;', '&#172;', '&#173;', '&#174;', '&#175;', '&#176;', '&#177;', '&#178;', '&#179;', '&#180;', '&#181;', '&#182;', '&#183;', '&#184;', '&#185;', '&#186;', '&#187;', '&#188;', '&#189;', '&#190;', '&#191;', '&#192;', '&#193;', '&#194;', '&#195;', '&#196;', '&#197;', '&#198;', '&#199;', '&#200;', '&#201;', '&#202;', '&#203;', '&#204;', '&#205;', '&#206;', '&#207;', '&#208;', '&#209;', '&#210;', '&#211;', '&#212;', '&#213;', '&#214;', '&#215;', '&#216;', '&#217;', '&#218;', '&#219;', '&#220;', '&#221;', '&#222;', '&#223;', '&#224;', '&#225;', '&#226;', '&#227;', '&#228;', '&#229;', '&#230;', '&#231;', '&#232;', '&#233;', '&#234;', '&#235;', '&#236;', '&#237;', '&#238;', '&#239;', '&#240;', '&#241;', '&#242;', '&#243;', '&#244;', '&#245;', '&#246;', '&#247;', '&#248;', '&#249;', '&#250;', '&#251;', '&#252;', '&#253;', '&#254;', '&#255;', '&#34;', '&#38;', '&#60;', '&#62;', '&#338;', '&#339;', '&#352;', '&#353;', '&#376;', '&#710;', '&#732;', '&#8194;', '&#8195;', '&#8201;', '&#8204;', '&#8205;', '&#8206;', '&#8207;', '&#8211;', '&#8212;', '&#8216;', '&#8217;', '&#8218;', '&#8220;', '&#8221;', '&#8222;', '&#8224;', '&#8225;', '&#8240;', '&#8249;', '&#8250;', '&#8364;', '&#402;', '&#913;', '&#914;', '&#915;', '&#916;', '&#917;', '&#918;', '&#919;', '&#920;', '&#921;', '&#922;', '&#923;', '&#924;', '&#925;', '&#926;', '&#927;', '&#928;', '&#929;', '&#931;', '&#932;', '&#933;', '&#934;', '&#935;', '&#936;', '&#937;', '&#945;', '&#946;', '&#947;', '&#948;', '&#949;', '&#950;', '&#951;', '&#952;', '&#953;', '&#954;', '&#955;', '&#956;', '&#957;', '&#958;', '&#959;', '&#960;', '&#961;', '&#962;', '&#963;', '&#964;', '&#965;', '&#966;', '&#967;', '&#968;', '&#969;', '&#977;', '&#978;', '&#982;', '&#8226;', '&#8230;', '&#8242;', '&#8243;', '&#8254;', '&#8260;', '&#8472;', '&#8465;', '&#8476;', '&#8482;', '&#8501;', '&#8592;', '&#8593;', '&#8594;', '&#8595;', '&#8596;', '&#8629;', '&#8656;', '&#8657;', '&#8658;', '&#8659;', '&#8660;', '&#8704;', '&#8706;', '&#8707;', '&#8709;', '&#8711;', '&#8712;', '&#8713;', '&#8715;', '&#8719;', '&#8721;', '&#8722;', '&#8727;', '&#8730;', '&#8733;', '&#8734;', '&#8736;', '&#8743;', '&#8744;', '&#8745;', '&#8746;', '&#8747;', '&#8756;', '&#8764;', '&#8773;', '&#8776;', '&#8800;', '&#8801;', '&#8804;', '&#8805;', '&#8834;', '&#8835;', '&#8836;', '&#8838;', '&#8839;', '&#8853;', '&#8855;', '&#8869;', '&#8901;', '&#8968;', '&#8969;', '&#8970;', '&#8971;', '&#9001;', '&#9002;', '&#9674;', '&#9824;', '&#9827;', '&#9829;', '&#9830;');
		},

        /**
         * Check if string is empty
         * @param string $val target string
         * @return boolean is empty?
         */
        isEmpty : function(val) {
            if (val) {
                return ((val === null) || val.length == 0 || /^\s+$/.test(val));
            } else {
                return true;
            }
        },

        /**
         * Convert HTML entities into numerical entities
         * @param string $string target string
         * @return string result
         */
        HTML2Numerical : function(s) {
            return this.swapArrayVals(s, this.arr1, this.arr2);
        },

        /**
         * Convert Numerical entities into HTML entities
         * @param string $string target string
         * @return string result
         */
        NumericalToHTML : function(s) {
            return this.swapArrayVals(s, this.arr2, this.arr1);
        },

        /**
         * Numerically encodes all unicode characters
         * @param string $string target string
         * @return string result
         */
        numEncode : function(s) {

            if (this.isEmpty(s)) return "";

            var e = "";
            for (var i = 0; i < s.length; i++) {
                var c = s.charAt(i);
                if (c < " " || c > "~") {
                    c = "&#" + c.charCodeAt() + ";";
                }
                e += c;
            }
            return e;
        },

        /**
         * HTML Decode numerical and HTML entities back to original values
         * @param string $string target string
         * @return string result
         */
        htmlDecode : function(s) {

            var c,m,d = s;

            if (this.isEmpty(d)) return "";

            // convert HTML entites back to numerical entites first
            d = this.HTML2Numerical(d);

            // look for numerical entities &#34;
            arr = d.match(/&#[0-9]{1,5};/g);

            // if no matches found in string then skip
            if (arr != null) {
                for (var x = 0; x < arr.length; x++) {
                    m = arr[x];
                    c = m.substring(2, m.length - 1); //get numeric part which is refernce to unicode character
                    // if its a valid number we can decode
                    if (c >= -32768 && c <= 65535) {
                        // decode every single match within string
                        d = d.replace(m, String.fromCharCode(c));
                    } else {
                        d = d.replace(m, ""); //invalid so replace with nada
                    }
                }
            }

            return d;
        },

        /**
         * Encode an input string into either numerical or HTML entities
         * @param string $string target string
         * @return string result
         */
        htmlEncode : function(s, dbl) {

            if (this.isEmpty(s)) return "";

            // do we allow double encoding? E.g will &amp; be turned into &amp;amp;
            dbl = dbl || false; //default to prevent double encoding

            // if allowing double encoding we do ampersands first
            if (dbl) {
                if (this.EncodeType == "numerical") {
                    s = s.replace(/&/g, "&#38;");
                } else {
                    s = s.replace(/&/g, "&amp;");
                }
            }

            // convert the xss chars to numerical entities ' " < >
            s = this.XSSEncode(s, false);

            if (this.EncodeType == "numerical" || !dbl) {
                // Now call function that will convert any HTML entities to numerical codes
                s = this.HTML2Numerical(s);
            }

            // Now encode all chars above 127 e.g unicode
            s = this.numEncode(s);

            // now we know anything that needs to be encoded has been converted to numerical entities we
            // can encode any ampersands & that are not part of encoded entities
            // to handle the fact that I need to do a negative check and handle multiple ampersands &&&
            // I am going to use a placeholder

            // if we don't want double encoded entities we ignore the & in existing entities
            if (!dbl) {
                s = s.replace(/&#/g, "##AMPHASH##");

                if (this.EncodeType == "numerical") {
                    s = s.replace(/&/g, "&#38;");
                } else {
                    s = s.replace(/&/g, "&amp;");
                }

                s = s.replace(/##AMPHASH##/g, "&#");
            }

            // replace any malformed entities
            s = s.replace(/&#\d*([^\d;]|$)/g, "$1");

            if (!dbl) {
                // safety check to correct any double encoded &amp;
                s = this.correctEncoding(s);
            }

            // now do we need to convert our numerical encoded string into entities
            if (this.EncodeType == "entity") {
                s = this.NumericalToHTML(s);
            }

            return s;
        },

        /**
         * Encodes the basic 4 characters used to malform HTML in XSS hacks
         * @param string $string target string
         * @return string result
         */
        XSSEncode : function(s, en) {
            if (!this.isEmpty(s)) {
                en = en || true;
                // do we convert to numerical or html entity?
                if (en) {
                    s = s.replace(/\'/g, "&#39;"); //no HTML equivalent as &apos is not cross browser supported
                    s = s.replace(/\"/g, "&quot;");
                    s = s.replace(/</g, "&lt;");
                    s = s.replace(/>/g, "&gt;");
                } else {
                    s = s.replace(/\'/g, "&#39;"); //no HTML equivalent as &apos is not cross browser supported
                    s = s.replace(/\"/g, "&#34;");
                    s = s.replace(/</g, "&#60;");
                    s = s.replace(/>/g, "&#62;");
                }
                return s;
            } else {
                return "";
            }
        },

        /**
         * Returns true if a string contains html or numerical encoded entities
         * @param string $string target string
         * @return boolean has encoded?
         */
        hasEncoded : function(s) {
            if (/&#[0-9]{1,5};/g.test(s)) {
                return true;
            } else if (/&[A-Z]{2,6};/gi.test(s)) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * Will remove any unicode characters
         * @param string $string target string
         * @return string result
         */
        stripUnicode : function(s) {
            return s.replace(/[^\x20-\x7E]/g, "");
        },

        /**
         * Corrects any double encoded &amp; entities e.g &amp;amp;
         * @param string $string target string
         * @return string result
         */
        correctEncoding : function(s) {
            return s.replace(/(&amp;)(amp;)+/, "$1");
        },

        /**
         * Function to loop through an array swaping each item with the
         * value from another array e.g swap HTML entities with Numericals
         * @param string $string target string
         * @param array $arr1 from array
         * @param array $arr1 to array
         * @return string result
         */
        swapArrayVals : function(s, arr1, arr2) {
            if (this.isEmpty(s)) return "";
            var re;
            if (arr1 && arr2) {
                //ShowDebug("in swapArrayVals arr1.length = " + arr1.length + " arr2.length = " + arr2.length)
                // array lengths must match
                if (arr1.length == arr2.length) {
                    for (var x = 0,i = arr1.length; x < i; x++) {
                        re = new RegExp(arr1[x], 'g');
                        s = s.replace(re, arr2[x]); //swap arr1 item with matching item from arr2
                    }
                }
            }
            return s;
        },

        /**
         * Check if item is in Array.
         * @param string $item target item
         * @param array $arr target array
         * @return number -1 or position
         */
        inArray : function(item, arr) {
            for (var i = 0, x = arr.length; i < x; i++) {
                if (arr[i] === item) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * A JavaScript equivalent of PHP’s htmlspecialchars
         * http://phpjs.org/functions/htmlspecialchars/
         * @param string $string 
         * @param string $quote_style
         * @param string $charset
         * @param string $double_encode
         */
        htmlspecialchars: function (string, quote_style, charset, double_encode) {
          var optTemp = 0,
            i = 0,
            noquotes = false;
          if (typeof quote_style === 'undefined' || quote_style === null) {
            quote_style = 2;
          }
          string = string.toString();
          if (double_encode !== false) { // Put this first to avoid double-encoding
            string = string.replace(/&/g, '&amp;');
          }
          string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

          var OPTS = {
            'ENT_NOQUOTES': 0,
            'ENT_HTML_QUOTE_SINGLE': 1,
            'ENT_HTML_QUOTE_DOUBLE': 2,
            'ENT_COMPAT': 2,
            'ENT_QUOTES': 3,
            'ENT_IGNORE': 4
          };
          if (quote_style === 0) {
            noquotes = true;
          }
          if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
            quote_style = [].concat(quote_style);
            for (i = 0; i < quote_style.length; i++) {
              // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
              if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
              }
              else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
              }
            }
            quote_style = optTemp;
          }
          if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
            string = string.replace(/'/g, '&#039;');
          }
          if (!noquotes) {
            string = string.replace(/"/g, '&quot;');
          }

          return string;
        },

        /**
         * A JavaScript equivalent of PHP’s htmlspecialchars_decode
         * http://phpjs.org/functions/htmlspecialchars_decode/
         * @param string $string 
         * @param string $quote_style
         * @param string $charset
         * @param string $double_encode
         */
        htmlspecialchars_decode: function(string, quote_style) {
          var optTemp = 0,
            i = 0,
            noquotes = false;
          if (typeof quote_style === 'undefined') {
            quote_style = 2;
          }
          string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
          var OPTS = {
            'ENT_NOQUOTES': 0,
            'ENT_HTML_QUOTE_SINGLE': 1,
            'ENT_HTML_QUOTE_DOUBLE': 2,
            'ENT_COMPAT': 2,
            'ENT_QUOTES': 3,
            'ENT_IGNORE': 4
          };
          if (quote_style === 0) {
            noquotes = true;
          }
          if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
            quote_style = [].concat(quote_style);
            for (i = 0; i < quote_style.length; i++) {
              // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
              if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
              } else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
              }
            }
            quote_style = optTemp;
          }
          if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
            string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
            // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
          }
          if (!noquotes) {
            string = string.replace(/&quot;/g, '"');
          }
          // Put this in last place to avoid escape being double-decoded
          string = string.replace(/&amp;/g, '&');

          return string;
        }

	}

};
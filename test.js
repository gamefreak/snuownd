#! /usr/local/bin/node

var snuownd = require('./snuownd');
var md = snuownd.getParser();

colors = {
	BLACK: '\033[30m',
	RED: '\033[31m',
	GREEN: '\033[32m',
	YELLOW: '\033[33m',
	BLUE: '\033[34m',
	MAGENTA: '\033[35m',
	CYAN: '\033[36m',
	WHITE: '\033[37m',
	RESET: '\033[0m'
}

cases = {
    '': '',
    'http://www.reddit.com':
        '<p><a href="http://www.reddit.com">http://www.reddit.com</a></p>\n',

    '[foo](http://en.wikipedia.org/wiki/Link_(film\\))':
        '<p><a href="http://en.wikipedia.org/wiki/Link_(film)">foo</a></p>\n',

    '(http://tsfr.org)':
        '<p>(<a href="http://tsfr.org">http://tsfr.org</a>)</p>\n',

    '[A link with a /r/subreddit in it](/lol)':
        '<p><a href="/lol">A link with a /r/subreddit in it</a></p>\n',

    '[A link with a http://www.url.com in it](/lol)':
        '<p><a href="/lol">A link with a http://www.url.com in it</a></p>\n',

    '[Empty Link]()':
        '<p>[Empty Link]()</p>\n',

    'http://en.wikipedia.org/wiki/café_racer':
        '<p><a href="http://en.wikipedia.org/wiki/caf%C3%A9_racer">http://en.wikipedia.org/wiki/café_racer</a></p>\n',

    '#####################################################hi':
        '<h6>###############################################hi</h6>\n',

    '[foo](http://bar\nbar)':
        '<p><a href="http://bar%0Abar">foo</a></p>\n',

    '/r/test':
        '<p><a href="/r/test">/r/test</a></p>\n',

    'Words words /r/test words':
        '<p>Words words <a href="/r/test">/r/test</a> words</p>\n',
    
    '/r/':
        '<p>/r/</p>\n',

    'escaped \\/r/test':
        '<p>escaped /r/test</p>\n',

    'ampersands http://www.google.com?test&blah':
        '<p>ampersands <a href="http://www.google.com?test&amp;blah">http://www.google.com?test&amp;blah</a></p>\n',

    '[_regular_ link with nesting](/test)':
        '<p><a href="/test"><em>regular</em> link with nesting</a></p>\n',

    ' www.a.co?with&test':
        '<p><a href="http://www.a.co?with&amp;test">www.a.co?with&amp;test</a></p>\n',

    'Normal^superscript':
        '<p>Normal<sup>superscript</sup></p>\n',

    'Escape\\^superscript':
        '<p>Escape^superscript</p>\n',

    '~~normal strikethrough~~':
        '<p><del>normal strikethrough</del></p>\n',

    '\\~~escaped strikethrough~~':
        '<p>~~escaped strikethrough~~</p>\n',

    'anywhere\x03, you':
        '<p>anywhere, you</p>\n',

    '[Test](//test)':
        '<p><a href="//test">Test</a></p>\n',

    '[Test](//#test)':
        '<p><a href="//#test">Test</a></p>\n',

    '[Test](#test)':
        '<p><a href="#test">Test</a></p>\n',

    '[Test](git://github.com)':
        '<p><a href="git://github.com">Test</a></p>\n',

    '[Speculation](//?)':
        '<p><a href="//?">Speculation</a></p>\n',

    '/r/sr_with_underscores':
        '<p><a href="/r/sr_with_underscores">/r/sr_with_underscores</a></p>\n',

    '[Test](///#test)':
        '<p><a href="///#test">Test</a></p>\n',

    '/r/multireddit+test+yay':
        '<p><a href="/r/multireddit+test+yay">/r/multireddit+test+yay</a></p>\n',

    '<test>':
        '<p>&lt;test&gt;</p>\n',

    'words_with_underscores':
        '<p>words_with_underscores</p>\n',

    'words*with*asterisks':
        '<p>words<em>with</em>asterisks</p>\n',

    '~test':
        '<p>~test</p>\n',

    '/u/test':
        '<p><a href="/u/test">/u/test</a></p>\n',

    'blah \\':
        '<p>blah \\</p>\n',

    '/r/whatever: fork':
        '<p><a href="/r/whatever">/r/whatever</a>: fork</p>\n',

    '/r/t:timereddit':
        '<p><a href="/r/t:timereddit">/r/t:timereddit</a></p>\n',

    '/r/reddit.com':
        '<p><a href="/r/reddit.com">/r/reddit.com</a></p>\n',

    '/r/not.cool':
        '<p><a href="/r/not">/r/not</a>.cool</p>\n',

    '/r/very+clever+multireddit+reddit.com+t:fork+yay':
        '<p><a href="/r/very+clever+multireddit+reddit.com+t:fork+yay">/r/very+clever+multireddit+reddit.com+t:fork+yay</a></p>\n',

    '/r/t:heatdeathoftheuniverse':
        '<p><a href="/r/t:heatdeathoftheuniverse">/r/t:heatdeathoftheuniverse</a></p>\n',
}


console.log("Running Snuodwn test cases.");
var showSuccesses = false
for (var text in cases) {

	var result = md.render(text);
	if (cases[text] == result) {
		if (showSuccesses) {
			console.log(text);
			console.log(cases[text]);
			console.log(result);
			console.log();
		}
	} else {
		console.log(colors.RED, text, colors.RESET);
		console.log(cases[text]);
		console.log(result);
		console.log();
	}
}

try {
    var htmlutil = require('html-util');
} catch (e) {
    console.error('Could not load module "html-util", module must be installed to run tests.');
    return 1;
}


console.log('Running tests against /r/all');
var http = require('http');
http.request({
    host: 'www.reddit.com',
    path: '/r/all/.json',
    headers: {
        'User-Agent': 'SnuOwnd Test Suite'
    }
}, function(res) {
    // console.log(res);
   var body = '';
    res.on('data', function(chunk) {
        body += chunk;
    }).on('end', function() {
        // console.log('BODY', body);
        data = JSON.parse(body);
        var list = [];
        for (var i = 0; i < data.data.children.length; i++) {
            list.push(data.data.children[i]);
        }
        function scan_page_loop(list) {
            var obj = list.shift();
            console.log(obj.data.permalink);
            http.request({
                    host: 'www.reddit.com',
                    path: obj.data.permalink+'.json',
                    headers: {
                        'User-Agent': 'SnuOwnd Test Suite'
                    }
                }, function(res) {
                    if (res.statusCode != 200) {
                        console.log(res.statusCode);
                        return;
                    }
                    var body = '';
                    res.on('data', function(chunk) {
                        body += chunk;
                    }).on('end', function() {
                        data = JSON.parse(body)[1];
                        parseListing(data);
                        if (list.length > 0) setTimeout(scan_page_loop, 3000, list);
                    });
            }).end();
        
        }
        setTimeout(scan_page_loop, 100, list);
    });
}).end();


function parseListing(listing) {
    if (!listing) return;
    for (var i = 0; i < listing.data.children.length; i++) {
        var child = listing.data.children[i];
        
        if (child.kind != 'more' && child.data.replies != "") {
            var markdown = child.data.body;
            var html = htmlutil.unescapeEntities(child.data.body_html).slice(16, -6);
            var rendered = snuownd.getParser().render(htmlutil.unescapeEntities(markdown));
            if (html != rendered) {
                console.log(colors.RED, "RENDER ERROR", colors.RESET);
                console.log("MARKDOWN:");
                console.log(markdown);
                console.log("REDDIT:");
                console.log(colors.GREEN, JSON.stringify(html), colors.RESET);
                console.log("SNUOWND:");
                console.log(colors.RED, JSON.stringify(rendered), colors.RESET);
                console.log();
            }
            // else console.log('okay');
            if (child.data.replies) parseListing(child.data.replies);
        }
    }
}


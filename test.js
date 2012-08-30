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


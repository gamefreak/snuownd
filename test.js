#! /usr/local/bin/node
// "use strict";

var snuownd = require('./snuownd');
var md = snuownd.getParser();

var md_wiki = (function() {
    var redditCallbacks = snuownd.getRedditCallbacks();
    var rendererConfig = snuownd.defaultRenderState();
    rendererConfig.flags = snuownd.DEFAULT_WIKI_FLAGS;
    rendererConfig.html_element_whitelist = snuownd.DEFAULT_HTML_ELEMENT_WHITELIST;
    rendererConfig.html_attr_whitelist = snuownd.DEFAULT_HTML_ATTR_WHITELIST;

    return snuownd.getParser({
        callbacks: redditCallbacks,
        context: rendererConfig
    });
})();

var fs = require('fs');

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

    'http://www.reddit.com/a\x00b':
        '<p><a href="http://www.reddit.com/ab">http://www.reddit.com/ab</a></p>\n',

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

    '&thetasym;': '<p>&thetasym;</p>\n',
    '&foobar;': '<p>&amp;foobar;</p>\n',
    '&nbsp': '<p>&amp;nbsp</p>\n',
    '&#foobar;': '<p>&amp;#foobar;</p>\n',
    '&#xfoobar;': '<p>&amp;#xfoobar;</p>\n',
    '&#9999999999;': '<p>&amp;#9999999999;</p>\n',
    '&#99;': '<p>&#99;</p>\n',
    '&#X7E;': '<p>&#X7E;</p>\n',
    '&frac12;': '<p>&frac12;</p>\n',
    '&': '<p>&amp;</p>\n',
    '&;': '<p>&amp;;</p>\n',
    '&#;': '<p>&amp;#;</p>\n',
    '&#x;': '<p>&amp;#x;</p>\n',
}

function repeat(str, n) {
    var out = '';
    for (var i = 0; i < n; i++) {
        out += str;
    }
}

cases[repeat('|', 5) + '\n' + repeat('-|', 5) + '\n|\n'] = '<table><thead>\n<tr>\n' + repeat('<th></th>\n', 4) + '</tr>\n</thead><tbody>\n<tr>\n<td colspan="4" ></td>\n</tr>\n</tbody></table>\n';

cases[repeat('|', 2) + '\n' + repeat('-|', 2) + '\n|\n'] = '<table><thead>\n<tr>\n' + repeat('<th></th>\n', 1) + '</tr>\n</thead><tbody>\n<tr>\n<td></td>\n</tr>\n</tbody></table>\n';

cases[repeat('|', 65) + '\n' + repeat('-|', 65) + '\n|\n'] = '<table><thead>\n<tr>\n' + repeat('<th></th>\n', 64) + '</tr>\n</thead><tbody>\n<tr>\n<td colspan="64" ></td>\n</tr>\n</tbody></table>\n';

cases[repeat('|', 66) + '\n' + repeat('-|', 66) + '\n|\n'] = '<p>' + repeat('|', 66) + '\n' + repeat('-|', 66) + '\n|' + '</p>\n';


function *range(from ,to) {
    for (var i = from; i < to; i++) yield i;
}
// Test that every illegal numeric entity is encoded as it should be.
var ILLEGAL_NUMERIC_ENT_RANGES = [
    range(0, 9),
    range(11, 13),
    range(14, 32),
    range(55296, 57344),
    range(65534, 65536),
]

var invalid_ent_test_key = '';
var invalid_ent_test_val = '';
for (var r of ILLEGAL_NUMERIC_ENT_RANGES.values()) {
    for (var i of r) {
        invalid_ent_test_key += '&#' + i + ';';
        invalid_ent_test_val += '&amp;#' + i + ';';
    }
}
// for i in itertools.chain(*ILLEGAL_NUMERIC_ENT_RANGES):

cases[invalid_ent_test_key] = '<p>' + invalid_ent_test_val + '</p>\n';






wiki_cases = {
    '<table scope="foo"bar>':
        '<p><table scope="foo"></p>\n',

    '<table scope="foo"bar colspan="2">':
        '<p><table scope="foo" colspan="2"></p>\n',

    '<table scope="foo" colspan="2"bar>':
        '<p><table scope="foo" colspan="2"></p>\n',

    '<table scope="foo">':
        '<p><table scope="foo"></p>\n',

    '<table scop="foo">':
        '<p><table></p>\n',

    '<table ff= scope="foo">':
        '<p><table scope="foo"></p>\n',

    '<table colspan= scope="foo">':
        '<p><table scope="foo"></p>\n',

    '<table scope=ff"foo">':
        '<p><table scope="foo"></p>\n',

    '<table scope="foo" test="test">':
        '<p><table scope="foo"></p>\n',

    '<table scope="foo" longervalue="testing test" scope="test">':
        '<p><table scope="foo" scope="test"></p>\n',

    '<table scope=`"foo">':
        '<p><table scope="foo"></p>\n',

    '<table scope="foo bar">':
        '<p><table scope="foo bar"></p>\n',

    '<table scope=\'foo colspan="foo">':
        '<p><table></p>\n',

    '<table scope=\'foo\' colspan="foo">':
        '<p><table scope="foo" colspan="foo"></p>\n',

    '<table scope=>':
        '<p><table></p>\n',

    '<table scope= colspan="test" scope=>':
        '<p><table colspan="test"></p>\n',

    '<table colspan="\'test">':
        '<p><table colspan="&#39;test"></p>\n',

    '<table scope="foo" colspan="2">':
        '<p><table scope="foo" colspan="2"></p>\n',

    '<table scope="foo" colspan="2" ff="test">':
        '<p><table scope="foo" colspan="2"></p>\n',

    '<table ff="test" scope="foo" colspan="2" colspan=>':
        '<p><table scope="foo" colspan="2"></p>\n',

    ' <table colspan=\'\'\' a="" \' scope="foo">':
        '<p><table scope="foo"></p>\n',
}



console.log("Running Snudown test cases.");
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


console.log("Running Snudown test cases for the wiki format.");
for (var text in wiki_cases) {

    var result = md_wiki.render(text);
    if (wiki_cases[text] == result) {
        if (showSuccesses) {
            console.log(text);
            console.log(wiki_cases[text]);
            console.log(result);
            console.log();
        }
    } else {
        console.log(colors.RED, text, colors.RESET);
        // console.log(wiki_cases[text]);
        console.log(colors.GREEN, wiki_cases[text], colors.RESET);
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

console.log('Retrieving test data from /r/all');
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
        console.assert(data != null);
        var list = [];
        for (var i = 0; i < data.data.children.length; i++) {
            list.push(data.data.children[i]);
        }
        var fullTable = {};
        function scan_page_loop(list) {
            var obj = list.shift();
            console.log('GET[' + (25-list.length) + '/25]', obj.data.permalink);
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
                        data = JSON.parse(body);
                        parseListing(data[0], fullTable);
                        parseListing(data[1], fullTable);
                        if (list.length > 0) {
                            setTimeout(scan_page_loop, 2000, list);
                        } else {
                            finishRun(fullTable);
                        }
                    });
            }).end();
        
        }
        setTimeout(scan_page_loop, 100, list);
    });
}).end();

function parseListing(listing, table) {
    if (listing == null || listing.kind !== 'Listing') return;
    if (listing != null && listing.data != null && listing.data.children != null) {
        for (var i = 0; i < listing.data.children.length; i++) {
            parseComment(listing.data.children[i], table);
        }
    }
}

function parseComment(comment, table) {
    if (comment.kind === 'more') return;
    if (comment.kind === 't1') {
        table[comment.data.name] = {
            markdown: comment.data.body,
            html: htmlutil.unescapeEntities(comment.data.body_html).slice(16, -6),
            link: comment.data.link_id.match(/^t3_([a-z0-9]+)$/)[1]
        };
    } else if (comment.kind === 't3' && comment.data.is_self === true && comment.data.selftext.length > 0) {
    
        table[comment.data.name] = {
            markdown: comment.data.selftext,
            html: htmlutil.unescapeEntities(comment.data.selftext_html).slice(31, -20)
        }
    }
    if (comment.data.replies) {
        parseListing(comment.data.replies, table);
    }
}

function calcURL(id, entry) {
    var parts = id.match(/^(t[13])_([a-z0-9]+)$/);
    if (parts[1] === 't3') {
        return 'http://www.reddit.com/comments/' + parts[2] + '/';
    } else if (parts[1] === 't1') {
        return 'http://www.reddit.com/comments/' + entry.link + '/_/' + parts[2] + '/';
    }
}

function checkOutput(id, entry) {
    var rendered = snuownd.getParser().render(htmlutil.unescapeEntities(entry.markdown));
    var html = entry.html;
    if (html !== rendered) {
        console.log(colors.RED, "RENDER ERROR", colors.RESET, calcURL(id, entry));
        console.log("MARKDOWN:");
        console.log(entry.markdown);
        console.log(JSON.stringify(entry.markdown));
        console.log("REDDIT:");
        console.log(colors.GREEN, html, colors.RESET);
        console.log(JSON.stringify(html));
        console.log("SNUOWND:");
        console.log(colors.RED, rendered, colors.RESET);
        console.log(JSON.stringify(rendered));
        console.log();
    }
}

function finishRun(newTable) {
    console.log('Testing against new data.');
    // console.log(newTable);
    for (var id in newTable) {
        // console.log(id);
        checkOutput(id, newTable[id]);
    }
    if (fs.existsSync('./testData.json')) {
        console.log('Testing against old data.');
        var data = fs.readFileSync('testData.json', 'utf-8');
        var oldTable = JSON.parse(data);
        for (var id in oldTable) {
            checkOutput(id, oldTable[id]);
        }
        console.log('Merging data.');
        for (var id in newTable) {
            oldTable[id] = newTable[id];
        }
        console.log('Saving.');
        fs.writeFileSync('testData.json', JSON.stringify(oldTable), 'utf-8');
    } else {
        console.log('Saving.');
        fs.writeFileSync('testData.json', JSON.stringify(newTable), 'utf-8');
    }
}

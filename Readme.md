SnuOwnd markdown parser
=================

SnuOwnd is an exact as possible JavaScript port of [Reddit](http://reddit.com)'s [Snudown](http://github.com/reddit/snudown) markdown parser.



Use
---

SnuOwnd can either be used in a browser as a drop in library, or used with node.js by `var SnuOwnd = require('snuownd');`

Use is simple as:

    var markdown = "...";
    var html = SnuOwnd.getParser().render(markdown);

const Crawler = require("crawler");
const PreviewPage = require('./preview.page');
const UpdatesPage = require('./updates.page');

const main_page_url = function() {
    return 'http://www.calmara.com/site/site.asp';
}

const updates_url = function(a) {
    return 'http://www.calmara.com/site/'+a;
}

const preview_url = function(a) {
    return 'http://www.calmara.com/site/'+a;
}

var scan = function(dir,filter) {

    var handler = function (error, res, done) {
        if (error) {
            console.log(error);
            return;
        }
        res.$("a").each(
            function (index) {
                var elem = res.$(this).text();
                if (elem && elem.match(/UPDATE/)) {
                    var url = updates_url(res.$(this).attr('href'));
                    UpdatesPage.download(dir,filter,url);
                }
                if (elem && elem.match(/PREVIEW/)) {
                    var url = preview_url(res.$(this).attr('href'));
                    PreviewPage.download(dir,filter,url);
                }
            }
        );
        done();
    }

    var c = new Crawler({
        maxConnections : 10,
        callback : handler,
    });

    c.queue(main_page_url());
}

module.exports = {
    scan : scan,
}

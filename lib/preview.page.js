var Crawler = require("crawler");
var Download = require('./download');

const preview_page_url = function() {
    return 'http://www.calmara.com/site/site.asp?id=32420';
}

const preview_img_url = function(id) {
    return 'http://www.calmara.com/filelib.p/downloadCMSObject.asp?id='+id+'&res=high';
}

var download = function(dir,filter,url) {

    console.log("scanning preview page: "+url);

    var handler = function (error, res, done) {
        if (error) {
            console.log(error);
            return;
        }
        res.$("a").each(
            function (index) {
                var re = /openHighRes\(\'([0-9]+)/i;
                var elem = res.$(this).attr('onclick');
                if (elem && (found = elem.match(re))) {
                    var url = preview_img_url(found[1]);
                    Download.download_image(url, dir+"/preview/", found[1], filter);
                }
            }
        );
        done();
    }

    var c = new Crawler({
        maxConnections : 10,
        callback : handler,
    });

    c.queue(url);
}

module.exports = {
    download   : download,
}

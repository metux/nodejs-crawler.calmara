const Crawler = require("crawler");
const Download = require('./download');

const updates_start = 0;
const updates_stop = 25;

const updates_page_url = function(page,url) {
    var found = url.match(/([0-9]+)/);
    if (!found) {
        console.error("failed to extract id in "+url);
        return '';
    }
    return 'http://www.calmara.com/services/getUpdates_ajax.asp?id='+found[1]+'&pageno='+page;
}

const updates_img_url = function(id) {
    return 'http://www.calmara.com/set/downloadPublicCMSObject.asp?id='+id+'&res=low';
}

var download = function(dir,filter,url) {

    var handler = function (error, res, done) {
        if (error) {
            console.log(error);
            return;
        }
        res.$("a").each(
            function (index) {
                var re = /openLowResPreview\(\'([0-9]+)/i;
                if (found = res.$(this).attr('onclick').match(re)) {
                    var url = updates_img_url(found[1]);
                    Download.download_image(url, dir+"/updates/", found[1], filter);
                }
            }
        );
        done();
    }

    var c = new Crawler({
        maxConnections : 10,
        callback : handler,
    });

    for (i=updates_start; i<updates_stop; i++) {
        var u = updates_page_url(i,url);
        console.log("scanning updates page: "+u);
        c.queue(u);
    }
}

module.exports = {
    download   : download,
}

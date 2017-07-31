# crawler.calmara
nodejs-based crawler for calmara.com

* downloads images from updates and previews page
* skips aleady downloaded files
* output files are named by their MD5

# Usage
```
var param = {
    dir : './download'
};

var crawler = new(require('crawler.calmara'))(param);

crawler.download();
```

# Feedback

Comments and patches welcomed

Enrico Weigelt, metux IT consult <enrico.weigelt@gr13.net>

# Notes

Needs node-libcurl, as the site returns duplicate Content-Length
headers, which nodejs' built-in http code can't handle.

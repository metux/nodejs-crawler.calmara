
const md5File = require('md5-file')
const mkdirp = require('mkdirp');
const fs = require('fs');
const Curl = require( 'node-libcurl' ).Curl;

var download_image = function(url, dir, id, filter) {
    if (!filter.filter(url)) {
        return;
    }

    mkdirp.sync(dir);

    var curl = new Curl();

    var tmpfile = dir+'/tmp-'+id+'.jpg';
    var fd = fs.openSync(tmpfile, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_TRUNC);

    curl.setOpt( Curl.option.URL, url );
    curl.setOpt( 'FOLLOWLOCATION', true );
    curl.setOpt( Curl.option.WRITEFUNCTION, function( buf, size, nmemb ) {
        fs.writeSync(fd, buf);
        return size * nmemb;
    });

    curl.on( 'end', function( statusCode, body, headers ) {
        fs.closeSync(fd);
        const hash = md5File.sync(tmpfile);
        console.log('File saved to', tmpfile, ' -- md5: ', hash);
        fs.renameSync(tmpfile, dir+'/'+hash+'.jpg');
        filter.ok(url);
        this.close();
    });

    curl.on( 'error', function( err, curlErrorCode ) {
        console.error( err.message );
        console.error( '---' );
        console.error( curlErrorCode );
        fs.closeSync(fd);
        fs.unlinkSync(tmpfile);
        this.close();
    });

    curl.perform();
}

module.exports = {
    download_image : download_image,
}

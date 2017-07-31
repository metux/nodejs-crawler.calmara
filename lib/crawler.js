
const UpdatesPage = require('./updates.page');
const PreviewPage = require('./preview.page');
const MainPage = require('./main.page');
const SkipDup = require('./skipdup');

var method = CalmaraCrawler.prototype;

function CalmaraCrawler(param) {
    this._dir = (param && param.dir ? param.dir : './download/calmara');
    this._filter = new SkipDup(this._dir+'/fetch-images.db');
    return this;
}

method.download_updates = function() {
    UpdatesPage.download(this._dir);
}

method.download_preview = function() {
    PreviewPage.download(this._dir);
}

method.download = function() {
    MainPage.scan(this._dir, this._filter);
}

module.exports = CalmaraCrawler;

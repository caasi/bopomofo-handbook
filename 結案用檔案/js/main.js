var url = 'http://bopomofo.linode.caasih.net';

// utils
function render(state) {
  var count = padZeros(8, state.index.toString(10));
  $index.text(state.index);
  $zhHtml.text(state.zh.html);
  $zhReader.text(state.zh.reader);
  $zhDownload.text(state.zh.download);
  $enHtml.text(state.en.html);
  $enReader.text(state.en.reader);
  $enDownload.text(state.en.download);
}

function zeros(count) {
  var res = '';
  var i;
  if (count < 0) return '';
  for(i = 0; i < count; ++i) {
    res += '0';
  }
  return res;
}

function padZeros(width, str) {
  return zeros(width - str.length) + str;
}

function get() {
  superagent
    .get(url + '/')
    .end(function(err, res) {
      if (err) return console.error(err);
      render(res.body);
    });
}

function post(path) {
  superagent
    .post(url + path)
    .end(function(err, res) {
      if (err) return console.error(err);
      render(res.body);
    });
}

// init
var $counter = $('#counter');
var $index = $('#counter-index');
var $zhHtml = $('#counter-zh-html');
var $zhReader = $('#counter-zh-reader');
var $zhDownload = $('#counter-zh-download');
var $enHtml = $('#counter-en-html');
var $enReader = $('#counter-en-reader');
var $enDownload = $('#counter-en-download');

$('#zh-html').click(function() { post('/zh/html') });
$('#zh-reader').click(function() { post('/zh/reader') });
$('#zh-download').click(function() { post('/zh/download') });
$('#en-html').click(function() { post('/en/html') });
$('#en-reader').click(function() { post('/en/reader') });
$('#en-download').click(function() { post('/en/download') });

post('/');
setInterval(get, 5000);

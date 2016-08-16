
var crawler = require('crawler');
var url = require('url');

var db = require('./db')

var c = new crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, result, $) {
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        $('.o').each(function (index, item) {
            // var toQueueUrl = $(a).attr('href');//获取href属性
            // var text = $(a).text();//获取文本内容

            //c.queue(toQueueUrl);
            var bookTem = {};
            bookTem.url = $(item).find('.o-img a img').attr('src');
			console.log(bookTem.url);
            bookTem.title = $(item).find('.o-info h3 a').attr('title');

            var book = new db.Book(bookTem);
            book.create_time = Date();
            book.save((err) => {
				console.log(err);
            })
            // console.log(text+ "(" + toQueueUrl + ")");
			saveFile(bookTem.url,bookTem.title);
        });
		console.log('--------读取完成--------');
    }
});

// c.queue('http://kankandou.com')
for(var i =2 ;i<=100;i++){
	c.queue('http://kankandou.com/book/page/'+i);
}


/////下载百度图片
var Downloader = require('mt-files-downloader');///引入模块
var downloader = new Downloader();///实例化方法

/*****
 * 第一个参数是 图片地址
 * 第二个参数是 图片名称(书名)
 */
function saveFile(fileUrl,fileName){
   // var fileUrl = 'fileUrl';//'http://imgst-dl.meilishuo.net/pic/_o/84/a4/a30be77c4ca62cd87156da202faf_1440_900.jpg';////远程文件地址
    var fileDir = './downloads/'; ////保存路径
    var fileSavedName = fileDir+fileName+'-'+(new Date()).getTime()+'.'+fileUrl.split('.').slice(-1);///路径+文件名
    console.log('save file :'+fileSavedName);
    var dl = downloader.download(fileUrl, fileSavedName);///配置参数
    dl.start();///执行
}
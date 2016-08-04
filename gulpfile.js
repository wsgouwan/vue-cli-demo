var gulp = require('gulp');
var fs = require('fs');
var buf = require('buffer');
var path = require('path');

var imagesPath = path.join('./src/assets/images');
var jsPath     = path.join('./src/assets/scripts/loadimg.js');

gulp.task('readImages', () => {
    console.log('====================readImages=====================');
    var promise = new Promise( (resolve, reject) =>{
        fs.readdir(imagesPath, function (err, files) {
            if (err) {
                console.log(err);
                return false;
            }
            var img = /.(png|jpe?g)(\?.*)?$/;
            var list = [];
            var len = files.length;
            var count = 0;
            files.forEach(function (file) {
                // 在window  和在 MAC 下  路径的斜杠不同
                var filePath = imagesPath + '\/' + file;
                fs.stat(filePath, function (err, data) {
                    count++;
                    if (err) {
                        reject(err);
                        throw err;
                    } else if (img.test(file) && data.size > 1023) {
                        list.push(file);
                    }
                    if (count == len) {
                        resolve(list);
                    }
                })
            });
        });
    });
    return promise;
});

gulp.task('writeImages',['readImages'], (promise) =>{
    //  js替换文件正则~
    var re = /(\/\*listStart\*\/)([\s\S]*?)(\/\*listEnd\*\/)/;
    readFile().then(fileText =>{
        return fileText;
    }).then(text =>{
        //  jsText     读取到的文件 即将写入到loadImg.js 文件的数组列表
        var fileText = ['1.png', '2.png', '3.png', '4.png', '5.png'];
        var jsText = text;
        if(re.test(jsText)){
            jsText = jsText.replace(re, function ($0) {
                return '/*listStart*/\n'
                    +'var list =' + JSON.stringify(fileText)
                    +';\n/*listEnd*/';
            });
            return jsText;
        }
    }).then( jsText=>{
        writeFile(jsText);
    } );
    // 读取JS文件
    function readFile() {
        var promise = new Promise((resolve, reject) =>{
            fs.readFile(jsPath, function (err, data) {
                if(err){
                    throw err;
                }
                if(typeof data == 'object'){
                    resolve(data.toString());
                }
            })
        });
        return promise;
    }
    // 写入JS文件
    function writeFile(jsText) {
        fs.writeFile(jsPath, jsText, function (err) {
            if(err){
                throw err;
            }
            console.log('It\'s saved!')
        })
    }


});

gulp.task('default', () => {
    gulp.start('writeImages');
});

gulp.watch('./src/assets/images').on('change', () => {

});

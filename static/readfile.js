var fs = require('fs');
var path = __dirname;

fs.readdir(path, function (err, files) {
    if (err) {
        console.log(err);
        return false;
    }
    var img = /.(png|jpe?g)(\?.*)?$/;
    var list = [];

    var promise = new Promise(function(resolve, reject){
        var len = files.length;
        var count = 0;


        files.forEach(function(file) {
            // 在window  和在 MAC 下  路径的斜杠不同
            var filePath = path +'\/'+ file;
            fs.stat(filePath, function(err, data){
                count ++ ;
                if (err) {
                    console.log(err);
                    reject(err)
                }else if(img.test(file) && data.size > 9999){
                    list.push(file);
                }
                if(count == len){
                    resolve(list);
                }
            })
        });

    })

    promise.then( list => {
        console.log(list);
    }, err => {
        console.log('读取文件出错！')
    } )
})

var formidable = require('formidable');

var formidableManager = {
  Initial: function (path) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path;
    form.keepExtensions = true;
    form.maxFieldsSize = 30000000000000;
    form.on('err', function () {

    });
    return form;
  },

  upload: function (req, path, cb) {
    var f = this.Initial(path);
    f.parse(req, function (err, fields, files) {
      if (err) {
        return cb(err);
      }
      //console.log(files);
      var file = files['files[]'];
      if(!file) {
        file = files['file'];
      }
      //console.log(file);
      if (!file) {
        return cb('获取文件信息失败');
      } else {
        return cb(null, file, fields);
      }
    });
  }
};

exports = module.exports = formidableManager;
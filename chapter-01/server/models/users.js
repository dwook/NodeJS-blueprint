// 몽구스와 패스워드 암호화를 위한 bcrypt를 불러온다. Import Mongoose and password Encrypt
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// user 모델의 스키마 정의. define the schema for User model
var userSchema = mongoose.Schema({
    // local strategy 패스포트용 로컬 키. Using local for Local Strategy Passport
    local: {
        name: String,
        email: String,
        password: String,
    }

});

// 패스워드 암호화. Encrypt Password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// 패스워드가 유효한지 확인. Verify if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// user 모델을 생성하고 앱에 공개(expose). create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

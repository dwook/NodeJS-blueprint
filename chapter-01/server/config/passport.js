// 패스포트 모듈 로드. load passport module
var LocalStrategy = require('passport-local').Strategy;
// user 모델 가져오기.  load up the user model
var User = require('../models/users');

module.exports = function(passport) {
    // 패스포트 초기화 설정. passport init setup
    // 세션을 위해 user 직렬화. serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    // user 역직렬화. deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    // local strategy 사용. using local strategy
    passport.use('local-login', new LocalStrategy({
        // 사용자면과 패스워드의 기본값을 'email'과 'password'로 변경. change default username and password, to email and password
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        if (email)
        // 소문자로 변환. format to lower-case
        email = email.toLowerCase();
        // 비동기로 처리. process asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // 에러발생 시. if errors
                if (err)
                    return done(err);
                // 에러 체크한 후 메시지 가져오기. check errors and bring the messages
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Wohh! Wrong password.'));
                // 모든 것이 문제 없다면 user 가져오기. everything ok, get user
                else
                    return done(null, user);
            });
        });
    }));
    // local strategy 등록. Signup local strategy
    passport.use('local-signup', new LocalStrategy({
        // 사용자명과 패스워드 기본값을 'email'과 'password'로 변경. change default username and password, to email and password
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        if (email)
        // 소문자로 변환. format to lower-case
        email = email.toLowerCase();
        // 비동기 처리. asynchronous
        process.nextTick(function() {
            // user가 아직 로그인하지 않았다면. if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // 에러 발생 시. if errors
                    if (err)
                    return done(err);
                    // 이메일 중복 검사. check email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'Wohh! the email is already taken.'));
                    } else {
                        // user 생성. create the user
                        var newUser = new User();
                        // req.body로 부터 사용자명 가져오기. Get user name from req.body
                        newUser.local.name = req.body.name;
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        // 데이터 저장. save data
                        newUser.save(function(err) {
                            if (err)
                            throw err;
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                return done(null, req.user);
            }
        });
    }));
};

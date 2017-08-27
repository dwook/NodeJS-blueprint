var express = require('express');
var router = express.Router();
// 패스워드 처리를 위한 passport 모듈
var passport = require('passport');
// 이메일에서 gravatar 아이콘 얻기
var gravatar = require('gravatar');

/* GET 메서드용 홈페이지. GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express from sever folder' });
});

/* GET 메서드용 로그인 페이지. GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login Page', message: req.flash('loginMessage') });
});

/* POST 메서드용 로그인 처리. POST login */
router.post('/login', passport.authenticate('local-login', {
  // 성공하면 프로필 페이지로, 실패하면 로그인 페이지로. Success go to Profile Page / Fail go to login page
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true
}));


/* GET 메서드용 가입페이지. GET signup page. */
router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Signup Page', message: req.flash('signupMessage') });
});

/* POST 메서드용 가입 처리. POST Signup */
router.post('/signup', passport.authenticate('local-signup', {
  // 성공하면 프로필 페이지로, 실패하면 로그인 페이지로. Success go to Profile Page / Fail go to Signup page
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash : true
}));



/* GET 메서드용 프로필 페이지. GET profile page. */
router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('profile', { title : 'Profile Page', user : req.user, avatar : gravatar.url(req.user.email, {s:'100', r:'x', d:'retro'}, true)});
});


/* 사용자가 로그인했는지 확인. check if user is logged in */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}

/* GET 메서드용 로그아웃 페이지. GET Logout Page */
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});



module.exports = router;

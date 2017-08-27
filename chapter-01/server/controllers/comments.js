// 이메일에서 gravatar 아이콘 얻기. get gravatar icon from email
var gravatar = require('gravatar');
// 코멘트 모델 가져오기. get Comments model
var Comments = require('../models/comments');

// 코멘트 목록. List Comments
exports.list = function(req, res) {
	// 코멘트 전체목록을 날짜별로 정렬하기. List all comments and sort by Date
    Comments.find().sort('-created').populate('user', 'local.email').exec(function(error, comments) {
        if (error) {
            return res.send(400, {
                message: error
            });
        }
        // 결과 렌더링하기. Render result
        res.render('comments', {
            title: 'Comments Page',
            comments: comments,
            gravatar: gravatar.url(comments.email ,  {s: '80', r: 'x', d: 'retro'}, true)
        });
    });
};
// 코멘트 작성. Create Comments
exports.create = function(req, res) {
	// request body를 가진 코멘트 모델 생성하기. create a new instance of the Comments model with request body
    var comments = new Comments(req.body);
    // 현재 사용자 id 설정하기. Set current user (id)
    comments.user = req.user;
    // 수신 데이터 저장하기. save the data received
    comments.save(function(error) {
        if (error) {
            return res.send(400, {
                message: error
            });
        }
        // 코멘트 페이지로 리다이렉트 하기. Redirect to comments
        res.redirect('/comments');
    });
};
// 코멘트 인증 미들웨어. Comments authorization middleware
exports.hasAuthorization = function(req, res, next) {
	if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

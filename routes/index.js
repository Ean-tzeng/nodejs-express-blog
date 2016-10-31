var express = require('express');
var router = express.Router();
var PostModel = require('../model/Posts');
var passport = require('passport');
var UserModel = require('../model/User');
var Strategy = require('passport-local').Strategy;
var flash = require('connect-flash');

/* GET home page. */
router.get('/', function(req, res, next) {
  PostModel.find().sort('-createdAt').exec().then(function(posts){
    res.render('index', {
      title: '文章列表',
      sub_title:'歡迎來到one-blog',
      posts: posts,
			user: req.user
    });
  }, next);
});
router.get('/add', function(req, res, next){
  res.render('add', { 
    title:'新增文章',
    sub_title: '在下面欄位建立新文章',
		user: req.user
  });
});
router.post('/add', function(req, res, next){
	var data = req.body;
	//使用Model新增資料
	PostModel.create(data).then(function (post) {
      res.redirect('/');
  }, next); 
	//使用Entity建立資料
	/**var news = new PostModel(data);
	news.save().then(function(){
		res.redirect('/');
	},next);*/	
});
router.get('/view/:id', function(req, res, next){
	var p =req.params;
	var id =p.id;
	PostModel.findById(id).exec().then(function(post){
		res.render('view', {
			title: '檢視文章',
			sub_title: '閱讀',
			post:post
		});
	});
});
router.get('/edit/:id', function(req, res, next){
	var p = req.params;
	var id = p.id;
	PostModel.findById(id).exec().then(function(post){
		res.render('edit',{
			title: '編輯文章',
			sub_title: 'Edit',
			post:post
		});
	});
});
router.post('/edit/:id',function(req, res, next){
	var data = req.body;
	var p =req.params;
	var id = p.id;
	PostModel.findById(id).exec().then(function(post){
		post.title = data.title;
		post.content = data.content;
		post.save().then(function(post){
			res.redirect('/');
		});
	});
});
router.get('/delete/:id', function(req, res, next){
	var id = req.params.id;
	PostModel.remove({_id:id}, function(err){
		res.redirect('/');
	})
});
router.get('/login', function(req, res, next){
	res.render('login',{
		title:'使用者登入',
		sub_title:'login',
		message: req.flash('error')
	});
});
router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true }),function(req, res, next){
	res.redirect('/');
});
router.get('/sign_up', function(req, res, next){
	res.render('sign_up', {
		title: '註冊為用戶',
		sub_title:'sign_up',
		message: req.flash('err')
	});
});
router.post('/sign_up', function(req, res, next){
	var reg = req.body;
	console.log(reg.username);
	UserModel.findOne({username:reg.username}, function(error, user){
		console.log(user);
			if(user == null){
				UserModel.create(reg).then(function(){
				res.redirect('/');
				})
			}else{
				req.flash('err', '帳號重複!!');
				res.redirect('/sign_up');
			}
	});
});
router.get('/logout', function(req, res, next){
	req.logout();
	res.redirect('/');
});
router.get('/chat', function(req, res, next){
	res.render('chat', {
		title: '聊天室',
		user : req.user
	})
})

module.exports = router;

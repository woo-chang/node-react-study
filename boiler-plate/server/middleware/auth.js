
const { User } = require('../models/User')

let auth = (req, res, next) => {

    // 인증 처리를 하는 곳

    // 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    // 토큰을 복호화 한 후 유저를 검색
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token; // 외부에서 req.token으로 token 확인 가능
        req.user = user; // 외부에서 req.user로 user 확인 가능
        next();
    })
}


module.exports = { auth };
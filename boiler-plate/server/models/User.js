const mongoose = require('mongoose') // mongoose 모듈 가져옴
const bcrypt = require('bcrypt'); // bcrypt 모듈 가져옴
const saltRounds = 10; // 10자리 Salt 생성
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 중간중간 공백을 없애주는 작업
        unique: 1 // 유니크한 특성을 가지도록 해주는 작업
    },
    password: {
        type: String,
        minlength: 3
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 유저가 관리자가 될 수도 일반 유저가 될 수도 있음
        type: Number,
        default: 0
    },
    image: String, // object를 사용하지 않고 부여 가능
    token: { // 유효성 관리
        type: String,
    },
    tokenExp: { // 토큰의 유효기간
        type: Number
    }
})

userSchema.pre('save', function( next ){

    var user = this; // Schema 객체를 가리킴

    if (user.isModified("password")) { // 비밀번호를 바꿀 때만 처리
      // 비밀번호를 암호화
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err); // err가 발생하면 그냥 다음으로 보내버림

        bcrypt.hash(user.password, salt, function (err, hash) {
          // hash는 암호화 된 비밀번호
          if (err) return next(err);
          user.password = hash;
          next(); // 다음 Line으로 보내버리는 함수
        });
      }); // Salt 생성
    } else {
        next();
    }
    
}) // 저장하기 전에 사전에 하는 작업

userSchema.methods.comparePassword = function(plainPassword, cb) { // 비밀번호와 콜백 함수를 매개변수로

    // 암호화된 데이터를 복호화 할 수는 없기에 비밀번호를 암호화해서 비교하는 방법
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch) // err는 없고 isMatch는 true임을 전달
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken') // user._id + 'secretToken' => Token 생성, 후에 'secretToken' 대입하면 user._id가 나옴

    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 ID를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 token과
        // DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err)
            cb(null, user)
        }) // 유저 아이디는 decoded와 동일
    })
}

const User = mongoose.model('User', userSchema) // 모델이름과 Schema를 인자로 전달

module.exports = { User } // 다른 곳에서도 사용할 수 있도록 export
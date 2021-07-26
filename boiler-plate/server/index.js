const express = require('express') // express 모듈 가져옴
const app = express() // function을 이용, 새로운 express app 생성

const bodyParser = require('body-parser') // body-parser 모듈 가져옴
const cookieParser = require('cookie-parser') // cookie-parser 모듈 가져옴

const config = require('./config/key');

const { auth } = require('./middleware/auth')
const { User } = require('./models/User') // 만들어둔 모델을 가져옴

app.use(express.urlencoded({extended: true})); // application/x-www-form-urlencoded : client의 데이터를 분석해서 가져옴
app.use(express.json()); // application/json
app.use(cookieParser()); // cookie-parser 적용

const moogoose = require('mongoose') // mongoose 모듈 가져옴
moogoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false // 에러를 방지하기 위한 설정
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! ~~~~')
})

app.get('/api/hello', (req, res) => {
  res.send("안녕하세요~")
})

app.post('/api/users/register', (req, res) => {
  
  // 회원 가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body) // 받아온 정보를 모델에 저장, body에 json 형식으로 데이터 저장되어 있음, 이는 bodyParser 덕분

  user.save((err, userInfo) => { // callback Function
    if(err) return res.json({ success: false, err}) // error가 존재하면 json 형식으로 실패여부와 에러 메세지 전달
    return res.status(200).json({ // status 200은 성공을 의미
      success: true
    })
  }) // mongo DB의 메소드


}) // endpoint와 callback Function을 인자로

app.post('/api/users/login', (req, res) => {

  // 요청된 이메일을 데이터베이스에서 검색
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 요청된 이메일이 존재하면 맞는 비밀번호인지 확인
    // 새로 정의한 함수 사용
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) {
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
      }

      // 비밀번호까지 일치하면 토큰 생성
      // 새로 정의한 함수 사용
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err) // status(400)은 에러가 존재함을 의미

        // 토큰을 저장 어디에 ? 쿠키, 로컬스토리지 등
        // 각기 다른 장단점, 여기서는 쿠키에 저장
        res.cookie("x_auth", user.token) // 쿠키 부분에 x_auth라는 이름으로 토큰이 저장
        .status(200)
        .json({ loginSuccess: true, userId: user._id})

      })
    

    })

  })

})

app.get('/api/users/auth', auth, (req, res) => {

  // 여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true
  res.status(200).json({ // 성공했으므로 user 정보 전달
    _id: req.user._id,
    isAdmin: req.user.role === 0? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  
  // 해당 유저를 찾아서 Token을 Update 해주어야 함
  User.findOneAndUpdate({ _id: req.user._id }, 
    { token: "" }
    , (err, user) => {
      if(err) return res.json({ success: false, err})
      return res.status(200).send({
        success: true
      })
    })
})

const port = 5000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
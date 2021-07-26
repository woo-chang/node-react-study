if(process.env.NODE_ENV == 'production') { // environment에 따른 처리
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}
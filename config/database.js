if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb+srv://everyone:everyone@vidjot-prod-lp2ry.mongodb.net/test?retryWrites=true&w=majority'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
}
var constants = require('../conf/constants.json')

module.exports = function container (get, set) {
  var filter_logs = get('utils.filter_logs')
  return get('controller')()
    .get('/', function (req, res, next) {
      var params = {
        limit: constants.log_limit,
        sort: {time: -1},
        query: {
          public: !res.vars.secret
        }
      }
      get('db.logs').select(params, function (err, logs) {
        if (err) return next(err)
        res.vars.logs = filter_logs(logs, res)
        var zmi
        logs.forEach(function (log) {
          if (zmi) return
          if (log.data && log.data.zmi) zmi = log.data.zmi
        })
        if (zmi) {
          res.vars.title = zmi + ' - ' + res.vars.title
        }
        res.render('home')
      })
    })
}
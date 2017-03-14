const request = require('request')
const fieldList = require('./data/fieldList.json')



const nbamboo = {
  fieldList : fieldList,

  config : {
    company : null,
    dataType : "json",
    apiKey : null,
    baseUrl : "api.bamboohr.com/api/gateway.php"
  },

  // =================================== Get ===================================
  // The core get function used by the API
  _get : function (method,callback) {

    var options = {
      url : `https://${this.config.apiKey}:x@${this.config.baseUrl}/${this.config.company}/v1/${method}`,
      headers : {
        "Accept" : `application/${this.config.dataType}`
      }
    }

    request(options, function(error, response, body){
      if (!error && !!body.status && body.status !== 'OK') {
        error = new Error(body.description || body.error_message);
      }
        callback(error, body || {});
    })
  },

  //
  getDirectory : function (callback) {
    return this._get("employees/directory", callback)
  },

  getEmployee : function (employeeNumber, fieldList, callback) {
    return this._get(`employees/${employeeNumber}?fields=${fieldList}`, callback)
  }
}

module.exports = nbamboo

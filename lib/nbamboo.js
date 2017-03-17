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

  // Get a list of the fieldNames from the fieldList
  _getFieldNames : function() {
    var listNames = []
    this.fieldList.forEach(function(item){listNames.push(item.name)})
    return listNames
  },

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

  _post : function (data, method, callback) {

    var options = {
      url : `https://${this.config.apiKey}:x@${this.config.baseUrl}/${this.config.company}/v1/${method}`,
      method : "POST",
      body: data,
      headers : {
        "Content-Type" : `text/xml`,
        'Content-Length': Buffer.byteLength(data)
      }
    }
    request(options, function(error, response, body){
      if (!error && !!body.status && body.status !== 'OK') {
        error = new Error(body.description || body.error_message);
      }
        callback(error, body || {});
    })
  },

  _toXML: function (objectType, data) {
    var xmlData = `<${objectType}>`
    Object.keys(data).forEach(function(item){
      xmlData += `<field id='${item}'>${data[item]}</field>`
    })
    xmlData += `</${objectType}>`
    return xmlData
  },

  // get all employees from the directory
  getDirectory : function (callback) {
    return this._get("employees/directory", callback)
  },

  // get an individual employee
  getEmployee : function (employeeNumber, fieldList, callback) {
    if (fieldList === "*") {
      fieldList = this._getFieldNames()
    }
    return this._get(`employees/${employeeNumber}?fields=${fieldList}`, callback)
  },

  // get all the files associated with company (XML only)
  getCompanyFiles : function (callback) {
    return this._get(`files/view`, callback)
  },

  // get all the files associated with an employee (XML only)
  getEmployeeFiles : function (employeeNumber, callback) {
    return this._get(`employees/${employeeNumber}/files/view`, callback)
  },

  addEmployee : function(employeeData, callback) {
    return this._post(this._toXML('employee',employeeData), 'employees/', callback)
  }

}

module.exports = nbamboo

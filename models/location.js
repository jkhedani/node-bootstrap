var mongoose = require('mongoose');

var sampleSchema = mongoose.Schema({
  scenarioId:           {type: String, default: 'scenarioId', param: '', param2: ''},
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Sample', sampleSchema);

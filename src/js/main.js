// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var $ = require("jquery");
var ich = require("icanhaz");
var questionTemplate = require("./_questionTemplate.html");


console.log(quizData)

ich.addTemplate("questionTemplate", questionTemplate);
console.log(quizData[1])
$(".question-box").html(ich.questionTemplate(quizData[1]));
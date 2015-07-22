// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var $ = require("jquery");
var ich = require("icanhaz");
var questionTemplate = require("./_questionTemplate.html");
var resultTemplate = require("./_resultTemplate.html");

// var score = 0;
var id = 1;

console.log(quizData)

ich.addTemplate("questionTemplate", questionTemplate);
ich.addTemplate("resultTemplate", resultTemplate);

var watchInput = function() {
// show submit button when answer is selected
  $(".quiz-box").on("click", "input", (function(){
    $(".submit").addClass("active");
    $(".submit").attr("disabled", false);
  }));
};

var watchNext = function() {
  $(".next").click(function() {
    // if (id < Object.keys(quizData).length) {
      // move on to next question
      id += 1;
      showQuestion(id);
      $(".next").removeClass("active");
      $(".next").attr("disabled", true);
    // } else {
      // calculateResult();
    // }
  });
};

// $(".question-box").html(ich.questionTemplate(quizData[1]));

var showQuestion = function(questionId) {
  // track("interactive", "pronunciation-quiz", "question-" + questionId);
  // audioCleanup();
  //create new question from template
  $(".question-box").html(ich.questionTemplate(quizData[id]));
  // $(".index").html(id + " of " + Object.keys(quizData).length);
  // audioListeners();
};

$(".quiz-container").on("click", ".submit", function() {
  $(".question-box").html(ich.resultTemplate());
  watchNext();
});

showQuestion(id);
watchInput();

require("./lib/social");
require("./lib/ads");
var track = require("./lib/tracking");
require("component-responsive-frame/child");
var $ = require("jquery");
var ich = require("icanhaz");
var questionTemplate = require("./_questionTemplate.html");
var resultTemplate = require("./_resultTemplate.html");
var overviewTemplate = require("./_overviewTemplate.html");
var Share = require("share");
var shuffle = require("lodash.shuffle");

var score = 0;
var id = 1;
var total = 0;

ich.addTemplate("questionTemplate", questionTemplate);
ich.addTemplate("resultTemplate", resultTemplate);
ich.addTemplate("overviewTemplate", overviewTemplate);

new Share(".share-button", {
  description: "Think you know all the presidential candidates? Test your knowledge with our quiz.",
  // image: "http://projects.seattletimes.com/2015/pronunciation-quiz/assets/fb_sequim.JPG",
  ui: {
    flyout: "top center"
  },
  networks: {
    email: {
      description: "Think you know all the presidential candidates? Test your knowledge with our quiz. http://apps-stage.seattletimesdata.com/extensive-voodoo/"
    }
  }
});

var watchInput = function() {
// show submit button when answer is selected
  $(".quiz-box").on("click", "input", (function(){
    $(".submit").addClass("active");
    $(".submit").attr("disabled", false);
  }));
};

var watchHint = function() {
// show real image when hint is selected
  $(".quiz-box").on("click", ".hint", (function(){
      $(".actual").addClass("active");
      $(".hint").addClass("active");
      $(".orig").removeClass("active");
  }));
};

var watchNext = function() {
  $(".next").click(function() {
    if (id < Object.keys(quizData).length) {
      // move on to next question
      id += 1;
      showQuestion(id);
      $(".next").removeClass("active");
      $(".next").attr("disabled", true);
    } else {
      calculateResult();
    }
  });
};

var showQuestion = function(questionId) {
  //create new question from template
  var sorted_answers = shuffle(quizData[id].answers);
  quizData[id].answers = sorted_answers;
  $(".question-box").html(ich.questionTemplate(quizData[id]));
  $(".index").html(id + " of " + Object.keys(quizData).length);
};

$(".quiz-container").on("click", ".submit", function() {

  // score answer
  var answerData = {};
  answerData.answer = quizData[id].answer;
  var correct = $("input:checked").val();
  total +=1;
  if (correct) {
    score += 1;
    answerData.hooray = true;
  }
  answerData.image = quizData[id].finalImage;
  answerData.summary = quizData[id].summary;
  answerData.name = quizData[id].name;
  track("interactive", "pronunciation-quiz", "question-" + id);
  track("interactive", "pronunciation-quiz", "correctness-" + correct);

  $(".question-box").html(ich.resultTemplate(answerData));
  $(".index").html(id + " of " + Object.keys(quizData).length);

  // Change button text on last question
  if (id == Object.keys(quizData).length) {
    $(".next").html("See results");
  }

  watchNext();
});

var calculateResult = function() {
  for (var index in resultsData) {
    var result = resultsData[index];
    if (score >= result.min && score <= result.max) {
    result.score = score;
    // display result
    result.score = score;
    if (result.score > 5) {
      result.color = "#589040"
    } else if (result.score > 2) {
      result.color = "#F5AE3F"
    } else {
      result.color = "#DE5636"
    }

    result.total = total;
    result.rows = rows;
    $(".question-box").html(ich.overviewTemplate(result));

    new Share(".share-results", {
    description: "I scored " + result.score + "/" + result.total + "! Think you know all the presidential candidates?",
      ui: {
        flyout: "bottom right"
      },
      networks: {
        email: {
          description: "I scored " + result.score + "/" + result.total + "! Think you know all the presidential candidates?"
        }
      }
    });
    }
  }
};

showQuestion(id);
watchInput();
watchHint();

track("quiz-loaded");

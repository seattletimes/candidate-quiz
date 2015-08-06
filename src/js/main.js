require("./lib/social");
require("./lib/ads");
var track = require("./lib/tracking");

var $ = require("jquery");
var Share = require("share");
var shuffle = require("lodash.shuffle");

var ich = require("icanhaz");
var questionTemplate = require("./_questionTemplate.html");
ich.addTemplate("questionTemplate", questionTemplate);
var resultTemplate = require("./_resultTemplate.html");
ich.addTemplate("resultTemplate", resultTemplate);
var overviewTemplate = require("./_overviewTemplate.html");
ich.addTemplate("overviewTemplate", overviewTemplate);

var score = 0;
var id = 1;
var total = 0;

new Share(".share-button", {
  description: "Think you know all the presidential candidates? Test your knowledge with the Seattle Times.",
  // image: "http://projects.seattletimes.com/2015/pronunciation-quiz/assets/fb_sequim.JPG",
  ui: {
    flyout: "top center"
  },
  networks: {
    email: {
      description: "Think you know all the presidential candidates? Test your knowledge with the Seattle Times. " + window.location
    }
  }
});

$(".quiz-box").on("click", "input", (function(){
  $(".submit").addClass("active");
  $(".submit").attr("disabled", false);
}));

$(".quiz-box").on("click", ".hint", function() {
  $(".actual").addClass("active");
  $(".hint").addClass("active");
  $(".orig").removeClass("active");
});

$(".quiz-container").on("click", ".next", function() {
  window.location = "#quiz";
  if (id < Object.keys(quizData).length) {
    // move on to next question
    id++;
    showQuestion(id);
    $(".next").removeClass("active");
    $(".next").attr("disabled", true);
  } else {
    calculateResult();
  }
});

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
  answerData.storyurl = quizData[id].storyurl;
  track("interactive", "pronunciation-quiz", "question-" + id);
  track("interactive", "pronunciation-quiz", "correctness-" + correct);

  $(".question-box").html(ich.resultTemplate(answerData));
  $(".index").html(id + " of " + Object.keys(quizData).length);

  // Change button text on last question
  if (id == Object.keys(quizData).length) {
    $(".next").html("See results");
  }
  window.location = "#quiz";
});

var calculateResult = function() {
  for (var index in resultsData) {
    var result = resultsData[index];
    //move on if we don't match this category
    if (score < result.min * 1 || score > result.max * 1) continue;
    
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
    var nameSort = (a, b) => {
      a = a.name.split(" ").pop();
      b = b.name.split(" ").pop();
      if (a < b) return -1;
      if (b < a) return 1;
      return 0;
    }
    var dem = rows.filter(c => c.party == "D").sort(nameSort);
    var rep = rows.filter(c => c.party == "R").sort(nameSort);
    result.dem = dem;
    result.rep = rep;

    $(".question-box").html(ich.overviewTemplate(result));
    window.location = "#quiz";

    new Share(".share-results", {
      description: "I scored " + result.score + "/" + result.total + "! Think you know all the presidential candidates?",
        ui: {
          flyout: "bottom right"
        },
        networks: {
          email: {
            description: "I scored " + result.score + "/" + result.total + "! Think you know all the presidential candidates? " + window.location
          }
        }
      }
    );
  }
};

showQuestion(id);

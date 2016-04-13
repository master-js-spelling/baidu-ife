(function() {
  var $ = function(sel) {return document.querySelector(sel)};
  function Dialog() {
  }

  Dialog.prototype.hide = function() {
    $(".dialog").style.display = "none";
  }

  Dialog.prototype.show = function() {
    $(".dialog").style.display = "block";
  }

  var dialog = new Dialog();

  $("body").onclick = function (event) {
    dialog.hide();
  }

  $(".dialog").onclick = function(event) {
    event.stopPropagation();
  }


  $("#showDialog").onclick = function(event) {
    dialog.show();
    event.stopPropagation();
  }
})();
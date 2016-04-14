(function() {
  var $ = function(sel) {return document.querySelector(sel)};

  function Dialog(p) {
    var plugin = p,
        ele,
        that = this;

    ele = document.createElement("div");
    ele.className = "dialog-container";
    $("body").appendChild(ele);
    ele.innerHTML ="<div class='dialog'>\
                      <h2>" + plugin.title + "</h2>\
                      <p>" + plugin.content + "</p>\
                      <div class='bar'>\
                        <div class='btn' id='cancel'>取消</div>\
                        <div class='btn' id='confirm'>确定</div>\
                      </div>\
                    </div>";

    this.dialog = $(".dialog");
    this.coverLayer = ele;

    this.dialog.onclick = function(event) {
      if(event.target == $("#confirm")) {
        if(that.confirmCallback && typeof that.confirmCallback === "function")
          that.confirmCallback();
      } else if (event.target == $("#cancel")) {
        if(that.cancelCallback && typeof that.cancelCallback === "function")
          that.cancelCallback();
      } else {
        event.stopPropagation();
      }
    };

    this.coverLayer.onclick = function() {
      that.hide();
    }
  }

  Dialog.prototype = {
    hide: function() {
      $("body").removeChild(this.coverLayer);
    },
    confirm: function(fn) {
      if(fn && typeof fn === "function") {
        this.confirmCallback = fn;
      }
    },
    cancel: function(fn) {
      if(fn && typeof fn === "function") {
        this.cancelCallback = fn;
      }
    }
  };

  $("#showDialog").onclick = function(event) {
    var dialog = new Dialog({
      title: "Tips",
      content: "这是一个弹窗"
    });
    dialog.confirm(function() {
      alert("You clicked confirm");
    });
    dialog.cancel(function() {
      alert("You clicked cancel");
    })
    event.stopPropagation();
  }

})();
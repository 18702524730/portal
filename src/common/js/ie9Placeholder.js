import $ from 'jquery'
const FauxPlaceholder = function(){
	function ElementSupportAttribute(element, attribute) {
	  var test = document.createElement(element);
	  if (attribute in test) {
	    return true;
	  } else {
	    return false;
	  }
	};
  if(!ElementSupportAttribute('input','placeholder')) {
    var els = $("[placeholder]");
    window.ie9Timer = null;
    $.each(els, function(idx, item){
    	var el = $(item);
    	if (el.next().hasClass('placeholder')) {
    		return;
    	}
    	el.focus(function() {
	      var input = $(this);
	      input.next().hide();
	    })
	    .blur(function() {
	      var input = $(this);
      	if (input.val() == "") {
	        input.next().show();
	      }else{
	      	input.next().hide();
	      }
	    })
	    .after('<span class="placeholder"></span>')
	    .next().click(function(){
	      $(this).prev().focus();
	    })
	    .html(function(){
	      return $(this).prev().attr('placeholder');
	    })
	    .parent('.el-input').click(function(){
	    	var self = this;
	    	window.ie9Timer && clearInterval(window.ie9Timer);
	    	window.ie9Count = 150;
	    	window.ie9Timer = setInterval(function(){
	    		if (window.ie9Count<0) {
	    			clearInterval(window.ie9Timer)
	    		}else{
	    			window.ie9Count --;
	    			var input = $('[placeholder]', self);
	    			if (input.val() !== '') {
	    				clearInterval(window.ie9Timer);
	    				input.next().hide();
	    			}
	    		}
	    	},200)
	    })
    	if (el.val() !== '') {
				el.next().hide();
			}
    });
  }
};
export default FauxPlaceholder

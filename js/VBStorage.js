function TVBStorage() {
	var self = this;
  	var storage = {};
    var UpdatePassword;
	self.init = function () {
		$.ajax(
        {
            url : 'http://fe.it-academy.by/AjaxStringStorage2.php', type : 'POST', cache : false,
            data : { f : 'READ', n : 'LOBANOV_LEAP_PROJECT' },
            success : function (data) {storage = JSON.parse(data.result);filesLoad++;preloader();}
    	});
	}
	self.AddValue = function() {
		storage[userID] = userData;
		storeInfo();
	};
	self.GetValue = function(Key) {
		return storage[Key];
	};
	self.GetKeys = function() {
		return Object.keys(storage);	
	};
	var storeInfo = function() {
	    UpdatePassword=Math.random();
	    $.ajax(
	        {
	            url : 'http://fe.it-academy.by/AjaxStringStorage2.php', type : 'POST', cache : false,
	            data : { f : 'LOCKGET', n : 'LOBANOV_LEAP_PROJECT', p : UpdatePassword },
	            success : LockGetReady
	        }
	    );
	};
	var LockGetReady = function (ResultH) {
		$.ajax(
		        {
		            url : 'http://fe.it-academy.by/AjaxStringStorage2.php', type : 'POST', cache : false,
		            data : { f : 'UPDATE', n : 'LOBANOV_LEAP_PROJECT', v : JSON.stringify(storage), p : UpdatePassword }
		        }
		);
	};
}


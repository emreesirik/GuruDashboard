APIRequest = function () {
    APIRequest.baseURL = "http://api.qa.gurumonitor.co/v1/";

    APIRequest.requestUser = function ($http) {
        var userName = "me";
        var url = APIRequest.baseURL + "users/"+ userName;
        return this.createRequest($http ,url );
    };

    APIRequest.requestMachines = function($http) {
        var userName = "me";
        var url = APIRequest.baseURL + "users/"+ userName+"/machines";
        return this.createRequest($http ,url );
    };


    APIRequest.requestMachine = function($http,machineToken) {
        //send last 2 hour before timestamp
        var start = this.getTimestamp() - 7200000;
        var url = APIRequest.baseURL + "machines/"+ machineToken+"?start="+start;
        return this.createRequest($http ,url );
    };

    APIRequest.requestChartData = function($http,machineToken,lastTime) {
        var start = lastTime;
        var url = APIRequest.baseURL + "machines/"+ machineToken+"?start="+start+"&computed=0";
        return this.createRequest($http ,url );
    };

    APIRequest.printTimestamp = function(timestamp) {
      //console.log("Date:" + new Date(timestamp));
    };

    APIRequest.getTimestamp = function() {
        return Math.floor(Date.now());
    };

    APIRequest.createRequest = function ($http,url) {
        var cookie = this.readCookie("PHPSESSID");
        var req = {
            method: 'GET',
            url: url,
            headers: {
               "Cookie": "PHPSESSID="+cookie+"",
                "X-Application-Token": "dT4swIMsvrb7sbn8dqwDW04b0ICwDKLvb4nkU9TQkFzDSnKA",
                'Accept': "application/json"
            }
            ,withCredentials: true
        };
        return $http(req);
    };

    APIRequest.readCookie =function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }


};

new APIRequest();
// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Teams/');
    self.displayName = 'Team Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id=ko.observable('')
    self.Name=ko.observable('')
    self.Sex=ko.observable('')
    self.Num_Athletes=ko.observable('')
    self.Num_Coaches=ko.observable('')
    self.Athletes=ko.observableArray([]);
    self.Coaches=ko.observableArray([]);
    self.NOC=ko.observableArray([]);
    self.Sport=ko.observableArray([]);
    self.Medals=ko.observableArray([]);  
    self.SportName=ko.observable()
    self.NOCName=ko.observable()
    self.Team_Name=ko.observable()
    self.Competition_name=ko.observable()
    self.Sport_name=ko.observable()
    self.NOCId=ko.observable()
    
    //--- Page Events
    self.activate = function (id) {
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.Sex(data.Sex);
            self.Num_Athletes(data.Num_Athletes);
            self.Num_Coaches(data.Num_Coaches);
            self.Athletes(data.Athletes); // Garante que é um array
            self.Coaches(data.Coaches);
            self.NOC(data.NOC);
            self.Sport(data.Sport);
            self.SportName(data.Sport.Name)
            self.NOCName(data.NOC.Name)
            self.NOCId(data.NOC.Id)

            for (let idx = 0; idx < data.Medals.length; idx++) {
                medal = data.Medals[idx]
                switch(medal.Medal_Type) {
                    case 1:
                        data.Medals[idx].Medal_Type = "Gold Medal"
                        break;
                    case 2:
                        data.Medals[idx].Medal_Type = "Silver Medal"
                        break;
                    case 3:
                        data.Medals[idx].Medal_Type = "Bronze Medal"
                        break;
                    default:
                        console.log("Valor desconhecido para Medal_Type");
                }
                
            }


            self.Medals(data.Medals);
            console.log(data.Medals) 
            self.Team_Name(data.Medals.Team_name);
            self.Competition_name(data.Medals.Competition_name);
            self.Sport_name(data.Medals.Sport_name)

        });
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }
 
    
    self.favourites = ko.observableArray([]);

self.toggleFavourite = function (id) {
    if (self.favourites.indexOf(id) === -1) {
        self.favourites.push(id);
    } else {
        self.favourites.remove(id);
    }
    localStorage.setItem("fav2", JSON.stringify(self.favourites()));
};

self.SetFavourites = function () {
    let storage;
    try {
        storage = JSON.parse(localStorage.getItem("fav2"));
    } catch (e) {
        storage = [];
    }
    if (Array.isArray(storage)) {
        self.favourites(storage);
    }
};

// Chame self.SetFavourites ao inicializar o ViewModel
self.SetFavourites();



    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("o bacalhau está no forno!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})
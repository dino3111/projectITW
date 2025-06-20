// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/NOCs/');
    self.displayName = 'Comitee Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');

    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Note = ko.observable('');
    self.Photo = ko.observable('');
    self.Url = ko.observable('');
    self.Athletes = ko.observableArray([]);
    self.Coaches = ko.observableArray([]);
    self.Teams = ko.observableArray([]);
    self.Medals = ko.observableArray([]);

    
    //--- Page Events
    self.activate = function (id) {
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.Note(data.Note);
            self.Photo(data.Photo);
            self.Url(data.Url);
            self.Athletes(data.Athletes)
            self.Coaches(data.Coaches) 
            self.Teams(data.Teams)   
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
    localStorage.setItem("fav3", JSON.stringify(self.favourites()));
};

self.SetFavourites = function () {
    let storage;
    try {
        storage = JSON.parse(localStorage.getItem("fav3"));
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

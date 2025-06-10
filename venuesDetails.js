// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/venues/');
    self.displayName = 'Venue Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.DateStart = ko.observable('');
    self.DateEnd = ko.observable('');
    self.Tag = ko.observable('');
    self.Url = ko.observable('');
    self.Lat = ko.observable('');
    self.Lon = ko.observable('');
    self.Sports = ko.observableArray();
    //--- Page Events
    self.activate = function (id) {
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.DateStart(data.DateStart);
            self.DateEnd(data.DateEnd);
            self.Tag(data.Tag);
            self.Url(data.Url);
            self.Lat(data.Lat);
            self.Lon(data.Lon);
            self.Sports(data.Sports);
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

    self.formatUniqueItems = function(itemsArray, key) {
        // Filtrar os itens únicos baseado na chave fornecida
        var uniqueItems = [];
        
        itemsArray.forEach(function(item) {
            if (!uniqueItems.some(function(uniqueItem) { return uniqueItem[key] === item[key]; })) {
                uniqueItems.push(item);
            }
        });
    
        // Retornar a lista formatada com vírgulas, se houver mais de um item
        if (uniqueItems.length === 1) {
            return uniqueItems[0][key];  // Caso haja apenas um item, retorna apenas a propriedade (sem vírgula)
        } else {
            // Caso haja mais de um item, junta os valores da chave com vírgula
            return uniqueItems.map(function(item) {
                return item[key];
            }).join(', ');  // Junta com vírgulas
        }
    };

    // Formatação para Sports e Competitions
self.SportsFormatted = ko.computed(function() {
    return self.formatUniqueItems(self.Sports(), 'Name'); // 'Name' é a chave para garantir unicidade
});


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
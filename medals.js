// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel iniciado...');
    // Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/medals');
    self.displayName = 'Paris 2024 Medals List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.medals = ko.observableArray([]);
    self.availableSports = ko.observableArray([]); // Lista de esportes
    self.selectedSport = ko.observable(); // Esporte selecionado
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(1044);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);

    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);

    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);

    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);

    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);

    self.totalPages = ko.observable(0);

    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    // Computed para filtrar medalhas com base no esporte selecionado
    self.filteredMedals = ko.computed(function () {
        if (!self.selectedSport() || self.selectedSport() === 'Selecione um esporte') {
            return self.medals(); // Retorna todas as medalhas se nada for selecionado
        } else {
            return ko.utils.arrayFilter(self.medals(), function (medal) {
                return medal.Sport === self.selectedSport();
            });
        }
    });

    // Função para preencher a lista de esportes disponíveis
    self.populateAvailableSports = function () {
        if (self.medals().length > 0) {
            var sportsSet = new Set(self.medals().map(function (medal) {
                return medal.Sport;
            }));
            self.availableSports(Array.from(sportsSet));
        }
    };

    // Função para ativar e carregar dados da API
    self.activate = function (id) {
        console.log('CALL: getmedals...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log("Dados carregados: ", data);
            self.medals(data.Medals || []); // Preenche as medalhas
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize);
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalMedals);

            // Preenche esportes disponíveis após carregar dados
            self.populateAvailableSports();
        });
    };

    // Funções internas
    function ajaxHelper(uri, method, data) {
        self.error(''); // Limpa mensagens de erro
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Falhou...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }

    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        });
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }

    // Iniciar o carregamento
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("ViewModel inicializado!");
};

$(document).ready(function () {
    console.log("Pronto para aplicar bindings do Knockout.js");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});

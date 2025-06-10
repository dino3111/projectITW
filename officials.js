// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/Technical_officials');
    self.displayName = 'Paris 2024 Officials List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.technical_officials = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);

    // Implementação do pageArray corrigido
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1) step = 0;
        else if (self.currentPage() >= self.totalPages() - 4) step = self.totalPages() - 9;
        else step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++) list.push(i + step);
        return list;
    };

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

    // Ativar a página
    self.activate = function (id) {
        console.log('CALL: getTechnicalOfficials...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.technical_officials(data.Technical_officials);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize);
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalOfficials);
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
                console.log("AJAX Call[" + uri + "] Fail...");
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
    };

    // Inicializar
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined) self.activate(1);
    else self.activate(pg);
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    const api_url = "http://192.168.160.58/Paris2024/API/Technical_officials";

    // Configurar o Autocomplete
    $("#search-bar").autocomplete({
        minLength: 2, // Número mínimo de caracteres para buscar
        source: function (request, response) {
            $.ajax({
                type: "GET",
                url: api_url,
                data: { q: request.term }, // Passar o termo pesquisado para o servidor
                success: function (data) {
                    console.log("Dados recebidos:", data);
                    if (data && data.Technical_officials && Array.isArray(data.Technical_officials)) {
                        // Mapear os resultados para o formato necessário
                        var results = data.Technical_officials.map(item => ({
                            label: item.Name, // Nome exibido no autocomplete
                            value: item.Id // ID associado para navegação
                        }));
                        response(results); // Enviar os resultados para o autocomplete
                    } else {
                        response([{ label: "No results found", value: null }]);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Erro ao buscar:", error);
                    response([{ label: "Error fetching data", value: null }]);
                }
            });
        },
        select: function (event, ui) {
            if (ui.item.value) {
                console.log("Selecionado:", ui.item);
                window.location.href = "./officialsDetails.html?id=" + ui.item.value;
            }
        },
        focus: function (event, ui) {
            $("#search-bar").val(ui.item.label);
        }
    });

    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});

var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;

    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Torch_route');
    self.displayName = 'Paris 2024 Torch Route';
    self.records = ko.observableArray([]);

    self.activate = function () {
        console.log('CALL: getRoutes...');
        ajaxHelper(self.baseUri(), 'GET').done(function (data) {
            console.log(data);
            self.records(data);
        });
    };

    self.activate();
    console.log("VM initialized!");
}

function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        error: function (jqXHR, textStatus, errorThrown) {
            alert("AJAX Call[" + uri + "] Fail...");
        }
    });
}

$('document').ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

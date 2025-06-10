var vm = function () {
    var self = this;

    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Swimmings/Events');
    self.resultUri = ko.observable('http://192.168.160.58/Paris2024/api/Swimmings');
    self.events = ko.observableArray([]);
    self.stages = ko.observableArray([]);
    self.results = ko.observableArray([]);
    self.selectedEventId = ko.observable('');
    self.selectedStageId = ko.observable('');
    self.errorMessage = ko.observable('');

    self.activate = function () {
        showLoading();
        ajaxHelper(self.baseUri(), 'GET')
            .done(function (data) {
                console.log('Events data fetched:', data);
                if (Array.isArray(data) && data.length > 0) {
                    self.events(data);
                    self.selectedEventId(data[0].EventId); // Default to the first event
                } else {
                    self.errorMessage('No events available.');
                }
            })
            .fail(function () {
                self.errorMessage('Failed to load events. Please try again later.');
            })
            .always(hideLoading);  // Ensure hideLoading is called after the ajax call
    };

    self.selectedEventId.subscribe(function (newEventId) {
        const selectedEvent = self.events().find(event => event.EventId === newEventId);
        if (selectedEvent) {
            self.stages(selectedEvent.Stages || []);
            if (selectedEvent.Stages && selectedEvent.Stages.length > 0) {
                self.selectedStageId(selectedEvent.Stages[0].StageId); // Default to the first stage
            } else {
                self.selectedStageId('');
                self.results([]);
            }
        } else {
            self.stages([]);
            self.results([]);
        }
    });

    self.selectedStageId.subscribe(function (newStageId) {
        if (newStageId) {
            const eventId = self.selectedEventId();
            const uri = `${self.resultUri()}?EventId=${eventId}&StageId=${newStageId}`;
            showLoading();
            ajaxHelper(uri, 'GET')
                .done(function (data) {
                    console.log('Results data fetched:', data);
                    if (Array.isArray(data)) {
                        self.results(data);
                    } else {
                        self.errorMessage('Invalid data format for results.');
                    }
                })
                .fail(function () {
                    self.errorMessage('Failed to load results. Please try again later.');
                })
                .always(hideLoading);
        } else {
            self.results([]);
        }
    });

    function ajaxHelper(uri, method, data) {
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        });
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }

    function hideLoading() {
        $("#myModal").modal('hide');
    }

    self.activate(); // Initialize the view model
};

$(document).ready(function () {
    ko.applyBindings(new vm());

    // Fix for modal closing issue
    $('#myModal').on('hidden.bs.modal', function () {
        // Ensure that the modal is hidden correctly
        $(this).modal('hide');
    });
});

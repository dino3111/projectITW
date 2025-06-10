var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;

    // ENDPOINTS
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Athletics/Events');
    self.resultUri = ko.observable('http://192.168.160.58/Paris2024/api/Athletics');

    // ARRAYS e OBSERVABLES
    self.events = ko.observableArray([]);
    self.stages = ko.observableArray([]);
    self.results = ko.observableArray([]);
    self.selectedEventId = ko.observable('');
    self.selectedStageId = ko.observable('');
    self.errorMessage = ko.observable('');

    // Função para inicializar a página
    self.activate = function () {
      showLoading();
      ajaxHelper(self.baseUri(), 'GET')
        .done(function (data) {
          console.log('Events data fetched:', data);
          if (Array.isArray(data) && data.length > 0) {
              self.events(data);
              // Default: escolher o 1o evento
              self.selectedEventId(data[0].EventId);
          } else {
              self.errorMessage('No events available.');
          }
        })
        .fail(function () {
          self.errorMessage('Failed to load events. Please try again later.');
        })
        .always(hideLoading);
    };

    // Quando muda "selectedEventId", carrega as "stages"
    self.selectedEventId.subscribe(function (newEventId) {
      const selectedEvent = self.events().find(e => e.EventId === newEventId);
      if (selectedEvent) {
        self.stages(selectedEvent.Stages || []);
        if (selectedEvent.Stages && selectedEvent.Stages.length > 0) {
          // Default: escolher a 1a Stage
          self.selectedStageId(selectedEvent.Stages[0].StageId);
        } else {
          self.selectedStageId('');
          self.results([]);
        }
      } else {
        self.stages([]);
        self.results([]);
      }
    });

    // Quando muda "selectedStageId", carrega os "results"
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

    // AJAX Helper
    function ajaxHelper(uri, method, data) {
      return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null
      });
    }

    // Funções para mostrar/ocultar Modal
    function showLoading() {
      $("#myModal").modal('show', {
        backdrop: 'static',
        keyboard: false
      });
    }
    function hideLoading() {
      $("#myModal").modal('hide');
    }

    // Iniciar
    self.activate();
  };

  // Ao carregar o DOM
  $(document).ready(function () {
    console.log("Document ready, initializing ViewModel...");
    ko.applyBindings(new vm());

    // Fix para fechar modal corretamente
    $('#myModal').on('hidden.bs.modal', function () {
      $(this).modal('hide');
    });
  });
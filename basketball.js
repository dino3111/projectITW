function BasketballsViewModel() {
  const self = this;
  const baseUrl = "http://192.168.160.58/Paris2024/api";

  // Observables
  self.events = ko.observableArray([]);
  self.stages = ko.observableArray([]);
  self.matches = ko.observableArray([]);
  self.selectedEvent = ko.observable("");
  self.selectedStage = ko.observable("");
  self.loadTime = ko.observable(0);
  self.selectedMatch = ko.observable(null);
  self.showDetails = ko.observable(false);

  // Start timing
  const startTime = performance.now();

  // Fetch events when component initializes
  self.fetchEvents = function () {
    fetch(`${baseUrl}/Basketballs/Events`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Eventos carregados:", data); // Log para depuração
        self.events(data);
        // Selecionar o primeiro evento por padrão
        if (data && data.length > 0) {
          self.selectedEvent(data[0].EventId);
          // Selecionar a primeira fase do primeiro evento por padrão
          if (data[0].Stages && data[0].Stages.length > 0) {
            self.selectedStage(data[0].Stages[0].StageId);
          }
        }
        self.loadTime(Math.round(performance.now() - startTime));
      })
      .catch((error) => {
        console.error("Erro ao buscar eventos:", error);
      });
  };

  // Fetch results based on selections
  self.fetchResults = async function () {
    const eventId = self.selectedEvent();
    const stageId = self.selectedStage();

    if (eventId && stageId) {
      try {
        const response = await fetch(
          `${baseUrl}/Basketballs?EventId=${eventId}&StageId=${stageId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const basicData = await response.json();

        // Fetch detailed information for each match without showing modal
        const detailedMatches = await Promise.all(
          basicData.map(async (match) => {
            try {
              const detailsResponse = await fetch(
                `${baseUrl}/Basketballs/${match.Id}`
              );
              if (detailsResponse.ok) {
                return await detailsResponse.json();
              }
            } catch (error) {
              console.error(
                `Erro ao buscar detalhes para a partida ${match.Id}:`,
                error
              );
            }
            return match; // Retorna os dados básicos caso os detalhes não sejam carregados
          })
        );

        console.log("Partidas carregadas:", detailedMatches); // Log para depuração
        self.matches(detailedMatches);
        self.loadTime(Math.round(performance.now() - startTime));
      } catch (error) {
        console.error("Erro ao buscar resultados:", error);
        self.matches([]);
      }
    }
  };

  // Watch for event selection changes
  self.selectedEvent.subscribe(function (newValue) {
    if (newValue) {
      self.stages([]);
      const event = self.events().find((e) => e.EventId === newValue);
      if (event && event.Stages) {
        self.stages(event.Stages);
        // Seleciona a primeira fase automaticamente
        if (event.Stages.length > 0) {
          self.selectedStage(event.Stages[0].StageId);
        }
      }
    }
  });

  // Watch for stage selection changes
  self.selectedStage.subscribe(function (newValue) {
    if (newValue && self.selectedEvent()) {
      self.fetchResults();
    }
  });

  // Show match details in modal
  self.showMatchDetails = function (match) {
    console.log("Exibindo detalhes para:", match); // Log adicional
    self.selectedMatch(match); // Define a partida selecionada
    self.showDetails(true); // Exibe o modal
  };

  self.showDetails.subscribe(function (isVisible) {
    const modalElement = document.getElementById("matchDetailsModal");
    if (isVisible) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  });

  // Close details modal
  self.closeDetails = function () {
    console.log("Fechando modal"); // Para depuração
    self.showDetails(false); // Oculta o modal
    self.selectedMatch(null); // Limpa a partida selecionada
  };

  // Format date for display
  self.formatDate = function (dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  // Initialize
  self.fetchEvents();
}

// Initialize Knockout when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  ko.applyBindings(new BasketballsViewModel());
});

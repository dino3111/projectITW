// ViewModel KnockOut
var vm = function () {
  console.log("ViewModel initiated...");
  //---Variáveis locais
  var self = this;
  self.baseUri = ko.observable("http://192.168.160.58/Paris2024/API/Coaches");
  self.displayName = "Paris 2024 Coaches List";
  self.error = ko.observable("");
  self.passingMessage = ko.observable("");
  self.coaches = ko.observableArray([]);
  self.currentPage = ko.observable(1);
  self.pagesize = ko.observable(20);
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
    if (size < 9 || self.currentPage() === 1) step = 0;
    else if (self.currentPage() >= self.totalPages() - 4)
      step = self.totalPages() - 9;
    else step = Math.max(self.currentPage() - 5, 0);

    for (var i = 1; i <= size; i++) list.push(i + step);
    return list;
  };

  //--- Page Events
  self.activate = function (id) {
    console.log("CALL: getCoaches...");
    var composedUri =
      self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
    ajaxHelper(composedUri, "GET").done(function (data) {
      console.log(data);
      hideLoading();
      self.coaches(data.Coaches);
      self.currentPage(data.CurrentPage);
      self.hasNext(data.HasNext);
      self.hasPrevious(data.HasPrevious);
      self.pagesize(data.PageSize);
      self.totalPages(data.TotalPages);
      self.totalRecords(data.TotalCoaches);
      //self.SetFavourites();
    });
  };

  //--- Internal functions
  function ajaxHelper(uri, method, data) {
    self.error(""); // Clear error message
    return $.ajax({
      type: method,
      url: uri,
      dataType: "json",
      contentType: "application/json",
      data: data ? JSON.stringify(data) : null,
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX Call[" + uri + "] Fail...");
        hideLoading();
        self.error(errorThrown);
      },
    });
  }

  $(document).ready(function () {
    const api_url = "http://192.168.160.58/Paris2024/api/Athletes/Search";

    $("#procura").autocomplete({
      minLength: 3,
      source: function (request, response) {
        $.ajax({
          type: "GET",
          url: api_url,
          data: {
            q: $("#procura").val().toLowerCase(),
          },
          success: function (data) {
            if (!data.length) {
              var result = [
                {
                  label: "Sem resultados",
                  value: response.term,
                },
              ];
              response(result);
            } else {
              var nData = $.map(data.slice(0, 3), function (value, key) {
                return {
                  label: value.Name,
                  value: value.Id,
                };
              });
              results = $.ui.autocomplete.filter(nData, request.term);
              response(results);
            }
          },
          error: function () {
            alert("error!");
          },
        });
      },
      select: function (event, ui) {
        event.preventDefault();
        $("#procura").val(ui.item.label);
        window.location.href = "./athleteDetails.html?id=" + ui.item.value;

        // h.loadTitleModal(ui.item.value)
      },
      focus: function (event, ui) {
        $("#procura").val(ui.item.label);
      },
    });
  });

  self.favourites = ko.observableArray([]);

  self.toggleFavourite = function (id) {
    if (self.favourites.indexOf(id) === -1) {
      self.favourites.push(id);
    } else {
      self.favourites.remove(id);
    }
    localStorage.setItem("favCoaches", JSON.stringify(self.favourites()));
  };

  self.SetFavourites = function () {
    let storage;
    try {
      storage = JSON.parse(localStorage.getItem("favCoaches"));
    } catch (e) {
      storage = [];
    }
    if (Array.isArray(storage)) {
      self.favourites(storage);
    }
  };

  self.SetFavourites();

  function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
  }

  function showLoading() {
    $("#myModal").modal("show", {
      backdrop: "static",
      keyboard: false,
    });
  }
  function hideLoading() {
    $("#myModal").on("shown.bs.modal", function (e) {
      $("#myModal").modal("hide");
    });
  }

  function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split("&"),
      sParameterName,
      i;
    console.log("sPageURL=", sPageURL);
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? true
          : decodeURIComponent(sParameterName[1]);
      }
    }
  }

  //--- start ....
  showLoading();
  var pg = getUrlParameter("page");
  console.log(pg);
  if (pg == undefined) self.activate(1);
  else {
    self.activate(pg);
  }
  console.log("VM initialized!");
};

$(document).ready(function () {
  console.log("ready!");
  ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
  $("#myModal").modal("hide");
});

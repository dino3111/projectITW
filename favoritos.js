document.addEventListener("DOMContentLoaded", function () {
  const favAthletes = JSON.parse(localStorage.getItem("favAthletes")) || [];
  const athletesContainer = document.getElementById(
    "athletes-favorites-container"
  );

  if (favAthletes.length === 0) {
    athletesContainer.innerHTML = "<p>Nenhum atleta nos favoritos.</p>";
  } else {
    favAthletes.forEach((id) => {
      fetch(`http://192.168.160.58/Paris2024/API/athletes/${id}`)
        .then((response) => response.json())
        .then((data) => {
          const athleteCard = document.createElement("div");
          athleteCard.className = "col-12 col-sm-6 col-md-4 col-lg-3 p-2";
          athleteCard.innerHTML = `
                        <div class="card text-center h-100">
                            <img class="card-img-top img-thumbnail" src="${
                              data.Photo || "./imagens/personnotfound.png"
                            }" alt="${data.Name}">
                            <div class="card-body">
                                <p class="card-title">${data.Name}</p>
                                <a href="./athleteDetails.html?id=${
                                  data.Id
                                }" class="btn btn-primary btn-sm">Details</a>
                            </div>
                        </div>`;
          athletesContainer.appendChild(athleteCard);
        })
        .catch((err) =>
          console.error("Erro ao carregar dados do atleta:", err)
        );
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Carregar favoritos de Teams
  const favTeams = JSON.parse(localStorage.getItem("favTeams")) || [];
  const teamsContainer = document.getElementById("teams-favorites-container");

  if (favTeams.length === 0) {
    teamsContainer.innerHTML = "<p>Nenhuma equipa nos favoritos.</p>";
  } else {
    favTeams.forEach((id) => {
      // Substitua por uma chamada AJAX para carregar os dados do Team
      fetch(`http://192.168.160.58/Paris2024/API/Teams/${id}`)
        .then((response) => response.json())
        .then((data) => {
          const teamCard = document.createElement("div");
          teamCard.className = "col-12 col-sm-6 col-md-4 col-lg-3 p-2";
          teamCard.innerHTML = `
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <p class="card-title">${data.Name}</p>
                                <a href="./teamsDetails.html?id=${data.Id}" class="btn btn-primary btn-sm">Details</a>
                            </div>
                        </div>`;
          teamsContainer.appendChild(teamCard);
        })
        .catch((err) =>
          console.error("Erro ao carregar dados da equipa:", err)
        );
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Carregar favoritos de Comités
  const favComites = JSON.parse(localStorage.getItem("favComites")) || [];
  const comitesContainer = document.getElementById(
    "comites-favorites-container"
  );

  if (favComites.length === 0) {
    comitesContainer.innerHTML = "<p>Nenhum comité nos favoritos.</p>";
  } else {
    favComites.forEach((id) => {
      // Substitua por uma chamada AJAX para carregar os dados do Comité
      fetch(`http://192.168.160.58/Paris2024/API/NOCs/${id}`)
        .then((response) => response.json())
        .then((data) => {
          const comiteCard = document.createElement("div");
          comiteCard.className = "col-12 col-sm-6 col-md-4 col-lg-3 p-2";
          comiteCard.innerHTML = `
                        <div class="card text-center h-100">
                            <div class="card-body">
                                                        <img class="card-img-top img-thumbnail" src="${
                                                          data.Photo ||
                                                          "./imagens/personnotfound.png"
                                                        }" alt="${data.Name}">

                                <p class="card-title">${data.Name}</p>
                                <a href="./comitesdetails.html?id=${
                                  data.Id
                                }" class="btn btn-primary btn-sm">Details</a>
                            </div>
                        </div>`;
          comitesContainer.appendChild(comiteCard);
        })
        .catch((err) =>
          console.error("Erro ao carregar dados do comité:", err)
        );
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
    // Carregar favoritos de Venues
    const favVenues = JSON.parse(localStorage.getItem("favVenues")) || [];
    const venuesContainer = document.getElementById("venues-favorites-container");

    if (favVenues.length === 0) {
        venuesContainer.innerHTML = "<p>Nenhum estádio nos favoritos.</p>";
    } else {
        favVenues.forEach(id => {
            // Substitua por uma chamada AJAX para carregar os dados do Venue
            fetch(`http://192.168.160.58/Paris2024/API/venues/${id}`)
                .then(response => response.json())
                .then(data => {
                    const venueCard = document.createElement("div");
                    venueCard.className = "col-12 col-sm-6 col-md-4 col-lg-3 p-2";
                    venueCard.innerHTML = `
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <p class="card-title">${data.Name}</p>
                                <a href="./venuesDetails.html?id=${data.Id}" class="btn btn-primary btn-sm">Details</a>
                            </div>
                        </div>`;
                    venuesContainer.appendChild(venueCard);
                })
                .catch(err => console.error("Erro ao carregar dados do estádio:", err));
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Carregar favoritos de Treinadores
    const favCoaches = JSON.parse(localStorage.getItem("favCoaches")) || [];
    const coachesContainer = document.getElementById("coaches-favorites-container");

    if (favCoaches.length === 0) {
        coachesContainer.innerHTML = "<p>Nenhum treinador nos favoritos.</p>";
    } else {
        favCoaches.forEach(id => {
            // Substitua por uma chamada AJAX para carregar os dados do Treinador
            fetch(`http://192.168.160.58/Paris2024/API/Coaches/${id}`)
                .then(response => response.json())
                .then(data => {
                    const coachCard = document.createElement("div");
                    coachCard.className = "col-12 col-sm-6 col-md-4 col-lg-3 p-2";
                    coachCard.innerHTML = `
                        <div class="card text-center h-100">
                            <div class="card-body">
                                <p class="card-title">${data.Name}</p>
                                <a href="./coachdetails.html?id=${data.Id}" class="btn btn-primary btn-sm">Details</a>
                            </div>
                        </div>`;
                    coachesContainer.appendChild(coachCard);
                })
                .catch(err => console.error("Erro ao carregar dados do treinador:", err));
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Carregar favoritos de Modalidades
    const favSports = JSON.parse(localStorage.getItem("favSports")) || [];
    const sportsContainer = document.getElementById("sports-favorites-container");

    if (favSports.length === 0) {
        sportsContainer.innerHTML = "<p>Nenhuma modalidade nos favoritos.</p>";
    } else {
        favSports.forEach(id => {
            // Substitua por uma chamada AJAX para carregar os dados da Modalidade
            fetch(`http://192.168.160.58/Paris2024/API/sports/${id}`)
                .then(response => response.json())
                .then(data => {
                    const sportCard = document.createElement("div");
                    sportCard.className = "col-12 col-sm-6 col-md-4 col-lg-3 p-2";
                    sportCard.innerHTML = `
                        <div class="card text-center h-100">
                            <img class="card-img-top img-thumbnail" src="${data.Pictogram}" alt="${data.Name}">
                            <div class="card-body">
                                <p class="card-title">${data.Name}</p>
                                <a href="./sportsDetails.html?id=${data.Id}" class="btn btn-primary btn-sm">Details</a>
                            </div>
                        </div>`;
                    sportsContainer.appendChild(sportCard);
                })
                .catch(err => console.error("Erro ao carregar dados da modalidade:", err));
        });
    }
});

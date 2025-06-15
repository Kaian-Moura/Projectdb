document.addEventListener("DOMContentLoaded", function () {
  console.log("Script de gerenciamento de salas carregado");

  const roomList = document.getElementById("roomList");
  if (roomList && roomList.children.length === 0) {
    loadRoomsFromAPI();
  } else {
    attachReservationHandlers();
  }
  setupFilters();
});

function loadRoomsFromAPI() {
  fetch("/api/salas")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((salas) => {
      displayRooms(salas);
      attachReservationHandlers();
    })
    .catch((error) => {
      console.error("Erro ao carregar salas:", error);
      const roomList = document.getElementById("roomList");
      if (roomList) {
        roomList.innerHTML = `<p class="error">Não foi possível carregar as salas. ${error.message}</p>`;
      }
    });
}

/**
 * Exibe as salas no container de lista de salas
 * @param {Array} salas - Array de objetos de sala
 */
function displayRooms(salas) {
  const roomList = document.getElementById("roomList");
  if (!roomList) return;

  roomList.innerHTML = "";

  if (salas.length === 0) {
    roomList.innerHTML = "<p>Nenhuma sala disponível no momento.</p>";
    return;
  }

  salas.forEach((sala) => {
    const roomCard = document.createElement("div");
    roomCard.className = "room-card";

    const roomImage = document.createElement("div");
    roomImage.className = "room-image";
    roomImage.textContent = sala.nome;

    const roomInfo = document.createElement("div");
    roomInfo.className = "room-info";

    const roomName = document.createElement("h3");
    roomName.textContent = sala.nome;

    const capacityPara = document.createElement("p");
    capacityPara.innerHTML = `<strong>Capacidade:</strong> ${sala.capacidade} pessoas`;

    const locationPara = document.createElement("p");
    locationPara.innerHTML = `<strong>Localização:</strong> ${sala.localizacao}`;


    const featuresDiv = document.createElement("div");
    featuresDiv.className = "room-features";

    if (sala.recursos) {
      const recursos = sala.recursos.split(",");
      recursos.forEach((recurso) => {
        const featureSpan = document.createElement("span");
        featureSpan.className = "feature";
        featureSpan.textContent = recurso.trim();
        featuresDiv.appendChild(featureSpan);
      });
    }

  
    roomInfo.appendChild(roomName);
    roomInfo.appendChild(capacityPara);
    roomInfo.appendChild(locationPara);
    roomInfo.appendChild(featuresDiv);

    const reserveBtn = document.createElement("button");
    reserveBtn.className = "reserve-btn";
    reserveBtn.textContent = "Disponível";
    reserveBtn.setAttribute("data-id", sala.id);

    roomCard.appendChild(roomImage);
    roomCard.appendChild(roomInfo);
    roomCard.appendChild(reserveBtn);

    roomList.appendChild(roomCard);
  });
}

function attachReservationHandlers() {
  document.querySelectorAll(".reserve-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const salaId = this.getAttribute("data-id");
      window.location.href = `/reservas-view?sala=${salaId}`;
    });
  });
}

function setupFilters() {
  const filterButton = document.getElementById("aplicarFiltro");
  const clearButton = document.getElementById("limparFiltro");

  if (filterButton) {
    filterButton.addEventListener("click", applyFilters);
  }

  if (clearButton) {
    clearButton.addEventListener("click", clearFilters);
  }
}

function applyFilters() {
  const capacitySelect = document.getElementById("capacidade");
  const dateInput = document.getElementById("dataReserva");

  if (!capacitySelect) return;

  const minCapacity = parseInt(capacitySelect.value) || 1;
  const selectedDate = dateInput ? dateInput.value : "";

  const roomCards = document.querySelectorAll(".room-card");

  roomCards.forEach((card) => {
    const capacityText = card.querySelector("p:nth-child(2)").textContent;
    const capacityMatch = capacityText.match(/\d+/);
    const capacity = capacityMatch ? parseInt(capacityMatch[0]) : 0;

    if (capacity < minCapacity) {
      card.style.display = "none";
    } else {
      card.style.display = "";
    }
  });
}

function clearFilters() {
  const capacitySelect = document.getElementById("capacidade");
  const dateInput = document.getElementById("dataReserva");

  if (capacitySelect) capacitySelect.value = "1";
  if (dateInput) dateInput.value = "";

  document.querySelectorAll(".room-card").forEach((card) => {
    card.style.display = "";
  });
}

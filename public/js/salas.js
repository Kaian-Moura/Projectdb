document.addEventListener("DOMContentLoaded", function () {
  // Função para buscar todas as salas via API
  function loadRooms() {
    fetch("/api/salas")
      .then((response) => response.json())
      .then((salas) => {
        // Exemplo de como mostrar as salas em uma div com id "roomList"
        const roomList = document.getElementById("roomList");
        if (roomList) {
          roomList.innerHTML = "";
          salas.forEach((sala) => {
            const roomCard = document.createElement("div");
            roomCard.className = "room-card";
            roomCard.innerHTML = `
              <h3>${sala.nome}</h3>
              <p>Capacidade: ${sala.capacidade} pessoas</p>
              <p>Localização: ${sala.localizacao}</p>
              <p>Recursos: ${sala.recursos || "Nenhum recurso especial"}</p>
              <button class="reserve-btn" data-id="${sala.id}">Reservar</button>
            `;
            roomList.appendChild(roomCard);
          });

          // Adicionar event listeners para os botões de reserva
          document.querySelectorAll(".reserve-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
              const salaId = this.getAttribute("data-id");
              window.location.href = `/reservas-view?sala=${salaId}`;
            });
          });
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar salas:", error);
      });
  }

  // Carregar salas quando a página iniciar
  loadRooms();
});

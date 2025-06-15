document.addEventListener("DOMContentLoaded", function () {
  // Definir data atual e criar datas futuras para simulação
  const currentYear = 2025;
  const currentDate = new Date(currentYear, 0, 1);

  // Gerar datas para os próximos 14 dias
  function generateDateOptions() {
    const dateSelection = document.getElementById("dateSelection");
    dateSelection.innerHTML = "";

    for (let i = 0; i < 14; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);

      const dateOption = document.createElement("div");
      dateOption.classList.add("date-option");
      dateOption.dataset.date = formatDateValue(date);

      const dayOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][
        date.getDay()
      ];
      const day = date.getDate();
      const month = date.getMonth() + 1;

      dateOption.innerHTML = `${dayOfWeek}, ${day}/${month}`;
      dateOption.addEventListener("click", selectDate);

      dateSelection.appendChild(dateOption);
    }
  }

  // Gerar opções de horário disponíveis
  function generateTimeSlots(selectedDate) {
    const timeSlotSelection = document.getElementById("timeSlotSelection");
    timeSlotSelection.innerHTML = "";

    // Horários disponíveis em intervalos de 1 hora
    const availableSlots = [
      { start: "08:00", end: "09:00" },
      { start: "09:00", end: "10:00" },
      { start: "10:00", end: "11:00" },
      { start: "11:00", end: "12:00" },
      { start: "13:00", end: "14:00" },
      { start: "14:00", end: "15:00" },
      { start: "15:00", end: "16:00" },
      { start: "16:00", end: "17:00" },
      { start: "17:00", end: "18:00" },
    ];

    availableSlots.forEach((slot) => {
      const timeSlot = document.createElement("div");
      timeSlot.classList.add("time-slot");
      timeSlot.dataset.startTime = slot.start;
      timeSlot.dataset.endTime = slot.end;
      timeSlot.innerHTML = `${slot.start} - ${slot.end}`;

      // Verificar disponibilidade (simulação)
      const isAvailable = Math.random() > 0.3;

      if (!isAvailable) {
        timeSlot.classList.add("unavailable");
      } else {
        timeSlot.addEventListener("click", selectTimeSlot);
      }

      timeSlotSelection.appendChild(timeSlot);
    });
  }

  // Selecionar uma data
  function selectDate(e) {
    document.querySelectorAll(".date-option.selected").forEach((el) => {
      el.classList.remove("selected");
    });

    e.target.classList.add("selected");
    const selectedDate = e.target.dataset.date;

    generateTimeSlots(selectedDate);

    // Limpar seleção de horário anterior
    document.querySelectorAll(".time-slot.selected").forEach((el) => {
      el.classList.remove("selected");
    });

    // Limpar campos de data/hora ocultos
    document.getElementById("data_inicio").value = "";
    document.getElementById("data_fim").value = "";
  }

  // Selecionar um horário
  function selectTimeSlot(e) {
    if (e.target.classList.contains("unavailable")) return;

    document.querySelectorAll(".time-slot.selected").forEach((el) => {
      el.classList.remove("selected");
    });

    e.target.classList.add("selected");

    // Preencher campos ocultos de data/hora
    const selectedDateEl = document.querySelector(".date-option.selected");
    if (!selectedDateEl) return;

    const selectedDate = selectedDateEl.dataset.date;
    const startTime = e.target.dataset.startTime;
    const endTime = e.target.dataset.endTime;

    document.getElementById(
      "data_inicio"
    ).value = `${selectedDate}T${startTime}`;
    document.getElementById("data_fim").value = `${selectedDate}T${endTime}`;
  }

  // Formatar data para valor de input
  function formatDateValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Formatar data para input datetime-local
  function formatDateForInput(dateString) {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Data inválida:", dateString);
        return "";
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (e) {
      console.error("Erro ao formatar data:", e, dateString);
      return "";
    }
  }

  // Funções para gerenciar reservas
  window.editReservation = function (id) {
    try {
      const row = document.querySelector(`tr[data-id="${id}"]`);
      if (!row) return;

      document.getElementById("reservationId").value = id;
      document.getElementById("sala").value = row.dataset.sala;
      document.getElementById("usuario_nome").value = row.dataset.usuario;
      document.getElementById("proposito").value = row.dataset.proposito || "";

      // Preencher campos ocultos diretamente
      document.getElementById("data_inicio").value = formatDateForInput(
        row.dataset.inicio
      );
      document.getElementById("data_fim").value = formatDateForInput(
        row.dataset.fim
      );

      // Configurar formulário para modo de edição
      const form = document.getElementById("reservationForm");
      form.action = `/api/reservas/${id}`;
      form.setAttribute("method", "post");

      // Adicionar campo para método PUT
      let methodInput = document.getElementById("_method");
      if (!methodInput) {
        methodInput = document.createElement("input");
        methodInput.type = "hidden";
        methodInput.name = "_method";
        methodInput.id = "_method";
        form.appendChild(methodInput);
      }
      methodInput.value = "PUT";

      // Mostrar botão de cancelar
      document.getElementById("cancelEdit").style.display = "";

      // Rolar até o formulário
      document
        .querySelector(".form-section")
        .scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      console.error("Erro ao editar reserva:", e);
    }
  };

  window.deleteReservation = function (id) {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

    fetch(`/api/reservas/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          showModal(
            "Reserva Cancelada",
            "A reserva foi cancelada com sucesso."
          );
          setTimeout(() => location.reload(), 1500);
        } else {
          showModal("Erro", "Erro ao cancelar reserva.", true);
        }
      })
      .catch((err) => {
        showModal("Erro", "Erro ao processar solicitação.", true);
        console.error(err);
      });
  };

  // Cancelar edição
  document.getElementById("cancelEdit").addEventListener("click", function () {
    resetForm();
  });

  // Filtro por nome
  document
    .getElementById("filterButton")
    .addEventListener("click", function () {
      const filterName = document
        .getElementById("filterName")
        .value.trim()
        .toLowerCase();
      const rows = document.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const usuario = (row.dataset.usuario || "").toLowerCase();
        row.style.display =
          filterName && !usuario.includes(filterName) ? "none" : "";
      });
    });

  // Limpar filtro
  document.getElementById("clearFilter").addEventListener("click", function () {
    document.getElementById("filterName").value = "";
    document
      .querySelectorAll("tbody tr")
      .forEach((row) => (row.style.display = ""));
  });

  // Submissão do formulário via AJAX
  document
    .getElementById("reservationForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const form = this;
      const formData = new FormData(form);
      const url = form.getAttribute("action");
      const method = form.getAttribute("method");

      // Converter FormData para objeto
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Enviar requisição
      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-HTTP-Method-Override":
            document.getElementById("_method")?.value || "",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.error || "Erro ao processar reserva");
            });
          }
          return response.json();
        })
        .then((result) => {
          const isEdit = document.getElementById("_method")?.value === "PUT";
          showModal(
            isEdit ? "Reserva Atualizada" : "Reserva Confirmada",
            isEdit
              ? "Sua reserva foi atualizada com sucesso!"
              : "Sua reserva foi realizada com sucesso!"
          );
          resetForm();
          setTimeout(() => location.reload(), 1500);
        })
        .catch((error) => {
          console.error("Erro:", error);
          showModal(
            "Erro",
            error.message || "Ocorreu um erro ao processar sua reserva.",
            true
          );
        });
    });

  // Modal de confirmação
  function showModal(title, message, isError = false) {
    const modal = document.getElementById("confirmationModal");
    const modalTitle = modal.querySelector(".modal-title");
    const modalMessage = modal.querySelector(".modal-message");
    const modalIcon = modal.querySelector(".modal-icon");

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    if (isError) {
      modalIcon.textContent = "✕";
      modalIcon.style.color = "var(--danger)";
    } else {
      modalIcon.textContent = "✓";
      modalIcon.style.color = "var(--success)";
    }

    modal.style.display = "flex";
  }

  // Fechar modal
  document.querySelector(".close-modal").addEventListener("click", function () {
    document.getElementById("confirmationModal").style.display = "none";
  });

  document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("confirmationModal").style.display = "none";
  });

  // Reset do formulário
  function resetForm() {
    const form = document.getElementById("reservationForm");
    form.reset();
    form.action = "/api/reservas";
    form.setAttribute("method", "post");

    document.getElementById("reservationId").value = "";
    document.getElementById("data_inicio").value = "";
    document.getElementById("data_fim").value = "";

    document
      .querySelectorAll(".date-option.selected, .time-slot.selected")
      .forEach((el) => {
        el.classList.remove("selected");
      });

    document.getElementById("cancelEdit").style.display = "none";

    const methodInput = document.getElementById("_method");
    if (methodInput) methodInput.remove();
  }

  // Inicializar
  generateDateOptions();
});

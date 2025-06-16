/**
 * Script de gerenciamento de reservas
 * Gerencia seleção de datas e horários, envio de formulários e gerenciamento de reservas
 */
document.addEventListener("DOMContentLoaded", function () {
  // Define data atual para o calendário
  const currentDate = new Date();

  // Gerar opções de data
  generateDateOptions();

  // Inicializar manipuladores de formulário
  initializeFormHandlers();

  // Inicializar funcionalidade de filtro
  initializeFilters();

  // Verificar se há um ID de sala na URL para pré-selecionar
  preSelectRoomFromURL();
});

/**
 * Gera opções de data para os próximos 14 dias
 */
function generateDateOptions() {
  const dateSelection = document.getElementById("dateSelection");
  if (!dateSelection) return;

  dateSelection.innerHTML = "";

  for (let i = 0; i < 14; i++) {
    const date = new Date();
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

/**
 * Gera horários disponíveis para a data selecionada
 * @param {string} selectedDate - Data em formato ISO
 */
function generateTimeSlots(selectedDate) {
  const timeSlotSelection = document.getElementById("timeSlotSelection");
  if (!timeSlotSelection) return;

  timeSlotSelection.innerHTML = "";

  // Horários disponíveis (intervalos de 1 hora)
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

  const selectedSalaId = document.getElementById("sala").value;

  if (selectedSalaId && selectedDate) {
    // Em uma aplicação real, verificaríamos a disponibilidade pela API aqui
    // Por enquanto, vamos simular disponibilidade aleatória
    checkTimeSlotAvailability(selectedSalaId, selectedDate).then(
      (availabilityMap) => {
        createTimeSlotElements(availableSlots, availabilityMap);
      }
    );
  } else {
    // Sem sala selecionada, mostra todos os horários como disponíveis
    createTimeSlotElements(availableSlots, {});
  }
}

/**
 * Cria elementos de horário no DOM
 * @param {Array} slots - Array de objetos de horário
 * @param {Object} availabilityMap - Mapa de disponibilidade de horários
 */
function createTimeSlotElements(slots, availabilityMap) {
  const timeSlotSelection = document.getElementById("timeSlotSelection");
  if (!timeSlotSelection) return;

  slots.forEach((slot) => {
    const timeSlot = document.createElement("div");
    timeSlot.classList.add("time-slot");
    timeSlot.dataset.startTime = slot.start;
    timeSlot.dataset.endTime = slot.end;
    timeSlot.innerHTML = `${slot.start} - ${slot.end}`;

    // Verificar se este horário específico está indisponível
    const slotKey = `${slot.start}-${slot.end}`;
    const isAvailable = !availabilityMap[slotKey];

    if (!isAvailable) {
      timeSlot.classList.add("unavailable");
    } else {
      timeSlot.addEventListener("click", selectTimeSlot);
    }

    timeSlotSelection.appendChild(timeSlot);
  });
}

/**
 * Simula verificação de disponibilidade de horários com a API
 * @param {string} salaId - ID da sala
 * @param {string} date - Data em formato ISO
 * @returns {Promise<Object>} - Mapa de disponibilidade
 */
function checkTimeSlotAvailability(salaId, date) {
  // Em uma aplicação real, isso seria uma chamada à API
  // Por enquanto, vamos simular disponibilidade aleatória
  return new Promise((resolve) => {
    setTimeout(() => {
      const availabilityMap = {};
      const slots = [
        "08:00-09:00",
        "09:00-10:00",
        "10:00-11:00",
        "11:00-12:00",
        "13:00-14:00",
        "14:00-15:00",
        "15:00-16:00",
        "16:00-17:00",
        "17:00-18:00",
      ];

      // Marcar aleatoriamente alguns horários como indisponíveis
      slots.forEach((slot) => {
        if (Math.random() < 0.3) {
          availabilityMap[slot] = true;
        }
      });

      resolve(availabilityMap);
    }, 100);
  });
}

/**
 * Manipulador para seleção de data
 * @param {Event} e - Evento de clique
 */
function selectDate(e) {
  // Limpar seleções anteriores
  document.querySelectorAll(".date-option.selected").forEach((el) => {
    el.classList.remove("selected");
  });

  e.target.classList.add("selected");
  const selectedDate = e.target.dataset.date;

  // Gerar horários disponíveis para esta data
  generateTimeSlots(selectedDate);

  // Limpar seleção de horário
  document.querySelectorAll(".time-slot.selected").forEach((el) => {
    el.classList.remove("selected");
  });

  // Limpar campos de data/hora
  document.getElementById("data_inicio").value = "";
  document.getElementById("data_fim").value = "";
}

/**
 * Manipulador para seleção de horário
 * @param {Event} e - Evento de clique
 */
function selectTimeSlot(e) {
  // Evitar seleção de horários indisponíveis
  if (e.target.classList.contains("unavailable")) return;

  // Limpar seleções anteriores
  document.querySelectorAll(".time-slot.selected").forEach((el) => {
    el.classList.remove("selected");
  });

  e.target.classList.add("selected");

  // Obter data selecionada
  const selectedDateEl = document.querySelector(".date-option.selected");
  if (!selectedDateEl) return;

  // Atualizar campos ocultos de data/hora
  const selectedDate = selectedDateEl.dataset.date;
  const startTime = e.target.dataset.startTime;
  const endTime = e.target.dataset.endTime;

  document.getElementById("data_inicio").value = `${selectedDate}T${startTime}`;
  document.getElementById("data_fim").value = `${selectedDate}T${endTime}`;
}

/**
 * Formata um objeto Date para string YYYY-MM-DD
 * @param {Date} date - Objeto Date
 * @returns {string} - String de data formatada
 */
function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formata uma string de data para input datetime-local
 * @param {string} dateString - String de data ISO
 * @returns {string} - String de data/hora formatada
 */
function formatDateForInput(dateString) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Data inválida:", dateString);
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

/**
 * Inicializa manipuladores de formulário de reserva
 */
function initializeFormHandlers() {
  // Manipulador de envio de formulário
  const reservationForm = document.getElementById("reservationForm");
  if (reservationForm) {
    reservationForm.addEventListener("submit", handleFormSubmit);
  }

  // Manipulador de alteração de sala
  const roomSelect = document.getElementById("sala");
  if (roomSelect) {
    roomSelect.addEventListener("change", function () {
      const selectedDateEl = document.querySelector(".date-option.selected");
      if (selectedDateEl) {
        // Atualizar horários quando a sala muda
        generateTimeSlots(selectedDateEl.dataset.date);
      }
    });
  }
}

/**
 * Manipula o envio de formulário via AJAX
 * @param {Event} e - Evento de envio
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const url = form.getAttribute("action");
  const method = form.getAttribute("method");

  // Validar dados antes de enviar
  const salaId = formData.get("sala_id");
  const usuarioNome = formData.get("usuario_nome");
  const dataInicio = formData.get("data_inicio");
  const dataFim = formData.get("data_fim");

  // Validações básicas no cliente
  if (!salaId) {
    showModal("Erro", "Por favor, selecione uma sala", true);
    return;
  }

  if (!usuarioNome || usuarioNome.trim().length < 3) {
    showModal(
      "Erro",
      "Por favor, informe um nome válido (mínimo 3 caracteres)",
      true
    );
    return;
  }

  if (!dataInicio || !dataFim) {
    showModal(
      "Erro",
      "Por favor, selecione data e horário para a reserva",
      true
    );
    return;
  }

  // Garantir que datas estejam no formato ISO
  const dataInicioFormatada = formatarDataISO(dataInicio);
  const dataFimFormatada = formatarDataISO(dataFim);

  // Converter FormData para um objeto regular
  const data = {};
  formData.forEach((value, key) => {
    // Substituir valores de data pelos formatados
    if (key === "data_inicio") {
      data[key] = dataInicioFormatada;
    } else if (key === "data_fim") {
      data[key] = dataFimFormatada;
    } else {
      data[key] = value;
    }
  });

  console.log("Enviando dados:", data); // Log para debug

  // Enviar requisição usando Fetch API
  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-HTTP-Method-Override": document.getElementById("_method")?.value || "",
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (!response.ok) {
        // Tentar obter mensagens de erro detalhadas do servidor
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("Erro detalhado:", errorData);

          let errorMessage = errorData.error || "Erro ao processar reserva";
          if (errorData.details && Array.isArray(errorData.details)) {
            errorMessage += ": " + errorData.details.join(", ");
          }

          throw new Error(errorMessage);
        } else {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
      }
      return response.json();
    })
    .then((result) => {
      // Mostrar confirmação de sucesso
      showModal("Reserva Confirmada", "Sua reserva foi realizada com sucesso!");

      // Resetar formulário
      resetForm();

      // Atualizar a página após um delay
      setTimeout(() => {
        location.reload();
      }, 2000);
    })
    .catch((error) => {
      console.error("Erro:", error);
      showModal(
        "Erro",
        `Ocorreu um erro ao processar sua reserva: ${error.message}`,
        true
      );
    });
}

/**
 * Formata uma string de data para garantir que esteja no formato ISO
 * @param {string} dateString - String de data a ser formatada
 * @returns {string} Data formatada em padrão ISO
 */
function formatarDataISO(dateString) {
  if (!dateString) return "";

  try {
    // Verificar se já está no formato ISO válido
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().slice(0, 19);
    }
    return "";
  } catch (e) {
    console.error("Erro ao formatar data para ISO:", e);
    return "";
  }
}

/**
 * Exibe um modal com a mensagem especificada
 * @param {string} title - Título do modal
 * @param {string} message - Mensagem do modal
 * @param {boolean} isError - Se é uma mensagem de erro
 */
function showModal(title, message, isError = false) {
  const modal = document.getElementById("confirmationModal");
  if (!modal) return;

  const modalTitle = modal.querySelector(".modal-title");
  const modalMessage = modal.querySelector(".modal-message");
  const modalIcon = modal.querySelector(".modal-icon");

  if (modalTitle) modalTitle.textContent = title;
  if (modalMessage) modalMessage.textContent = message;

  if (modalIcon) {
    if (isError) {
      modalIcon.textContent = "✕";
      modalIcon.style.color = "var(--danger)";
    } else {
      modalIcon.textContent = "✓";
      modalIcon.style.color = "var(--success)";
    }
  }

  modal.style.display = "flex";

  // Configurar manipuladores de fechamento se ainda não estiver feito
  setupModalCloseHandlers();
}

/**
 * Configura manipuladores de eventos para fechar o modal
 */
function setupModalCloseHandlers() {
  const modal = document.getElementById("confirmationModal");
  if (!modal) return;

  // Fechar no botão X
  const closeButton = modal.querySelector(".close-modal");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Fechar no botão OK
  const okButton = document.getElementById("closeModal");
  if (okButton) {
    okButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Fechar ao clicar fora
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

/**
 * Reseta o formulário de reserva
 */
function resetForm() {
  const form = document.getElementById("reservationForm");
  if (!form) return;

  form.reset();

  // Resetar campos ocultos
  document.getElementById("reservationId").value = "";
  document.getElementById("data_inicio").value = "";
  document.getElementById("data_fim").value = "";

  // Limpar seleções
  document
    .querySelectorAll(".date-option.selected, .time-slot.selected")
    .forEach((el) => {
      el.classList.remove("selected");
    });

  // Resetar action e método do formulário (always creation mode)
  form.action = "/api/reservas";
  form.setAttribute("method", "post");

  // Remover campo _method se existir
  const methodInput = document.getElementById("_method");
  if (methodInput) {
    methodInput.remove();
  }
}

/**
 * Gerencia exclusão/cancelamento de reserva
 * @param {string} id - ID da reserva
 */
function deleteReservation(id) {
  if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

  fetch(`/api/reservas/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) {
        showModal("Reserva Cancelada", "A reserva foi cancelada com sucesso");
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        throw new Error("Erro ao cancelar reserva");
      }
    })
    .catch((err) => {
      console.error(err);
      showModal("Erro", "Erro ao cancelar reserva. Tente novamente.", true);
    });
}

/**
 * Inicializa funcionalidade de filtro de reservas
 */
function initializeFilters() {
  const filterButton = document.getElementById("filterButton");
  if (filterButton) {
    filterButton.addEventListener("click", filterReservations);
  }

  const clearFilterButton = document.getElementById("clearFilter");
  if (clearFilterButton) {
    clearFilterButton.addEventListener("click", clearFilters);
  }
}

/**
 * Filtra reservas por nome de usuário
 */
function filterReservations() {
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
}

/**
 * Limpa filtros de reservas aplicados
 */
function clearFilters() {
  document.getElementById("filterName").value = "";
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row) => (row.style.display = ""));
}

/**
 * Pré-seleciona uma sala se especificada nos parâmetros de URL
 */
function preSelectRoomFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("sala");

  if (roomId) {
    const roomSelect = document.getElementById("sala");
    if (roomSelect) {
      roomSelect.value = roomId;

      // Se uma data estiver já selecionada, atualizar horários
      const firstDateOption = document.querySelector(".date-option");
      if (firstDateOption) {
        // Selecionar a primeira data disponível automaticamente
        firstDateOption.click();
      }

      // Rolar para o formulário
      document
        .querySelector(".form-section")
        .scrollIntoView({ behavior: "smooth" });
    }
  }
}
// Expor funções necessárias para manipuladores de eventos inline
window.deleteReservation = deleteReservation;
    .catch((err) => {
      console.error(err);
      showModal("Erro", "Erro ao cancelar reserva. Tente novamente.", true);
    });
}

/**
 * Inicializa funcionalidade de filtro de reservas
 */
function initializeFilters() {
  const filterButton = document.getElementById("filterButton");
  if (filterButton) {
    filterButton.addEventListener("click", filterReservations);
  }

  const clearFilterButton = document.getElementById("clearFilter");
  if (clearFilterButton) {
    clearFilterButton.addEventListener("click", clearFilters);
  }
}

/**
 * Filtra reservas por nome de usuário
 */
function filterReservations() {
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
}

/**
 * Limpa filtros de reservas aplicados
 */
function clearFilters() {
  document.getElementById("filterName").value = "";
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row) => (row.style.display = ""));
}

/**
 * Pré-seleciona uma sala se especificada nos parâmetros de URL
 */
function preSelectRoomFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("sala");

  if (roomId) {
    const roomSelect = document.getElementById("sala");
    if (roomSelect) {
      roomSelect.value = roomId;

      // Se uma data estiver já selecionada, atualizar horários
      const firstDateOption = document.querySelector(".date-option");
      if (firstDateOption) {
        // Selecionar a primeira data disponível automaticamente
        firstDateOption.click();
      }

      // Rolar para o formulário
      document
        .querySelector(".form-section")
        .scrollIntoView({ behavior: "smooth" });
    }
  }
}
// Expor funções necessárias para manipuladores de eventos inline
window.editReservation = editReservation;
window.deleteReservation = deleteReservation;

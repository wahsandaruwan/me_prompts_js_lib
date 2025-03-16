class AlertModal {
  constructor() {
    this.injectLibs();
    this.injectStyles();
    this.alertContainer = this.getAlertContainer();
  }

  injectLibs() {
    if (!document.getElementById("fontawesome-cdn")) {
      const fontAwesome = `<link rel="stylesheet" id="fontawesome-cdn" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">`;
      document.head.innerHTML += fontAwesome;
    }
  }

  injectStyles() {
    if (!document.getElementById("alert-modal-styles")) {
      const styleElement = `
            <style>
              .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                visibility: hidden;
                opacity: 0;
                transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;;
              }
              .modal.show {
                visibility: visible;
                opacity: 1;
              }
              .modal-dialog {
                background: white;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                min-width: 300px;
              }
              .modal-header {
                display: flex;
                justify-content: flex-end;
              }
              .modal-body {
                text-align: center;
                padding: 20px;
              }
              .modal-footer {
                display: flex;
                justify-content: center;
                gap: 10px;
                padding-top: 10px;
              }
              .btn {
                padding: 10px 20px;
                border: none;
                cursor: pointer;
                border-radius: 3px;
                transition: background 0.3s;
              }
              .btn:hover {
                filter: brightness(90%);
              }
              /* Close button */
              .modal-close-btn {
                background: none;
                color: #000000;
                border: none;
                outline: none;
                font-size: 1.3rem;
                cursor: pointer;
                transition: color 0.3s ease-in-out;
              }
              .modal-close-btn:hover {
                color:#5e5d5d !important;
              }
            </style>
          `;
      document.head.innerHTML += styleElement;
    }
  }

  getAlertContainer() {
    let container = document.getElementById("alert-modal-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "alert-modal-container";
      document.body.appendChild(container);
    }
    return container;
  }

  generateId() {
    return `alert_${Date.now()}`;
  }

  confirmationAlert(params) {
    const {
      id = this.generateId(),
      modal_size = "md",
      icon = "fa-solid fa-triangle-exclamation",
      icon_size = "60px",
      icon_color = "#e9e335",
      ok_label = "Ok",
      ok_background = "#e9e335",
      ok_color = "#323a46",
      ok_callback = () => {},
      cancel_label = "Cancel",
      cancel_background = "#eef2f7",
      cancel_color = "#323a46",
      cancel_callback = () => {},
      extra_btn = false,
      extra_label = "Extra",
      extra_background = "#299e11",
      extra_color = "#323a46",
      extra_callback = () => {},
      close = true,
      close_callback = () => {},
      body = "Are you sure?",
      footer_show = true,
    } = params;

    const extraButtonHtml = extra_btn
      ? `<button class="btn" id="extra_${id}" style="background:${extra_background}; color:${extra_color}">${extra_label}</button>`
      : "";

    const html_modal = `
          <div class="modal" id="${id}">
            <div class="modal-dialog modal-${modal_size}">
              <div class="modal-header">
                ${
                  close
                    ? `<button class="modal-close-btn" id="close_${id}"><i class="fa-solid fa-xmark"></i></button>`
                    : ""
                }
              </div>
              <div class="modal-body">
                <i class="${icon}" style="color: ${icon_color}; font-size: ${icon_size};"></i>
                <div class="my-3">${body}</div>
              </div>
              ${
                footer_show
                  ? `
              <div class="modal-footer">
                <button class="btn" id="cancel_${id}" style="background:${cancel_background}; color:${cancel_color}">${cancel_label}</button>
                ${extraButtonHtml}
                <button class="btn" id="ok_${id}" style="background:${ok_background}; color:${ok_color}">${ok_label}</button>
              </div>`
                  : ""
              }
            </div>
          </div>`;

    this.alertContainer.innerHTML += html_modal;
    const modal = document.getElementById(id);
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);

    const closeModalAndExecuteCallback = (callback) => {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.remove();
        callback();
      }, 300);
    };

    document.getElementById(`ok_${id}`).onclick = () =>
      closeModalAndExecuteCallback(ok_callback);
    document.getElementById(`cancel_${id}`).onclick = () =>
      closeModalAndExecuteCallback(cancel_callback);
    if (close)
      document.getElementById(`close_${id}`).onclick = () =>
        closeModalAndExecuteCallback(close_callback);
    if (extra_btn)
      document.getElementById(`extra_${id}`).onclick = () =>
        closeModalAndExecuteCallback(extra_callback);

    return id;
  }

  basicAlert(type, message, timeout = 3000, close_callback = () => {}) {
    const alertTypes = {
      information: { icon: "fa-solid fa-circle-info", icon_color: "#447ee4" },
      success: { icon: "fa-solid fa-circle-check", icon_color: "#4bbf45" },
      warning: {
        icon: "fa-solid fa-triangle-exclamation",
        icon_color: "#e9e335",
      },
      error: { icon: "fa-solid fa-circle-xmark", icon_color: "#e13333" },
    };

    const alertType = alertTypes[type] || alertTypes.information;
    const id = this.confirmationAlert({
      id: this.generateId(),
      icon: alertType.icon,
      icon_color: alertType.icon_color,
      close_callback,
      body: message,
      footer_show: false,
      close: true,
    });

    setTimeout(() => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.remove("show");
        setTimeout(() => modal.remove(), 300);
      }
    }, timeout);
  }

  basicLoading(message, callback = () => {}) {
    const id = this.confirmationAlert({
      id: this.generateId(),
      icon: "fa-solid fa-spinner fa-spin",
      icon_size: "50px",
      icon_color: "#929394",
      body: message,
      footer_show: false,
      close: false,
    });

    const done = () => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.remove("show");
        setTimeout(() => modal.remove(), 300);
      }
    };

    setTimeout(() => callback(done), 500);
  }
}

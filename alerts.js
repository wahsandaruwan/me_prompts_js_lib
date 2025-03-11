class AlertModal {
    constructor() {
      this.injectStyles();
      this.alertContainer = this.getAlertContainer();
    }
  
    injectStyles() {
      if (!document.getElementById("alert-modal-styles")) {
        const styleElement = document.createElement("style");
        styleElement.id = "alert-modal-styles";
        styleElement.innerHTML = `
          .btn { transition: all 0.3s ease-in-out; }
          .modal-close-btn { outline: none !important; box-shadow: none !important; font-size: 1.3rem !important; }
          .modal-close-btn:hover { color: #1b1919 !important; }
          .modal-footer .btn { min-width: 100px !important; border-radius: 3px !important; }
          .modal-footer .btn:hover { background: #979797 !important; }
        `;
        document.head.appendChild(styleElement);
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
  
    confirmationAlert({
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
    }) {
      const extraButtonHtml = extra_btn
        ? `<button type="button" class="btn modal-extra-btn" id="extra_${id}" style="background:${extra_background}; color:${extra_color}">${extra_label}</button>`
        : "";
  
      const html_modal = `
        <div class="modal fade" id="${id}" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-${modal_size}" role="document">
            <div class="modal-content">
              <div class="modal-header" style="border-bottom: none;">
                ${close ? `<button type="button" class="close modal-close-btn" id="close_${id}" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>` : ""}
              </div>
              <div class="modal-body text-center">
                <i class="${icon}" style="color: ${icon_color}; font-size: ${icon_size};"></i>
                <div class="my-3">${body}</div>
              </div>
              ${footer_show ? `
                <div class="modal-footer d-flex justify-content-center">
                  <button type="button" class="btn modal-cancel-btn" id="cancel_${id}" style="background:${cancel_background}; color:${cancel_color}">${cancel_label}</button>
                  ${extraButtonHtml}
                  <button type="button" class="btn modal-ok-btn" id="ok_${id}" style="background:${ok_background}; color:${ok_color}">${ok_label}</button>
                </div>
              ` : ""}
            </div>
          </div>
        </div>`;
  
      this.alertContainer.innerHTML += html_modal;
  
      const modal = $(`#${id}`);
      modal.modal("show");
  
      const closeModalAndExecuteCallback = (callback) => {
        modal.modal("hide").one("hidden.bs.modal", () => {
          callback();
          modal.remove();
        });
      };
  
      $(`#ok_${id}`).off("click").on("click", () => closeModalAndExecuteCallback(ok_callback));
      $(`#cancel_${id}`).off("click").on("click", () => closeModalAndExecuteCallback(cancel_callback));
      $(`#close_${id}`).off("click").on("click", () => closeModalAndExecuteCallback(close_callback));
      if (extra_btn) {
        $(`#extra_${id}`).off("click").on("click", () => closeModalAndExecuteCallback(extra_callback));
      }
  
      return id;
    }
  
    basicAlert(type, message, timeout = 3000, close_callback = () => {}) {
      const alertTypes = {
        information: { icon: "fa-solid fa-circle-info", icon_color: "#447ee4" },
        success: { icon: "fa-solid fa-circle-check", icon_color: "#4bbf45" },
        warning: { icon: "fa-solid fa-triangle-exclamation", icon_color: "#e9e335" },
        error: { icon: "fa-solid fa-circle-xmark", icon_color: "#e13333" },
      };
  
      const alertType = alertTypes[type] || alertTypes.information;
      const id = this.confirmationAlert({ id: this.generateId(), icon: alertType.icon, icon_color: alertType.icon_color, close_callback, body: message, footer_show: false, close: true });
  
      setTimeout(() => {
        const modal = $(`#${id}`);
        if (modal.length) {
          modal.modal("hide").one("hidden.bs.modal", () => modal.remove());
        }
      }, timeout);
    }
  
    basicLoading(message, callback = () => {}) {
      const id = this.confirmationAlert({ id: this.generateId(), icon: "fa-solid fa-spinner fa-spin", icon_size: "50px", icon_color: "#929394", body: message, footer_show: false, close: false });
      
      const done = () => {
        const modal = $(`#${id}`);
        if (modal.length) {
          modal.modal("hide").one("hidden.bs.modal", () => modal.remove());
        }
      };
  
      $(`#${id}`).one("shown.bs.modal", () => callback(done));
    }
  }
  
  const amgApi = new AlertModal();
  
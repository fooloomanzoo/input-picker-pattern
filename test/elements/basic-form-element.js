import { FormElementMixin } from '../../form-element-mixin.js';
import { PolymerElement, html } from '../../../../@polymer/polymer/polymer-element.js';

class BasicFormElement extends FormElementMixin(PolymerElement) {

  static get template() {
    return html`
      <style>
        :host {
          margin: 4px;
        }
        .content {
          background: rgb(38, 43, 85, 0.1);
          padding: 4px;
        }
        :host([invalid]) .content {
          background: rgb(166, 201, 63, 0.5);
          color: rgb(222, 205, 237);
        }
      </style>
      <div class="content">
        [[value]]
      </div>
    `;
  }

  static get is() {
    return 'basic-form-element';
  }

  static get properties() {
    return {
      custom1: String,
      propertyForValue: {
        value: 'custom1'
      }
    }
  }
}
customElements.define(BasicFormElement.is, BasicFormElement);

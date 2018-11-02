import '@polymer/polymer/polymer-legacy.js';
import { SwitchMixin } from '../../switch-mixin.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class BasicSwitchElement extends SwitchMixin(PolymerElement) { // eslint-disable-line no-undef
  static get is() {
    return 'basic-switch-element';
  }
  static get template() {
    return `
      <div id="up" prop="value" step="1" class="switch">${this._iconStepUpTemplate}</div>
    `;
  }
  static get properties() {
    return {
      value: Number
    };
  }
}
customElements.define(BasicSwitchElement.is, BasicSwitchElement);

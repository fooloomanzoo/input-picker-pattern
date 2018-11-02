import '@polymer/polymer/polymer-legacy.js';
import { InputPattern } from '../../input-pattern.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class BasicInputElement extends InputPattern(PolymerElement) { // eslint-disable-line no-undef
  static get is() {
    return 'basic-input-element';
  }
  static get styleTemplate() {
    return `
      ${super.styleTemplate || ''}
      :host {
        --input-border-style: dashed;
        --input-border-width: medium;
        --input-border-color: blue;
      }
    `;
  }
}
customElements.define(BasicInputElement.is, BasicInputElement);

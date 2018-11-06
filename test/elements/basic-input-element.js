import { InputPattern } from '../../input-pattern.js';
import { PolymerElement } from '../../../../@polymer/polymer/polymer-element.js';
import { htmlLiteral } from '../../../../@polymer/polymer/lib/utils/html-tag.js';

class BasicInputElement extends InputPattern(PolymerElement) {
  static get is() {
    return 'basic-input-element';
  }
  static get styleTemplate() {
    return htmlLiteral`
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

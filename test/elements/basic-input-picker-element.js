import { InputPickerPattern } from '../../input-picker-pattern.js';
import { PolymerElement } from '../../../../@polymer/polymer/polymer-element.js';
import { htmlLiteral } from '../../../../@polymer/polymer/lib/utils/html-tag.js';

class BasicInputPickerElement extends InputPickerPattern(PolymerElement) {
  static get is() {
    return 'basic-input-picker-element';
  }
  static get expectedNativeInputType() {
    return htmlLiteral`text`;
  }
}
customElements.define(BasicInputPickerElement.is, BasicInputPickerElement);

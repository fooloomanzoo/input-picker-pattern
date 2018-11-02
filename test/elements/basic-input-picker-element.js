import '@polymer/polymer/polymer-legacy.js';
import { InputPickerPattern } from '../../input-picker-pattern.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class BasicInputPickerElement extends InputPickerPattern(PolymerElement) { // eslint-disable-line no-undef
  static get is() {
    return 'basic-input-picker-element';
  }
  static get expectedNativeInputType() {
    return 'number';
  }
}
customElements.define(BasicInputPickerElement.is, BasicInputPickerElement);

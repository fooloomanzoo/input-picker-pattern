import '@polymer/polymer/polymer-legacy.js';
import { InputPickerPattern } from '../../overlay-picker-mixin.js';
import { OverlayPickerMixin } from '../../input-picker-pattern.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class BasicOverlayPickerElement extends OverlayPickerMixin(InputPickerPattern(PolymerElement)) { // eslint-disable-line no-undef
  static get is() {
    return 'basic-overlay-picker-element';
  }
  static get expectedNativeInputType() {
    return 'number';
  }
}
customElements.define(BasicOverlayPickerElement.is, BasicOverlayPickerElement);

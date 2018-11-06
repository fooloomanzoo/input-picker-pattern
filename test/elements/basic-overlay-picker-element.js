import { InputPickerPattern } from '../../input-picker-pattern.js';
import { OverlayPickerMixin } from '../../overlay-picker-mixin.js';
import { PolymerElement } from '../../../../@polymer/polymer/polymer-element.js';
import { htmlLiteral } from '../../../../@polymer/polymer/lib/utils/html-tag.js';

class BasicOverlayPickerElement extends OverlayPickerMixin(InputPickerPattern(PolymerElement)) {
  static get is() {
    return 'basic-overlay-picker-element';
  }
  static get expectedNativeInputType() {
    return htmlLiteral`text`;
  }
}
customElements.define(BasicOverlayPickerElement.is, BasicOverlayPickerElement);

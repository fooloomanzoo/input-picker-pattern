import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * `overlay-element`
 * A helper-element, that creates an overlay using `iron-overlay-behavior` of Polymer.
 *
 *   @customElement
 *   @polymer
 *
 *   @appliesMixin Polymer.IronOverlayBehavior
 *
 */
export class OverlayElement extends mixinBehaviors([IronOverlayBehavior], PolymerElement) {

  static get is() {
    return 'overlay-element';
  }

  static get template() {
    return html`
      <slot></slot>
    `;
  }

  static get observers() {
    return [
      '_fitIntoChanged(fitInto, positionTarget)'
    ]
  }

  _fitIntoChanged(fitInto, positionTarget) {
    if (fitInto && positionTarget) {
      this.fit();
    }
  }

  /**
   * attach dom with `delegatesFocus: true` so that the element is also focussed while its's children are too, and to autofocus to first tabable
   */
  _attachDom(dom) {
    if (!this.shadowRoot) {
      this.attachShadow({
          mode: 'open',
          delegatesFocus: true
      });
      this.shadowRoot.appendChild(dom);
    }
    return this.shadowRoot;
  }
}

if (!customElements.get(OverlayElement.is)) {
  customElements.define(OverlayElement.is, OverlayElement);
}

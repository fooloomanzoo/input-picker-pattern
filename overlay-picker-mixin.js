import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import './overlay-element.js';

/**
 * mixin to extend an picker with an `overlay-element`
 *
 * @mixinFunction
 * @polymer
 */
export const OverlayPickerMixin = dedupingMixin( superClass => {

  return class extends superClass {

    static get properties() {
      return {
        /**
         * Set to true to keep overlay always on top.
         */
        alwaysOnTop: {
          type: Boolean
        },
        /**
         * Will position the element around the positionTarget without overlapping it.
         */
        noOverlap: {
          type: Boolean,
          value: false
        },
        /**
         * Set to true to display a backdrop behind the overlay. It traps the focus
         * within the light DOM of the overlay.
         */
        withBackdrop: {
          type: Boolean,
          value: false
        },
        /**
         * Set to true to disable canceling the overlay by clicking outside it.
         */
        noCancelOnOutsideClick: {
          type: Boolean,
          value: false
        },

        /**
         * If true, it will use `horizontalAlign` and `verticalAlign` values as preferred alignment
         * and if there's not enough space, it will pick the values which minimize the cropping.
         */
        dynamicAlign: {
          type: Boolean,
          reflectToAttribute: true
        },

        /**
         * Set to true to auto-fit on attach.
         */
        autoFitOnAttach: {
          type: Boolean,
          value: false
        },

        /**
         * The element to fit the overlay into. By default it is the window.
         */
        fitInto: {
          type: Object
        },

        /**
         * The element that should be used to position the overlay. If not set, it will
         * default to the polyfill node.
         */
        positionTarget: {
          type: Element
        },

        _sizingTarget: {
          type: Element,
          readOnly: true
        }
      }
    }

    static get pickerTemplate() {
      return html`
        <overlay-element id="overlay"
          always-on-top="[[alwaysOnTop]]"
          with-backdrop="[[withBackdrop]]"
          no-cancel-on-outside-click="[[noCancelOnOutsideClick]]"
          no-cancel-on-esc-key="[[noCancelOnEscKey]]"
          no-overlap="[[noOverlap]]"
          auto-fit-on-attach="[[autoFitOnAttach]]"
          dynamic-align="[[dynamicAlign]]"
          vertical-align="[[verticalAlign]]"
          horizontal-align="[[horizontalAlign]]"
          position-target="[[positionTarget]]"
          sizing-target="[[_sizingTarget]]"
          fit-into="[[fitInto]]"
          opened="{{opened}}">
          ${super.pickerTemplate}
        </overlay-element>
      `;
    }

    static get styleTemplate() {
      return html`
        ${super.styleTemplate || html``}
        <style>
          #overlay {
            display: inline-flex;
            flex-shrink: 0;
            padding: 0;
          }
        </style>
      `;
    }

    connectedCallback() {
      super.connectedCallback();
      this.positionTarget = this;
      this._set_sizingTarget(this.$.overlay);
      this.fit();
    }

    /**
     * Positions and fits the overlay into the `fitInto` element.
     */
    fit() {
      this.$.overlay.fit();
    }

    open() {
      super.open();
      this.fit();
    }

    /**
     * notify manually the overlay to resize
     */
    notifyResize() {
      this.$.overlay.notifyResize();
    }
  }
});

import { dedupingMixin } from '../../@polymer/polymer/lib/utils/mixin.js';
import { html } from '../../@polymer/polymer/lib/utils/html-tag.js';
import { FormElementMixin } from './form-element-mixin.js';
import { style as inputStyle } from './input-shared-style.js';

/**
 * get bounding client rect by a relative node that could be hidden by its context
 * @param  {Node} relative  the node to get the sizing information from
 * @param  {Boolean} forceClone force to clone the relative (e.g. initial loading)
 */
export const getBoundingClientRectByRelative = (relative, forceClone) => {
  // measure the width of the test element
  let bbox;
  if (!forceClone) {
    bbox = relative.getBoundingClientRect();
  }
  if (!(bbox && bbox.width !== 0 && bbox.height !== 0)) {
    // if that fails, it could be, that the element is hidden
    const relativeClone = relative.cloneNode(true);
    // therefore clone the node to document level and add some basic styles of the relative, that could define the elements's dimensions
    const style = document.defaultView.getComputedStyle(relative, '');
    ['font-family', 'font-size', 'font-weight', 'font-stretch', 'font-style', 'min-width', 'max-width', 'min-height', 'max-height', 'line-height', 'width', 'height', 'word-spacing'].reduce(
      ( accumulator, currentValue) => {
        if (currentValue && style[currentValue]) {
          relativeClone.style[currentValue] = style[currentValue];
        }
      }, 'letter-spacing');
    relativeClone.style.visibility = 'hidden';
    relativeClone.style.position = 'fixed';
    relativeClone.style.left = '0';
    relativeClone.style.top = '0';
    document.body.appendChild(relativeClone);
    bbox = relativeClone.getBoundingClientRect();
    relativeClone.parentElement.removeChild(relativeClone);
  }
  return bbox;
}

/**
 * Mixin to extend an element that includes a native input to be wrapped to enable content-based resizing and validation. The pattern is using `input-shared-style` to unify the style between different inputs and should resize according to its properties and input.
 *
 * @appliesMixin FormElementMixin
 *
 * @mixinFunction
 * @polymer
 */
export const InputPattern = dedupingMixin( superClass => {

  return class extends FormElementMixin(superClass) {

    constructor() {
      super();
      this.focus = this.focus.bind(this);
      this.blur = this.blur.bind(this);
      this.resize = this.resize.bind(this);
      this._updateInput = this._updateInput.bind(this);
      this._confirmInput = this._confirmInput.bind(this);
      this._checkKeycode = this._checkKeycode.bind(this);
      this._resizeWidth = this._resizeWidth.bind(this);
      this.__minSizeInitialized = false;
    }

    static get template() {
      return html`
        ${this.styleTemplate}</style>
        ${this.inputTemplate}
        <div id="size">[[input]]</div>
        <div id="minlength">[[_minlengthString]]</div>
      `;
    }

    static get styleTemplate() {
      return html`
        ${inputStyle}
        <style>
          #input {
            width: 0;
          }
          #minlength,
          #size {
            position: fixed;
            top: 0; left: 0; right: auto; bottom: auto;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
            font-style: inherit;
            letter-spacing: inherit;
            outline: none;
            min-width: inherit;
            max-width: inherit;
            margin: 0;
            padding: 0;
            visibility: hidden;
          }
        </style>
      `;
    }

    /**
    * @overwrite
    * this input-template is suposed to be overwritten to a custon implementation
    * NOTE: '@fooloomanzoo/text-input' implements also pattern validation
    */
    static get inputTemplate() {
      return html`
        <input id="input"
          type="[[type]]"
          value="{{input::input}}"
          placeholder="[[placeholder]]"
          required$="[[required]]"
          disabled$="[[disabled]]"
          title$="[[title]]"
          spellcheck="false"
          autocomplete="off">
      `;
    }

    static get properties() {
      return {
        /**
         * the type of the native input
         */
        type: {
          type: String,
          value: 'text'
        },

        /**
         * the immediate input string
         */
        input: {
          type: String,
          notify: true,
          observer: '_inputChanged'
        },

        /**
         * message to set on the input to show if the input does not validate
         */
        validationMessage: {
          type: String,
          observer: 'setCustomValidity'
        },

        /**
         * the placeholder string
         */
        placeholder: {
          type: String
        },

        /**
         * the minlength of the input
         */
        minlength: {
          type: Number
        },

        /**
         * if true, the width will change when typing
         */
        autoResize: {
          type: Boolean,
          observer: '_debouncedResizeWidth'
        },

        /**
         * string that is used to compute the minimal width of the input
         */
        _minlengthString: {
          type: String
        }
      }
    }

    static get observers() {
      return [
        '_computeInvalid(_validate, _isSet, input, required)',
        '_computeMinlengthString(minlength, default, placeholder)'
      ]
    }

    connectedCallback() {
      super.connectedCallback();
      this._delayedAddEventListeners();
      if (this.input && this.input.length) {
        this._debouncedResizeWidth();
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this._removeEventListeners();
    }

    _delayedAddEventListeners() {
      let readyStateListener = function() {
        if (document.readyState !== 'loading') {
          // if ready state is not loading, add all listeners without a delay
          this._addEventListeners();
          // add a minlength observer to compute the minWidth of the input
          this._createPropertyObserver('_minlengthString', 'resize', true);
          this.resize();
          // remove readystate listener
          document.removeEventListener('readystatechange', readyStateListener);
        }
      }
      readyStateListener = readyStateListener.bind(this);
      document.addEventListener('readystatechange', readyStateListener);
      readyStateListener();
    }

    _addEventListeners() {
      this.addEventListener('focus', this.focus);
      this.addEventListener('blur', this.blur);
      this.$.input.addEventListener('focus', this._confirmInput);
      this.$.input.addEventListener('blur', this._confirmInput);
      this.$.input.addEventListener('keydown', this._checkKeycode);
      window.addEventListener('resize', this.resize);
    }

    _removeEventListeners() {
      this.removeEventListener('focus', this.focus);
      this.removeEventListener('blur', this.blur);
      this.$.input.removeEventListener('focus', this._confirmInput);
      this.$.input.removeEventListener('blur', this._confirmInput);
      this.$.input.removeEventListener('keydown', this._checkKeycode);
      window.removeEventListener('resize', this.resize);
    }

    _checkKeycode(e) {
      super._checkKeycode && super._checkKeycode(e);
      switch (e.keyCode) {
        case 9: // tab
        case 13: // enter
          this._confirmInput();
          break;
        case 27: // esc
          this._updateInput();
          this.blur();
          break;
      }
    }

    _inputChanged(input) {
      // test if value is set and if needed set input to default
      if (this._defaultIsSet(input) === false && this._isSet(this.default)) {
        this.input = this.default;
        return;
      }
      if (this.autoResize) {
        this._debouncedResizeWidth();
      }
    }

    _valueChanged(value) {
      super._valueChanged(value);
      // always update the input
      this._updateInput();
    }

    /**
     * update manually the value with the native input
     */
    _confirmInput(e) {
      // update the value, when input is set
      if (this._isSet(this.input)) {
        this.value = this.input;
      } else {
        // else reset the input
        this.reset();
      }
      this._debouncedResizeWidth();
      e && e.stopPropagation && e.stopPropagation();
    }

    /**
     * update manually the native input with the given value
     */
    _updateInput(e) {
      if (this._isSet(this.value)) {
        this.input = this.value;
      } else {
        this.input = '';
      }
      this._debouncedResizeWidth();
      e && e.stopPropagation && e.stopPropagation();
    }

    /**
     * compute the minimal string the input is sized for
     */
    _computeMinlengthString() {
      const def = '' + (this.default || ''),
        placeholder = '' + (this.placeholder || ''),
        minlength = this.minlength < 1 ? 1 : this.minlength,
        charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // to compute a random string for minlength to estemate usage of space
      let minlengthString = '';
      for (let i = 0; i < minlength; i++) {
        minlengthString += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      this._minlengthString = [placeholder, minlengthString].reduce( (acc, curr) => {
        return curr.length > acc.length ? curr : acc;
      }, def);
    }

    /**
     * called automatically when static `_minlengthString` or visibilityState changes, but can be called manually to resize the minwidth of the input, when the input is for example initially hidden
     */
    resize() {
      // compute minimal width of the input
      if (this._minSizeJob) {
        cancelAnimationFrame(this._minSizeJob);
      }
      if (this._minlengthString) {
        this._minSizeJob = requestAnimationFrame( () => {
          this.$.input.style.minWidth = `${Math.ceil(getBoundingClientRectByRelative(this.$.minlength, !this.__minSizeInitialized).width)}px`;
          this.__minSizeInitialized = true;
          // compute width of the input
          if (this.input) {
            this._debouncedResizeWidth();
          }
        });
      }
    }

    _debouncedResizeWidth() {
      if (this._activeResizeJob) {
        clearTimeout(this._activeResizeJob);
        this._activeResizeJob = null;
      }
      this._activeResizeJob = setTimeout(this._resizeWidth, 0);
    }

    _resizeWidth() {
      this.$.input.style.width = `${Math.ceil(getBoundingClientRectByRelative(this.$.size).width)}px`;
    }

    /**
     * focus the input element
     */
    focus(e) {
      super.focus(e);
      this.$.input.focus();
      this.$.input.scrollIntoViewIfNeeded && this.$.input.scrollIntoViewIfNeeded();
    }

    /**
     * removes focus from input
     */
    blur(e) {
      super.blur(e);
      this.$.input.blur();
    }

    /**
     * validates the input for iron-form
     */
    validate() {
      this._confirmInput();
      return !this.invalid;
    }

    /**
     * selects the input text in the element, and focuses it so the user can subsequently replace the whole entry
     */
    select() {
      this.$.input.select();
    }

    /**
     * simulates a click on the element
     */
    click() {
      this.$.input.click();
    }

    /**
     * sets on the native input a validity message
     * @param {String} msg   the message to set
     */
    setCustomValidity(msg) {
      this.$.input.setCustomValidity(msg || '');
    }

    /**
     * reports the validity state of the native input
     * @return {Boolean}  validity state
     */
    reportValidity() {
      return this.$.input.reportValidity();
    }
  }
});

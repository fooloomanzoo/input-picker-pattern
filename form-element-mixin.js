import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
/**
 * mixin to extend an element, to be compatible with iron-form
 *
 * @mixinFunction
 * @polymer
 */
export const FormElementMixin = dedupingMixin( superClass => { // eslint-disable-line no-unused-vars

  return class extends superClass {

    constructor() {
      super();
      // set default validate and isSet functions
      this._validate = this._defaultValidate.bind(this);
      this._isSet = this._defaultIsSet.bind(this);
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

    static get properties() {
      return {
        /**
         * name of the input
         */
        name: {
          type: String
        },

        /**
         * description for the element and can be used as a hint for invalid values
         */
        title: {
          type: String,
          reflectToAttribute: true,
        },

        /**
         * defines the property that should be used for the value
         */
        propertyForValue: {
          type: String,
          observer: '_createReflectPropertyToValueObserver'
        },

        /**
         * value of the input
         */
        value: {
          type: Object,
          notify: true,
          observer: '_valueChanged'
        },

        /**
         * default value of the value, when it does not validate
         */
        default: {
          type: Object,
          observer: '_defaultChanged'
        },

        /**
         * disables the input
         */
        disabled: {
          type: Boolean,
          reflectToAttribute: true,
          notify: true
        },

        /**
         * required attribute
         */
        invalid: {
          type: Boolean,
          readOnly: true,
          reflectToAttribute: true,
          notify: true
        },

        /**
         * required attribute
         */
        required: {
          type: Boolean,
          reflectToAttribute: true,
          notify: true,
          value: false
        },

        /**
         * is true when the value is set
         */
        valueIsSet: {
          type: Boolean,
          readOnly: true,
          value: false
        },

        /**
         * defines whether the value is set
         */
        _isSet: {
          type: Function
        },

        /**
         * validates the value (when required)
         */
        _validate: {
          type: Function
        }
      }
    }

    static get observers() {
      return [
        '_computeValueIsSet(_isSet, value)',
        '_computeInvalid(_validate, _isSet, value, required)'
      ]
    }

    connectedCallback() {
      super.connectedCallback();
      this._ensureAttribute('tabindex', 0);
    }

    /**
     * @overwrite
     * defines whether the value is set
     * @param  {Object} value      value to test
     * @return {Boolean}           true, if the value is set
     */
    _defaultIsSet(value) {
      return !(value === undefined || value === null || value === '');
    }

    /**
     * @overwrite
     * validate the value (when required)
     * @param  {Function} isSet    The function that defines if the value is set
     * @param  {Object} value      value to validate
     * @param  {Boolean} required  if true, the value is required
     * @return {Boolean}           true, if the value is valid
     */
    _defaultValidate(isSet, value, required) {
      return Boolean(!required || isSet(value));
    }

    /**
     * defines whether the value is set
     * @param  {Function} the validate function
     * @param  {Function} the isSet function
     * @param  {Object} the value to validate
     * @param  {Boolean} the required atrribute
     */
    _computeInvalid(validate, isSet, value, required) {
      this._setInvalid(!validate(isSet, value, required));
    }

    /**
     * defines whether the value is set
     * @param  {Function} the "isSet" function
     * @param  {Object} the value
     */
    _computeValueIsSet(isSet, value) {
      this._setValueIsSet(isSet(value));
    }

    _valueChanged(value) {
      // test if value is set and if needed set value to default
      if (this._isSet(value) === false) {
        this.reset(value);
      }
    }

    _defaultChanged(def) {
      if (this._isSet(def) === false) {
        this.default = undefined;
      }
      if (this._isSet(this.value) === false) {
        // set value to default
        this.value = this.default;
      }
    }

    _createReflectPropertyToValueObserver(prop) {
      if (prop !== undefined) {
        this._createPropertyObserver(prop, '_reflectPropertyToValue');
        this._createPropertyObserver('value', '_reflectValueToProperty');
        if (this._isSet(this[prop])) {
          this.set('value', this[prop]);
        } else if (this._isSet(this.value)) {
          this.set(prop, this.value);
        }
      }
    }

    _reflectPropertyToValue() {
      this.set('value', this[this.propertyForValue]);
    }

    _reflectValueToProperty(value) {
      this.set(this.propertyForValue, value);
    }

    /**
     * validates the input for iron-form
     */
    validate() {
      return !this.invalid;
    }

    /**
     * reset the value
     */
    reset(value) {
      if (this._isSet(this.default)) {
        this.value = this.default;
      } else {
        this.value = value;
      }
    }
  }
});

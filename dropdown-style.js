import { PolymerElement, html } from '../../@polymer/polymer/polymer-element.js';
/**
`dropdown-style`
styles for used for a inner dropdown
*/
const styleElement = document.createElement('dom-module');

styleElement.innerHTML =
`<template>
  <style>
    :host {
      --computed-dropdown-background: var(--dropdown-background, var(--input-picker-background, transparent));
    }

    .dropdown {
      margin: 0;
      padding: 0;
      position: absolute;
      opacity: 0;
      background: var(--computed-dropdown-background);
      transition-duration: var(--dropdown-transition-duration, 250ms);
      transition-timing-function: var(--dropdown-transition-timing-function, cubic-bezier(0.6, 1, 0.2, 1));
      transition-property: opacity;
      pointer-events: none;
      z-index: 1;
    }

    :host([opened]) .dropdown {
      opacity: 1;
      pointer-events: all;
    }

    :host([vertical-align]) .dropdown,
    :host([vertical-align="auto"]) .dropdown,
    :host([vertical-align="top"]) .dropdown {
      top: auto; bottom: 0;
    }

    :host([vertical-align="bottom"]) .dropdown {
      top: 0; bottom: auto;
    }

    :host([vertical-align="middle"]) .dropdown {
      top: auto; bottom: 50%;
    }

    :host([horizontal-align]) .dropdown,
    :host([horizontal-align="auto"]) .dropdown,
    :host([horizontal-align="left"]) .dropdown {
      left: 0; right: auto;
    }

    :host([horizontal-align="right"]) .dropdown {
      left: auto; right: 0;
    }

    :host([horizontal-align][vertical-align]) .dropdown {
      transform: translateY(100%);
    }

    :host([horizontal-align="center"][vertical-align]) .dropdown {
      left: 50%; right: auto;
      transform: translate(-50%, 100%);
    }

    :host([horizontal-align][vertical-align="bottom"]) .dropdown {
      transform: translateY(-100%);
    }

    :host([horizontal-align="center"][vertical-align="bottom"]) .dropdown {
      transform: translate(-50%, -100%);
    }

    :host([horizontal-align][vertical-align="middle"]) .dropdown {
      left: 0; right: auto;
      transform: translate(-100%, 50%);
    }

    :host([horizontal-align="left"][vertical-align="middle"]) .dropdown {
      left: auto; right: 0;
      transform: translate(100%, 50%);
    }

    :host([horizontal-align="center"][vertical-align="middle"]) .dropdown {
      position: fixed;
      top: 50%; left: 50%; bottom: auto; right: auto;
      transform: translate(-50%, -50%);
    }
  </style>
</template>`;

styleElement.register('dropdown-style');

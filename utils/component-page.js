import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-doc-viewer/default-theme.js';
import '@polymer/iron-doc-viewer/iron-doc-nav.js';
import '@polymer/iron-doc-viewer/iron-doc-viewer.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-styles/color.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-component-page/iron-component-page.js';

const IronComponentPage = customElements.get('iron-component-page');

/**
 * Modification of iron-component-page
 *
 * @customElement
 * @polymer
 */
export class ComponentPage extends IronComponentPage {
  static get template() {
    return html`
      <style include="iron-doc-default-theme">
        [hidden] {
          display: none;
        }

        app-header {
          @apply --paper-font-subhead;
          color: white;
          background-color: var(--iron-component-page-header-color, var(--iron-doc-accent-color, #5a5a5a));
        }

        [drawer-toggle] {
          flex-shrink: 0;
        }

        [condensed-title] {
          white-space: nowrap;
        }

        #drawer {
          --app-drawer-content-container: {
            background-color: #fbfbfb;
            padding: 0;
          }
          position: absolute;
          top: 0;
          bottom: 0;
        }

        app-drawer-layout {
          height: 100%;
        }

        app-toolbar {
          @apply --paper-font-subhead;
        }

        app-toolbar.top {
          font-weight: bold;
          height: 80px;
          padding: 0 16px;
          color: #000;
          background: linear-gradient(to right, white, #fbfbfb 62%);
        }

        app-toolbar.top > * {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        app-toolbar.top a {
          text-decoration: none;
          display: inline-flex;
          color: #000;
        }

        iron-doc-nav {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
        }

        iron-doc-nav:after,
        app-toolbar.top:after {
          content: '';
          position: absolute;
          top: 0; bottom: 0; left: 0; right: 0;
          opacity: 0.5;
          pointer-events: none;
          border-bottom: thin solid var(--iron-component-page-header-color, var(--iron-doc-accent-color, #5a5a5a));
        }

        app-toolbar.top:after {
          border-bottom: thin solid var(--iron-component-page-header-color, var(--iron-doc-accent-color, #5a5a5a));
        }

        iron-doc-nav:after {
          border-right: thin solid var(--iron-component-page-header-color, var(--iron-doc-accent-color, #5a5a5a));
        }

        iron-doc-viewer {
          height: 100%;
          --iron-doc-title: {
            display: none;
          }
        }

        iron-doc-viewer:not([demo]) {
          padding: 5px 20px 20px 20px;
          max-width: 56em;
        }

        #error-toast {
          background-color: var(--paper-red-600);
        }

        .webcomponents {
          height: 64px;
          width: 64px;
          padding: 0 16px;
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYxIiBoZWlnaHQ9IjEzMiIgdmlld0JveD0iMCAwIDE2MSAxMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjUwJSIgeTI9IjUwJSIgaWQ9ImEiPjxzdG9wIHN0b3AtY29sb3I9IiMyQTNCOEYiIG9mZnNldD0iMCUiLz48c3RvcCBzdG9wLWNvbG9yPSIjMjlBQkUyIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMCUiIHkxPSI1MCUiIHkyPSI1MCUiIGlkPSJiIj48c3RvcCBzdG9wLWNvbG9yPSIjMkEzQjhGIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iIzI5QUJFMiIgb2Zmc2V0PSIxMDAlIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeDE9IjEwMCUiIHkxPSI1MCUiIHgyPSIwJSIgeTI9IjUwJSIgaWQ9ImMiPjxzdG9wIHN0b3AtY29sb3I9IiNCNEQ0NEUiIG9mZnNldD0iMCUiLz48c3RvcCBzdG9wLWNvbG9yPSIjRTdGNzE2IiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMTAwJSIgeTE9IjUwJSIgeDI9IjAlIiB5Mj0iNTAlIiBpZD0iZCI+PHN0b3Agc3RvcC1jb2xvcj0iI0I0RDQ0RSIgb2Zmc2V0PSIwJSIvPjxzdG9wIHN0b3AtY29sb3I9IiNFN0Y3MTYiIG9mZnNldD0iMTAwJSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZmlsbD0iIzE2NkRBNSIgZD0iTTE2MC42IDY1LjlsLTE3LjQgMjkuMy0yNC40LTI5LjcgMjQuNC0yOC45eiIvPjxwYXRoIGZpbGw9IiM4RkRCNjkiIGQ9Ik0xNDEuMyAxMDAuMmwtMjYuNS0zMS43LTE1LjkgMjYuNiAyNC43IDM2LjF6Ii8+PHBhdGggZmlsbD0iIzE2NkRBNSIgZD0iTTE0MSAzMS40bC0yNi4yIDMxLjgtMTUuOS0yNi42TDEyMy42Ljl6Ii8+PHBhdGggZmlsbD0idXJsKCNhKSIgb3BhY2l0eT0iLjk1IiBkPSJNNjEuMSAzMS40SDE0MUwxMjMuNC45SDc4Ljd6Ii8+PHBhdGggZmlsbD0idXJsKCNiKSIgb3BhY2l0eT0iLjk1IiBkPSJNMTE0LjggNjMuM0gxNTlsLTE1LjktMjYuOEg5OC44Ii8+PHBhdGggZmlsbD0idXJsKCNjKSIgb3BhY2l0eT0iLjk1IiBkPSJNMTQxLjMgMTAwLjNINjFsMTcuNiAzMC41aDQ1eiIvPjxwYXRoIGZpbGw9IiMwMTAxMDEiIGQ9Ik03OC42IDEzMC44TDQxIDY1LjggNzkuMS44SDM3LjlMLjQgNjUuOGwzNy41IDY1eiIvPjxwYXRoIGZpbGw9InVybCgjZCkiIG9wYWNpdHk9Ii45NSIgZD0iTTExNC44IDY4LjRIMTU5bC0xNS45IDI2LjhIOTguOCIvPjwvZz48L3N2Zz4=');
          background-size: 64px auto;
          background-repeat: no-repeat;
          background-position: center;
        }

        .github {
          padding: 0 8px;
          transition: color 250ms ease;
        }
        .github:hover {
          color: var(--iron-component-page-header-color, var(--iron-doc-accent-color, #5a5a5a));
        }
      </style>

      <iron-ajax auto url="[[descriptorUrl]]" handle-as="json" last-response="{{_descriptor}}" loading="{{_loading}}" last-error="{{_descriptorError}}">
      </iron-ajax>

      <paper-toast id="loading-toast" opened="[[_loading]]" duration="0">
        Loading descriptor ...
      </paper-toast>

      <paper-toast id="error-toast" opened="[[_descriptorError]]" duration="0">
        Could not load descriptor "[[descriptorUrl]]". <br> [[_descriptorError.error]]
      </paper-toast>

      <app-header-layout fullbleed>
        <app-header>
          <app-toolbar class="top" hidden$="[[!componentName]]">
            <paper-icon-button icon="menu" on-click="_toggleDrawer" hidden$="[[!_narrow]]"></paper-icon-button>

            <a href="[[webcomponentsUrl]]" hidden$="[[!webcomponentsUrl]]"><div class="webcomponents"></div></a>

            <div main-title>[[pageTitle]]</div>

            <a href="[[githubUrl]]" title="Github" hidden$="[[!githubUrl]]">
              <svg class="github" aria-hidden="true" height="32" version="1.1" viewBox="0 0 16 16" width="32" style="fill:currentColor"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
            </a>
          </app-toolbar>
        </app-header>

        <app-drawer-layout narrow="{{_narrow}}">

          <app-drawer id="drawer" slot="drawer" swipe-open style="position: absolute;top: 0; bottom: 0;">
            <iron-doc-nav descriptor="[[_descriptor]]" base-href="[[baseHref]]" path="[[_path]]" on-select="_onNavSelect"></iron-doc-nav>
          </app-drawer>

          <app-header-layout has-scrolling-region>
            <app-header slot="header" fixed>
              <app-toolbar>
                <div>[[_title]]</div>
              </app-toolbar>
            </app-header>

            <iron-doc-viewer id="viewer" descriptor="[[_descriptor]]" root-namespace="[[rootNamespace]]" base-href="[[baseHref]]" demo-src-prefix="[[demoSrcPrefix]]" title="{{_title}}" path="{{_path}}" on-view-changed="_onViewChanged">
            </iron-doc-viewer>

          </app-header-layout>
        </app-drawer-layout>
      </app-header-layout>
    `
  }

  static get is() {
    return 'component-page';
  }

  static get properties() {
    return {
      /**
       * title of the page
       */
      pageTitle: {
        type: String,
        value: ''
      },

      /**
       * webcomponents.org url
       */
      webcomponentsUrl: {
        type: String,
        value: ''
      },

      /**
       * github url
       */
      githubUrl: {
        type: String,
        value: ''
      }
    }
  }

  _toggleDrawer() {
    this.$.drawer.toggle();
  }
}

if (!customElements.get(ComponentPage.is)) {
  customElements.define(ComponentPage.is, ComponentPage);
}

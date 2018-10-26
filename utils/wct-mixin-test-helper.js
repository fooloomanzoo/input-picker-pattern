(function() {
  if (!window.Polymer) {
    window.Polymer = {};
  }
  if (!window.Polymer.Element) {
    window.Polymer.Element = function() {};
    window.Polymer.Element.prototype._stampTemplate = function() {};
  }
  if (!window.WCT) {
    window.WCT = {};
  }
  if (!window.WCT.helpers) {
    window.WCT.helpers = {};
  }

  /**
   * parse uri search params (which usally need to be encoded)
   * used paramaters are:
   *   - a `specifier` that replaces given tag-names
   *   - the `url` that needs to be loaded to include for the replacement
   *   - an optional `props` object, that would be set on the replacement (to make it compatible to the tests):
   *      - when `_byId`-value is set to true the keys are treated as specifier for which replacement element the attributes should be set
   *      - else the keys and the according keys will be set as attributes to the replacement element
   * @return {Object} uri parameters
   */
  function getParams() {
    var params = {};
    decodeURIComponent(window.location.search)
      .replace('?', '')
      .split('&')
      .map(function(current) {
        var pair = current.split('=');
        params[pair[0]] = pair[1] || true;
      });
    return params;
  }

  window.WCT.helpers.getParams = getParams;

  // applying suites to another element (e.g. when another element depends on the the same mixin)
  window.WCT.helpers.mixinSuite = function(oldTags) {
    // transforming arguments
    if (!oldTags) {
      console.warn('No tags provided to replace in current document');
      return;
    } else if (typeof oldTags === 'string') {
      var tags = oldTags.split(',');
      oldTags = {};
      tags.forEach(function(tag) {
        if (tag) {
          oldTags[tag] = '';
        }
      });
    } else if (Object.prototype.toString.call(oldTags) === "[object Array]") {
      var tmp = {};
      oldTags.forEach(function(tag) {
        if (tag) {
          tmp[tag] = '';
        }
      });
      oldTags = tmp;
    } else if (Object.prototype.toString.call(oldTags) === "[object Object]") {
      Object.keys(oldTags).forEach(function(tag) {
        if (!tag) {
          return;
        } else if (typeof oldTags[tag] !== 'string') {
          oldTags[tag] = '';
        } else {
          oldTags[tag] = (oldTags[tag] || '').toLowerCase();
        }
      });
    } else {
      console.warn('Provided tags to replace in current document should be a string, object or an array');
      return;
    }

    // parsing url-search-parameters
    var params = getParams();
    if (!(params.specifier && params.url)) {
      // suite is not called with a specifier
      console.info('test-suite called for: ' + Object.keys(oldTags).toString());
      return;
    }

    params.specifier = (params.specifier || '').toLowerCase();

    // prevent from calling the mixin specifier on itself
    if (oldTags.hasOwnProperty(params.specifier)) {
      delete oldTags[params.specifier];
    }
    // setting replacement tags for given tags of the suite
    Object.keys(oldTags).forEach(function(tag) {
      if (!oldTags[tag]) {
        oldTags[tag] = params.specifier;
      }
    });

    console.info('test-suite replacing "' + Object.keys(oldTags).toString() + '" with "' + params.specifier + '"');
    if (params.props) {
      params.props = JSON.parse(params.props);
      console.info('setting on each "' + params.specifier + '" ', params.props);
    }

    window.WCT.helpers.mixinSuiteParams = params;

    suite(`Suite for ${params.specifier.toUpperCase()}`, function() {
      test('loading dependencies', function(done) {
        Polymer.importHref(window.location.origin + '/components/' + params.url,
          function() {
            var specifier = params.specifier;
            var replacementTagNames = oldTags;
            var props = params.props;
            // replace in document the standard element with the specifier and set given properties
            // NOTE: modification of WCT implementation
            // Keep a reference to the original `document.importNode` implementation for later:
            var originalImportNode = document.importNode;
            // Use Sinon to stub `document.ImportNode`:
            sinon.stub(document, 'importNode', function(origContent, deep) {
              var templateClone = document.createElement('template');
              var content = templateClone.content;
              var inertDoc = content.ownerDocument;
              // imports node from inertDoc which holds inert nodes.
              templateClone.content.appendChild(inertDoc.importNode(origContent, true));
              // optional arguments are not optional on IE.
              var nodeIterator = document.createNodeIterator(content, NodeFilter.SHOW_ELEMENT, null, true);
              var node;
              // Traverses the tree. A recently-replaced node will be put next,
              // so if a node is replaced, it will be checked if it needs to be
              // replaced again.
              while (node = nodeIterator.nextNode()) {
                if (!node.tagName) {
                  continue;
                }
                var tagName = node.tagName.toLowerCase();
                if (replacementTagNames.hasOwnProperty(tagName)) {
                  // Create a replacement:
                  var replacement = document.createElement(replacementTagNames[tagName]);
                  // For all attributes in the original node..
                  for (var index = 0; index < node.attributes.length; ++index) {
                    // Set that attribute on the replacement:
                    replacement.setAttribute(node.attributes[index].name, node.attributes[index].value);
                  }
                  if (props) {
                    if (props._byId) {
                      /**
                       * properties set on replaced element targeted by id
                       * usage e.g.
                       * props = {
                       *  _byId: true,
                       *  'exampleId': {
                       *    min: 0
                       *  }
                       * }
                       */
                      if (props.hasOwnProperty(node.id)) {
                        Object.keys(props[node.id]).forEach(function(prop) {
                          // only set attribute if it hasn't been set in the test suite
                          if (!node.hasAttribute(prop)) {
                            replacement.setAttribute(prop, props[node.id][prop]);
                          }
                        })
                      }
                    } else {
                      /**
                       * properties set on every replaced element
                       * usage e.g.
                       * props = {
                       *   min: 0
                       * }
                       */
                      Object.keys(props).forEach(function(prop) {
                        // only set attribute if it hasn't been set in the test suite
                        if (!node.hasAttribute(prop)) {
                          replacement.setAttribute(prop, props[prop]);
                        }
                      })
                    }
                  }
                  // Replace the original node with the replacement node:
                  node.parentNode.replaceChild(replacement, node);
                }
              }
              return originalImportNode.call(this, content, deep);
            });
            done()
          },
          function() {
            console.warn(`failed to load: ${params.url}`)
          })
      })
    })
  }
})()

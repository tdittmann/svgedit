/**
 * @file ext-helloworld.js
 *
 * @license MIT
 *
 * @copyright 2010 Alexis Deveria
 *
 */

/**
* This is a very basic SVG-Edit extension. It adds a "Hello World" button in
*  the left ("mode") panel. Clicking on the button, and then the canvas
*  will show the user the point on the canvas that was clicked on.
*/

const loadExtensionTranslation = async function (lang) {
  let translationModule;
  try {
    // eslint-disable-next-line no-unsanitized/method
    translationModule = await import(`./locale/${encodeURIComponent(lang)}.js`);
  } catch (_error) {
    // eslint-disable-next-line no-console
    console.error(`Missing translation (${lang}) - using 'en'`);
    translationModule = await import(`./locale/en.js`);
  }
  return translationModule.default;
};

export default {
  name: 'helloworld',
  async init ({_importLocale}) {
    const svgEditor = this;
    const strings = await loadExtensionTranslation(svgEditor.configObj.pref('lang'));
    const {svgCanvas} = svgEditor;
    return {
      name: strings.name,
      events: [{
        // Must match the icon ID in helloworld-icon.xml
        id: 'hello_world',
        // Tooltip text
        title: strings.buttons[0].title,
        click () {
          // The action taken when the button is clicked on.
          // For "mode" buttons, any other button will
          // automatically be de-pressed.
          svgCanvas.setMode('hello_world');
        }
      }],
      // This is triggered when the main mouse button is pressed down
      // on the editor canvas (not the tool panels)
      mouseDown () {
        // Check the mode on mousedown
        if (svgCanvas.getMode() === 'hello_world') {
          // The returned object must include "started" with
          // a value of true in order for mouseUp to be triggered
          return {started: true};
        }
        return undefined;
      },

      // This is triggered from anywhere, but "started" must have been set
      // to true (see above). Note that "opts" is an object with event info
      mouseUp (opts) {
        // Check the mode on mouseup
        if (svgCanvas.getMode() === 'hello_world') {
          const zoom = svgCanvas.getZoom();

          // Get the actual coordinate by dividing by the zoom value
          const x = opts.mouse_x / zoom;
          const y = opts.mouse_y / zoom;

          // We do our own formatting
          let {text} = strings;
          [
            ['x', x],
            ['y', y]
          ].forEach(([prop, val]) => {
            text = text.replace('{' + prop + '}', val);
          });

          // Show the text using the custom alert function
          alert(text); 
        }
      }
    };
  }
};

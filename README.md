[![npm version](https://badge.fury.io/js/tldraw-web-component.svg)](https://badge.fury.io/js/tldraw-web-component)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)


# tldraw web component
> Make tldraw work with frameworks other than React;

## Getting Started
Install with

```
npm i tldraw-web-component
```

# Usage
You need to simply include the esm module in order to use the webcomponent.
```js
import 'tldraw-web-component'
```

This allows using the webcomponent in your html template.

```html
<div style="display: flex;flex-flow: column;height: 100%;">
    <h1>Pure HTML + TlDraw Web Component</h1>
    <div style="flex-grow: 1;">
        <tldraw-sync-web-component
            room-id="10"
            server-uri="http://localhost:5858"
            multiplayer-assets-func="multiplayerAssets"
        >
        </tldraw-sync-web-component>
    </div>
</div>
<script>
    function multiplayerAssets() {
        return {
            async upload(_asset, file) {
                const id = Math.random().toString(36).substr(2, 9); // Generate a unique ID
                const objectName = `${id}-${file.name}`;
                const url = `${'http://localhost:5858/uploads'}/${encodeURIComponent(objectName)}`;
                const response = await fetch(url, {
                    method: 'PUT',
                    body: file,
                });

                if (!response.ok) {
                    throw new Error(`Failed to upload asset: ${response.statusText}`);
                }

                return url;
            },
            resolve(asset) {
                return asset.props.src;
            },
        };
    }
</script>
```

## Usage with angular
Check `examples/angular`
<img width="1512" alt="Screenshot 2025-01-14 at 10 36 56 pm" src="https://github.com/user-attachments/assets/3bd15c35-5ab6-430a-a961-db84fedc5218" />

## Functions available with tldraw-sync-web-component

**Sync Attr**
| Name    | type |  Desciption |
| -------- | ------- | ------- |
| `room-id`  | string    | The id of the room  |
| `server-uri`  | string    | The uri of the tldraw/sync server. |
| `query-params`  | json    | A json containing the query params to be sent when making the connection |
| `multiplayer-assets-func`  | function    | A function in window / global scope. |

**Draw Attr**
| Name    | type |  Desciption |
| -------- | ------- | ------- |
| `auto-focus`  | boolean    | if tldraw should be in focus when component loads  |
| `force-mobile`  | boolean    |  Whether to always should the mobile breakpoints |
| `hide-ui`  | boolean    |  Whether to hide the UI |
| `infer-dark-mode`  | boolean    |  Whether to infer dark mode from the user's OS. Defaults to false. |
| `on-mount`  | function    |  Called when the editor has mounted. |
| `initial-state`  | string    |  The editor's initial state (usually the id of the first active tool). |
| `license-key`  | string    |  The license key. |
| `max-asset-size`  | number    |  The maximum size (in bytes) of an asset. Assets larger than this will be rejected. Defaults to 10mb (10 * 1024 * 1024). |
| `max-image-dimension`  | number    |  The maximum dimension (width or height) of an image. Images larger than this will be rescaled to fit. Defaults to infinity. |
| `get-user-func`  | function    |  Returns an object with shape { id?: string; name?: string; color?: string; colorScheme?: "dark" | "light" | "system" | undefined; } | undefined;` |


## Contributing

Please create an issue when you make a PR.

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:

## Credits

tldraw;
https://github.com/tldraw/tldraw

## License

[tldraw license](https://github.com/tldraw/tldraw/blob/main/LICENSE.md)

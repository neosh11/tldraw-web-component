[![npm version](https://badge.fury.io/js/tldraw-web-component.svg)](https://badge.fury.io/js/tldraw-web-component)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)


# tldraw web component
> Make tldraw work with frameworks other than React;
> Made primarily to work with Angular.

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
        <tldraw-sync-web-component get-props-func="getProps"></tldraw-sync-web-component>
    </div>
</div>
<script>
    function getProps() {
            return {
                serverUri: 'http://localhost:5172/connect/hello',
                tldrawUserPreferences: {
                    id: "Math.random()",
                    name: "John Doe",
                },
                assets: {
                    upload: async (asset, file) => ({
                        src: "url",
                    }),
                    resolve: async (asset, ctx) => "url",
                }
            }
        }
</script>
```

## Usage with angular
Check `examples/angular`

<img width="1512" alt="Screenshot 2025-01-14 at 10 36 56 pm" src="https://github.com/user-attachments/assets/3bd15c35-5ab6-430a-a961-db84fedc5218" />


You will need to attach a function of type `TldrawWebcomponentGetPropsFunc` to the component, as in the example.

```
export type TldrawWebcomponentGetPropsFunc = () => {
    tldrawProps: TldrawProps;
    tldrawUserPreferences: TLUserPreferences;
    assets: TLAssetStore;
    serverUri: string;
};
```

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

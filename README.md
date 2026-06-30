# Mermaid plugin for Inkdrop

A plugin for drawing flowcharts and diagrams using [mermaid.js](https://mermaidjs.github.io/) in Markdown code block.

## Install

Check out [the docs](https://docs.inkdrop.app/manual/extend-inkdrop-with-plugins) on how to install plugins.

### Command-line

```shell
ipm install mermaid
```

## Usage

    ```mermaid
    graph TD;
        A-->B;
        A-->C;
        B-->D;
        C-->D;
    ```

It will be rendered as:

![Flowchart example](https://github.com/inkdropapp/inkdrop-mermaid/raw/master/docs/images/example-01.png)

    ```mermaid
    sequenceDiagram
        participant Alice
        participant Bob
        Alice->>John: Hello John, how are you?
        loop Healthcheck
            John->>John: Fight against hypochondria
        end
        Note right of John: Rational thoughts <br/>prevail...
        John-->>Alice: Great!
        John->>Bob: How about you?
        Bob-->>John: Jolly gooda!
    ```

It will be rendered as:

![Sequence diagram example](https://github.com/inkdropapp/inkdrop-mermaid/raw/master/docs/images/example-02.png)

## Pan & Zoom

Rendered diagrams are interactive:

- **Drag** to pan.
- **Ctrl/Cmd + scroll** to zoom in and out (a plain scroll still scrolls the note).

Enabled by default — turn it off with the **Pan & Zoom** option in Preferences.

## Customizations

You can configure mermaid options in Preferences.

Mermaid supports custom theme variables:

- https://mermaid-js.github.io/mermaid/#/./theming?id=theme-variables-reference-table

![Options](https://github.com/inkdropapp/inkdrop-mermaid/raw/master/docs/images/config.png)

**Note**: You have to reload the app to get the custom theme CSS and variables applied.

### Inline theming

It is also possible to override theme settings locally, for a specific diagram, using directives `%%init%%` like so:

    ```mermaid
    %%{init:{
      'theme':'base',
      'themeVariables': {
        'primaryColor':'#6A7FAB',
        'primaryTextColor':'#FAFBF9',
        'primaryBorderColor':'#6A7FAB',
        'lineColor':'#6A7FABCC',
        'textColor':'#6A7FABCC',
        'fontSize':'16px'
      }
    }}%%

    graph TD;
        A-->B;
        A-->C;
        B-->D;
        C-->D;
    ```

It yields:

![Inline theming example](https://github.com/inkdropapp/inkdrop-mermaid/raw/master/docs/images/example-03.png)

More details can be found on [the Mermaid documentation](https://mermaid-js.github.io/mermaid/#/theming?id=themes-at-the-local-or-current-level).

## Changelog

See the [Releases](https://github.com/inkdropapp/inkdrop-mermaid/releases) page for the changelog.

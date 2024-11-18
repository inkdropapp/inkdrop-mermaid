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

### 2.8.0 [Nov 18, 2024]

- Bump up Mermaid to [v10.9.3](https://github.com/mermaid-js/mermaid/releases/tag/v10.9.3)

### 2.7.0 [Feb 8, 2024]

- Bump up Mermaid to [v10.6.1](https://github.com/mermaid-js/mermaid/releases/tag/v10.6.1)
  - Support Sequence Diagram Actor Creation and Destruction (Thanks [@johmsalas](https://github.com/johmsalas))

### 2.6.0 [Aug 28, 2023]

- Support lazy loading

### 2.5.3 [Jun 2, 2023]

- Bump up Mermaid to [v9.4.3](https://github.com/mermaid-js/mermaid/releases/tag/v9.4.3)

### 2.5.1 [Jul 7, 2022]

- Bump up Mermaid to [v9.1.3](https://github.com/mermaid-js/mermaid/releases/tag/9.1.3)

### 2.5.0 [May 21, 2022]

- Bump up Mermaid to v9.1.1 (Thanks [dkarter](https://github.com/inkdropapp/inkdrop-mermaid/pull/8))
  - Adds new features such as [gitGraph](https://mermaid-js.github.io/mermaid/#/gitgraph)

### 2.4.0 [Jan 30, 2022]

- Update to the latest mermaid version (8.13.10)
- Dropdown list for changing theme
- Custom theme CSS
- Custom theme variables
- Allow disabling auto-scaling diagrams

### 2.3.0 [April 13, 2021]

Updated to the latest mermaid version (8.9.2)

### 2.2.0 [October 2, 2020]

Updated to the latest mermaid version (8.8.0)

### 2.1.0 [December 20, 2019]

Updated to the latest mermaid version

### 1.0.0 - First Release

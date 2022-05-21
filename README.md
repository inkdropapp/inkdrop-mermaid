# Mermaid plugin for Inkdrop

A plugin for drawing flowcharts and diagrams using [mermaid.js](https://mermaidjs.github.io/) in Markdown code block.

## Install

```shell
ipm install mermaid
```

## Usage

    ```mermaid
    graph LR
        A --- B
        B-->C[fa:fa-ban forbidden]
        B-->D(fa:fa-spinner);
    ```

It will be rendered as:

![](https://github.com/inkdropapp/inkdrop-mermaid/raw/master/docs/images/example-01.png)

    ```mermaid
    sequenceDiagram
        participant Alice
        participant Bob
        Alice->John: Hello John, how are you?
        loop Healthcheck
            John->John: Fight against hypochondria
        end
        Note right of John: Rational thoughts <br/>prevail...
        John-->Alice: Great!
        John->Bob: How about you?
        Bob-->John: Jolly good!
    ```

It will be rendered as:

![](https://github.com/inkdropapp/inkdrop-mermaid/raw/master/docs/images/example-02.png)

## Customizations

You can configure mermaid options in Preferences.

Mermaid supports custom theme variables:

* https://mermaid-js.github.io/mermaid/#/./theming?id=theme-variables-reference-table

![Options](https://github.com/inkdropapp/inkdrop-mermaid/raw/master/docs/images/config.png)

## Changelog

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

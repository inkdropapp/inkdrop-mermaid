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

## Changelog

### 2.2.0

Updated to the latest mermaid version (8.8.0) [October 2, 2020]

### 2.1.0

Updated to the latest mermaid version [December 20, 2019]

### 1.0.0 - First Release

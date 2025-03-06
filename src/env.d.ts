interface Disposable {
  dispose(): void
}

declare namespace Inkdrop {
  interface Plugin {
    config: Record<string, unknown>
    activate(): void
    deactivate(): void
  }

  namespace Markdown {
    interface CodeComponentProps {
      lang: string
      lineAt?: number
      title?: string
      fenced?: boolean
      className?: string
      children: string[]
    }

    interface RemarkCodeComponents {
      default: React.ComponentType<CodeComponentProps>
      inlineDefault: React.ComponentType<CodeComponentProps>
      [lang: string]: React.ComponentType<CodeComponentProps> | null
    }

    interface MarkdownRendererContextType {
      printMode: boolean
    }

    interface MarkdownRenderer {
      remarkCodeComponents: RemarkCodeComponents
      Context: React.Context<MarkdownRendererContextType>
    }
  }

  interface Config {
    get<T = unknown>(key: string): T
    set<T = unknown>(key: string, value: T): void
    observe<T = unknown>(key: string, callback: (value: T) => void): Disposable
  }

  namespace Exports {
    const markdownRenderer: Markdown.MarkdownRenderer
  }
}

declare module 'inkdrop' {
  export = Inkdrop.Exports
}

declare const inkdrop: {
  config: Inkdrop.Config
  markdownRenderer: Inkdrop.Markdown.MarkdownRenderer
}

declare type CodeComponentProps = Inkdrop.Markdown.CodeComponentProps

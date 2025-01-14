declare global {
    namespace JSX {
        interface IntrinsicElements {
            "tldraw-demo": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
    interface HTMLElementTagNameMap {
        "tldraw-demo": HTMLElement;
    }
}

type AttributeValue = string | number | boolean;
type Child = Node | string | null | undefined | false;

type ElementOptions = {
  className?: string;
  text?: string;
  attrs?: Record<string, AttributeValue>;
  children?: Child[];
};

export function el<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: ElementOptions = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text) {
    element.textContent = options.text;
  }

  for (const [name, value] of Object.entries(options.attrs ?? {})) {
    if (typeof value === "boolean") {
      if (value) {
        element.setAttribute(name, "");
      }
    } else {
      element.setAttribute(name, String(value));
    }
  }

  for (const child of options.children ?? []) {
    append(element, child);
  }

  return element;
}

export function append(parent: HTMLElement, child: Child): void {
  if (!child) {
    return;
  }

  parent.append(child instanceof Node ? child : document.createTextNode(child));
}

export function link(label: string, href: string, className?: string): HTMLAnchorElement {
  const anchor = el("a", { className, text: label, attrs: { href } });

  if (href.startsWith("http")) {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }

  return anchor;
}

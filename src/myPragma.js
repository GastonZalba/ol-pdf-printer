export default function createElement(tagName, attrs = {}, ...children) {
    if (tagName === 'null' || tagName === null) return children;
    if (typeof tagName === 'function') return tagName(attrs, children);

    const elem = document.createElement(tagName);

    Object.entries(attrs || {}).forEach(([name, value]) => {
        if (typeof value !== undefined && value !== null) {
            if (
                name.startsWith('on') &&
                name.toLowerCase() in window &&
                typeof value === 'function'
            )
                elem.addEventListener(name.toLowerCase().substr(2), value);
            else {
                if (name === 'className')
                    elem.setAttribute('class', value.toString());
                else if (name === 'htmlFor')
                    elem.setAttribute('for', value.toString());
                else elem.setAttribute(name, value.toString());
            }
        }
    });

    for (const child of children) {
        if (!child) continue;
        if (Array.isArray(child)) elem.append(...child);
        else {
            if (child.nodeType === undefined) elem.innerHTML += child;
            else elem.appendChild(child);
        }
    }
    return elem;
}

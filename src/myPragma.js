export default function createElement(tagName, attrs = {}, ...children) {
    if (tagName === 'fragment') return children;
    if (typeof tagName === 'function') return tagName(attrs, children);

    const elem = document.createElement(tagName);

    Object.entries(attrs || {}).forEach(([name, value]) => {
        if (name.startsWith('on') && name.toLowerCase() in window)
            elem.addEventListener(name.toLowerCase().substr(2), value);
        else {
            if (name === 'className')
                elem.setAttribute('class', value.toString());
            else if (name === 'htmlFor')
                elem.setAttribute('for', value.toString());
            else elem.setAttribute(name, value.toString());
        }
    });

    for (const child of children) {
        if (Array.isArray(child)) elem.append(...child);
        else {
            elem.appendChild(
                child.nodeType === undefined
                    ? document.createTextNode(child.toString())
                    : child
            );
        }
    }
    return elem;
}

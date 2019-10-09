const _ = {}

_.isString = str => {
    return typeof str === 'string'
}

_.setProps = (node, key, value) => {
    switch (key) {
        case 'style':
            node.style.cssText = value
            break
        case 'value':
            const { tagName } = node
            if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                node.value = value
            } else {
                node.setAttribute(key, value)
            }
        default:
            node.setAttribute(key, value)
    }
}

export default _
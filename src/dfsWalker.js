import _ from './utils'
var REPLACE = 0
var REORDER = 1
var PROPS = 2
var TEXT = 3

function patch(node, patches) {
    // DFS累计标记，通过对象存储，指向同一个地址
    let walker = { index: 0 }
    dfsWalker(node, walker, patches)
}

function dfsWalker (node, walker, patches) {
    const currentPatches = patches[walker.index]
    const childNodes = node.childNodes
    childNodes.length && childNodes.forEach((v, i) => {
        walker.index++
        dfsWalker(v, walker, patches)
    })
    if (currentPatches) applyPatches(node, currentPatches)
}

function applyPatches (node, currentPatches) {
    currentPatches.forEach(currentPatch => {

        switch(currentPatch.type) {
            case REPLACE:
                setReplace(node, currentPatch)
                break
            case REORDER:
                setReorder(node, currentPatch.moves)
                break
            case PROPS:
                setProps(node, currentPatch.props)
                break
            case TEXT:
                node.textContent = currentPatch.content
        }
    })
}

function setProps (node, props) {
    for (const key of Object.keys(props)) {
        !props[key] && node.removeAttribute(key)
        props[key] && _.setProps(node, key, props[key])
    }
}

function setReplace (node, currentPatch) {
    const newNode = (typeof currentPatch.node === 'string') ?
       document.createTextNode(currentPatch.node) :
       currentPatch.node.render()
    node.parentNode.replaceChild(newNode, node)
}

function setReorder (node, moves) {
    const map = {}
    const staticNodes = Array.from(node.childNodes)
    staticNodes.forEach(child => {
        if (child.nodeType === 1) {
            const key = child.getAttribute('key')
            if (key) {
                map[key] = child
            }
        }
    })
    moves.forEach((move, i) => {
        const { index } = move
        if (move.type === 0) { // remove
            // 此处判断元素是否因为insert操作已经被删除
            if (staticNodes[index] === node.childNodes[index]) {
                node.removeChild(node.childNodes[index])
            }
        } else { // insert type === 1
            const newNode = map[move.item.key] ? map[move.item.key].childNodes(true)
            : (typeof move.item === 'object')
                ? move.item.render()
                : document.createTextNode(move.item)
            staticNodes.splice(index, 0, newNode)
            node.insertBefore(newNode, node.childNodes[index] || null)
        }
    })

}

export default patch
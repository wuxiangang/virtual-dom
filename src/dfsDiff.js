import _ from './utils'
import listDiff from './diff-list'

var REPLACE = 0
var REORDER = 1
var PROPS = 2
var TEXT = 3

function diff (oldTree, newTree) {
	const index = 0 // 从0开始标记
	const patches = {} // 存放所有的变更
	dfsWalk(oldTree, newTree, index, patches)
	return patches
}

function dfsWalk(oldNode, newNode, index, patches) {
	const currentPatch = []
	if (!newNode) {}
	else if (_.isString(oldNode) && _.isString(newNode)) {
		if (oldNode !== newNode) {
			currentPatch.push({
				type: TEXT,
				content: newNode
			})
		}
	} else if (oldNode.tagName === newNode.tagName &&
		oldNode.key === newNode.key) {
			const propPatches = diffProps(oldNode, newNode)
			propPatches && currentPatch.push({
					type: PROPS,
					props: propPatches
				})
		// 这边不管ignore
		diffChildren(
			oldNode.children,
			newNode.children,
			index, 
			patches,
			currentPatch
		)	
	} else {
		currentPatch.push({
			type: REPLACE,
			node: newNode
		})
	}
	// console.log(index, currentPatch)

	if (currentPatch.length) patches[index] = currentPatch
}

function diffChildren (oldChildren, newChildren, index, patches, currentPatch) {
	// console.log(index)
  const diffs = listDiff(oldChildren, newChildren, 'key')
  newChildren = diffs.children

  if (diffs.moves.length) {
    currentPatch.push({ type: REORDER, moves: diffs.moves })
  }

  let leftNode = null
  let currentNodeIndex = index
  oldChildren.forEach((child, i) => {
	const newChild = newChildren[i]
    currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.count + 1
	  : currentNodeIndex + 1
	dfsWalk(child, newChild, currentNodeIndex, patches)
	leftNode = child
  })
}

// 比较props
function diffProps (oldNode, newNode) {
	const propsPatches = {}
	const oldProps = oldNode.props
	const newProps = newNode.props
	for (const [key, val] of Object.entries(oldProps)) {
		if (val !== newProps[key]) {
			propsPatches[key] = val
		}
	}

	for (const key of Object.keys(newProps)) {
		if (oldProps.hasOwnProperty(key)) {
			propsPatches[key] = newProps[key]
		}
	}

	const { length } = Object.keys(propsPatches)
	if (!length) return null
	return propsPatches
}

export default diff
import createElement from './createElement'
import diff from './dfsDiff'
import patch from './dfsWalker'

const ul = {
	tagName: 'ul',
	props: {
	  id: 'list',
	  key: 1,
	},
	children: [
	  {
		tagName: 'li',
		props: {
		  key: 1,
		  class: 'item'
		},
		children: [{
		  tagName: 'button',
		  props: {key: 1},
		  children: ['这里是个按钮']
		}]
	  },{
		tagName: 'li',
		props: {key: 2},
		children: ['li信息']
	  },
	  {
		tagName: 'li',
		props: {key: 3},
		children: ['li信息3']
		}
	]
  }

	const tree = createElement(ul)
	const dom = tree.render()
	document.body.appendChild(dom)
	
	const uls = {
		tagName: 'ul',
		props: {
			key: 1,
			id: 'lists2'
		},
		children: [
			{
				tagName: 'li',
				props: {
					key: 1,
					class: 'items',
				},
				children: [{
					tagName: 'a',
					props: {key: 1},
					children: ['这里22222']
				}]
			},{
				tagName: 'li',
				props: {key: 2},
				children: ['li信息']
			},
			{
				tagName: 'div',
				props: {key: 4},
				children: ['div信息']
			},
			{
				tagName: 'div',
				children: ['div信息2']
			}
		]
	}

	const differs = diff(tree, createElement(uls))
	console.log(differs)
	patch(dom, differs)

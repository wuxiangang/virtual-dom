class Element {
	constructor(tagName, props, children) {
	  this.tagName = tagName
	  this.props = props
	  this.children = children
		this.key = props ? props.key : void 666
		let count = 0
		this.children.forEach((child, i) => {
			if (child instanceof Element) {
				count += child.count
			}
			count ++
		})
		this.count = count
	}

	render() {
	  const el = document.createElement(this.tagName)
	  let { props, children } = this
	  props = props || {}
	  children = children || []
	  for (const propName in props) {
		el.setAttribute(propName, props[propName])
	  }
	  children.map(child => {
		const childEl = (child instanceof Element)
						? child.render()
						: document.createTextNode(child)
		el.appendChild(childEl)
	  });
	  return el
	}
  }

  function el(tagName, props, children) {
	return new Element(tagName, props, children)
  }

  function createElement(virDom) {
	const { tagName, props, children } = virDom
	const newChild = children && children.map(v => {
	  if (v.constructor === Object) {
		return createElement(v)
	  } else {
		return v
	  }
	})
	return el(tagName, props, newChild)
  }

  export default createElement
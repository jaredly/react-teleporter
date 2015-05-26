
import React from 'react'

const teleportable = (Comp) => class Teleportable extends React.Component {
  componentDidMount() {
    this._render()
  }

  componentDidUpdate() {
    this._render()
  }

  onSteal() {
    // contents have been stolen. Node will be hoisted.
    this._telekey = null
  }

  _render() {
    const node = React.findDOMNode(this)
    if ('string' === typeof this.props.telekey && this._telekey !== this.props.telekey) {
      // Teleporting a component over here.
      if (node.firstChild) {
        node.replaceChild(teleregistry.get(this.props.telekey), node.firstChild)
      } else {
        node.appendChild(teleregistry.get(this.props.telekey).firstChild)
      }
      this._telekey = this.props.telekey
      teleregistry.steal(this._telekey, node, this.onSteal.bind(this))
    }

    // children must be a single node
    React.render(<Wrapped {...this.props}, node, () => {
      if (this._telekey) return
      this._telekey = teleregistry.add(node, this.onSteal.bind(this))
      if ('function' === typeof this.props.telekey) {
        this.props.telekey(this._telekey)
      }
    })
  }

  render() {
    return <div/>
  }
}

export {teleportable}

const teleparent = Comp => class Teleparent extends React.Component {
  componentWillUnMount() {
    this.keys.forEach()
  }
  render() {
    return <Comp makeTelekey={this._makeKey.bind(this)} {...this.props}/>
  }
}

export {teleparent}

const _reg = {}

const teleregistry = {
  add(node, onSteal) {
    const id = Math.random().toString(0x0f).slice(10, 20)
    _reg[id] = {node, onSteal}
    return id
  },
  get(id) {
    return _reg[id]
  },
  steal(id, node, onSteal) {
    _reg[id].onSteal()
    _reg[id] = {node, onSteal}
  }
}



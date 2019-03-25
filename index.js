
import React from 'react'

const PT = React.PropTypes

/**
 * This function is best used as a decorator, and it makes a component "teleportable".
 *
 * A teleportable component can be moved between parents, nodes, etc. without
 * losing state, and without losing the DOM tree.
 *
 * Props:
 * - telekey: a teleport key. `teleparents` can create teleport keys.
 *
 * When the `teleparent` that created a telekey is garbage collected
 * (unmounted from the dom), then this teleportable component will also be
 * unmounted, but *not until then*.
 *
 * So if you have a long-lived teleparent with lots of teleportable children,
 * you could end up with a fair amount of garbage.
 */
const teleportable = Wrapped => class Teleportable extends React.Component {
  static propTypes = {
    telekey: PT.string,
  }

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
    let container = teleregistry.get(this.props.telekey).node
    if (this._telekey !== this.props.telekey) {
      teleregistry.steal(this.props.telekey, this.onSteal.bind(this))
      // Teleporting a component over here.
      this._telekey = this.props.telekey
    }

    if (node.firstChild) {
      if (node.firstChild !== container) {
        node.replaceChild(container, node.firstChild)
      }
    } else {
      node.appendChild(container)
    }

    React.render(<Wrapped {...this.props}/>, container)
  }

  render() {
    return <div/>
  }
}

/**
 * Also a @decorator. Makes a component into a `teleparent`.
 *
 * Teleparents can create telekeys (the unique ids used to manage teleportable
 * components), via two functions, given as props:
 *
 * - makeTelekey() -> a new telekey
 * - getTelekey(id) -> get (or create if needed) the telekey corresponding to
 *   some id
 *
 * If you only have one or two teleportable components, then `makeTelekey`
 * probably makes the most sense.
 *
 * If you have a bunch of components that need to be teleportable, that are
 * identified by some string id already, you can use `getTelekey(id)` to
 * always get the same `telekey` for a given `id`.
 *
 * See `photojump.js` for an example of using `getTelekey`, and `example.js`
 * for a simple example of using `makeTelekey`.
 */
const teleparent = Wrapped => class Teleparent extends React.Component {
  constructor(props) {
    super(props)
    this.keys = []
    this.namedKeys = {}
    this._makeKey = this._makeKey.bind(this);
    this.getKey = this.getKey.bind(this);
  }
  componentWillUnMount() {
    this.keys.forEach(key => {
      React.unmountComponentAtNode(_reg[id])
      _reg[id] = null
    })
    Object.keys(this.namedKeys).forEach(name => {
      const id = this.namedKeys[name]
      React.unmountComponentAtNode(_reg[id])
      _reg[id] = null
    })
    this.namedKeys = {}
    this.keys = []
  }

  _makeKey() {
    const key = newKey()
    this.keys.push(key)
    return key
  }
  getKey(id) {
    if (!this.namedKeys[id]) {
      this.namedKeys[id] = newKey()
    }
    return this.namedKeys[id]
  }
  render() {
    return <Wrapped
      getTelekey={this.getKey}
      makeTelekey={this._makeKey}
      {...this.props}/>
  }
}

export {teleportable, teleparent}

/**** internal ****/

/** teleregistry, where root containers are tracked.
 *
 * _reg is a map of telekey => {
 *   node: DOM node container,
 *   onSteal: function to call when another component steals this node
 * }
 */

const _reg = {}

const teleregistry = {
  get(id) {
    if (!_reg[id]) {
      if (_reg[id] === null) {
        throw new Error('Using a stale id! The contents have been garbage collected')
      }
      _reg[id] = {
        node: document.createElement('div'),
        onSteal: () => {}
      }
    }
    return _reg[id]
  },

  steal(id, onSteal) {
    _reg[id].onSteal()
    _reg[id].onSteal = onSteal
  }
}

function newKey() {
  return Math.random().toString(0x0f).slice(10, 20)
}



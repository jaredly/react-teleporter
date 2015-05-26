
import React from 'react'

import {teleportable, teleparent} from './'

const ten = []
for (let i=0; i<10; i++) ten.push(i)

@teleportable
class AwesomeItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {presses: 0}
  }

  componentDidMount() {
    console.log('Mouting!')
  }

  render() {
    return <div style={{
      padding: 5,
      flex: 1,
      border: '2px solid blue',
      height: 50,
      boxSizing: 'border-box',
    }}>
      {this.props.initialText}<br/>
      <button onClick={() => this.setState({presses: this.state.presses + 1})}>
        {this.state.presses + ' '}
        presses
      </button>
    </div>
  }
}

function rnd(max) {
  return parseInt(Math.random() * max)
}

@teleparent
class Something extends React.Component {
  constructor(props) {
    super(props)
    this.state = {sel: [0, 0]}
  }
  componentWillMount() {
    this._telekey = this.props.makeTelekey()
  }
  rnd() {
    this.setState({
      sel: [rnd(5), rnd(10)]
    })
  }

  render() {
    const sel = this.state.sel
    return <div>
      <button onClick={this.rnd.bind(this)}>Jump around!</button>
      {ten.slice(0, 5).map(a => <div key={a} style={{
        display: 'flex',
      }}>{ten.map(b => <div key={b} style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 50,
        backgroundColor: '#eee',
        border: '1px solid white'}}>
        {a === sel[0] && b === sel[1] ? <AwesomeItem
          key="something"
          telekey={this._telekey}
          initialText={a + ':' + b} /> : null}
      </div>)}</div>)}
    </div>
  }
}

const node = document.createElement('div')
document.body.appendChild(node)
React.render(<Something/>, node)


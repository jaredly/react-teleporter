
import React from 'react'
import {teleportable, teleparent} from './'

const PT = React.PropTypes

@teleportable /***\ <---- \***/
class Image extends React.Component {
  constructor(props) {
    super(props)
    this.state = {clicks: 0}
  }
  render() {
    return <div style={{
      boxShadow: '0 0 5px #aaa',
      textAlign: 'center',
      padding: 20,
      marginBottom: 10,
      flex: 1,
    }}>
      <p>Image {this.props.id}</p>
      <button onClick={() => this.setState({clicks: 1 + this.state.clicks})}>
        {this.state.clicks} clicks
      </button>
    </div>
  }
}

@teleparent /***\ <---- \***/
class ImageParent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {popping: null}
  }

  static childContextTypes = {
    popImage: PT.func,
    popKey: PT.func,
  }

  getChildContext() {
    return {
      popImage: id => this.setState({popping: id}),
      popKey: id => this.props.getTelekey(id), /***\ <---- \***/
    }
  }

  render() {
    const style = {
      margin: '0 100px',
      width: 200
    }
    if (this.state.popping) {
      return <div style={style}>
        <Image
          id={this.state.popping}
          telekey={this.props.getTelekey(this.state.popping)} /***\ <---- \***/
          />
        <button onClick={() => this.setState({popping: null})}>
          Unpop
        </button>
      </div>
    }
    return <div style={style}>
      <ImageList/>
    </div>
  }
}

const imageIds = ['image1', 'image2', 'image3', 'image4', 'image5']

class ImageList extends React.Component {
  static contextTypes = {
    popImage: PT.func,
    popKey: PT.func,
  }

  render() {
    return <ul style={{listStyle: 'none', padding: 0}}>
      {imageIds.map(id => <li style={{margin: '20px 0'}} key={id}>
        <Image telekey={this.context.popKey(id)} /***\ <---- \***/
          id={id}/>
        <button onClick={() => this.context.popImage(id)}>Pop this image</button>
      </li>)}
    </ul>
  }
}

const node = document.createElement('div')
document.body.appendChild(node)
React.render(<ImageParent/>, node)


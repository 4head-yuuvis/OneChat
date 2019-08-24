import React, { Component } from 'react'

class UsernameForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onPassoword = this.onPassoword.bind(this)
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.onSubmit(this.state.username)
  }

  onChange(e) {
    this.setState({ username: e.target.value })
  }

  onPassoword(e) {
    this.setState({ password: e.target.value })
  }

  render() {
    const styles = {
      container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        margin: '300px',
      },
     
    }

    return (
      <div>
        <div style={styles.container}>
          <center>
          <h2>What is your username?</h2>
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              placeholder="Username"
              onChange={this.onChange}
            />
            <input type="test"
                   placeholder="password"
                   onChange={this.onPassword} />
            <input type="submit" />
          </form>
          </center> 
        </div>
      </div>
    )
  }
}

export default UsernameForm

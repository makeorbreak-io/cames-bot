import React, { Component } from "react";
import "./Landing.css";

class Landing extends Component {
  state = {
    name: "",
  }
  render() {
    return (
      <div className="Landing">
        <input value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
        <button onClick={() => this.props.login(this.state.name)}>Login</button>
      </div>
    );
  }
}

export default Landing;

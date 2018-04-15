import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export class Auth extends Component {

  componentDidMount() {
    this.props.setUser(this.props.location.search.split("=")[1]);
  }
  render() {
    return (
      <div>
        Loading....
        <Redirect to="/room" />
      </div>
    );
  }
}

export default Auth;

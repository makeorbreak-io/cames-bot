import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from "./Landing";
import OAuth from "./components/OAuth";
import Room from "./components/Room";
const BASE_URL = "https://camoes.herokuapp.com";

class App extends Component {
  state = {
    userName:"",
  }

  login = (name) => {
    window.location.replace(BASE_URL + "/login?username=" + name);
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/room" render={() => <Room userName={this.state.userName}/>} />
            <Route path="/auth" render={(props) => <OAuth location={props.location} setUser={(userName) => this.setState({userName})} />} />
            <Route path="/" render={() => <Landing login={this.login} />}/>
          </Switch>  
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

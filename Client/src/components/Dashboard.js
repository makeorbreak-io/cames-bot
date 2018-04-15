import React, { Component } from "react";
import CurrentPlay from "./CurrentPlay";

export class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard">
        <img className={"dashboard__camoes " + (this.props.playing ? "dashboard__camoes--playing" : "" )} src="/camoes.png" alt="camoes_logo" />
        <div className="reset_button" onClick={this.props.reset} > Reset </div>
        <div className="name" >{this.props.userName} </div>
        <CurrentPlay skipSong={this.props.skipSong} song={this.props.currentSong} /> 
      </div>
    );
  }
}

export default Dashboard;

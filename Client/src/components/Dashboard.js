import React, { Component } from "react";
import CurrentPlay from "./CurrentPlay";
import ReactionBar from "./ReactionBar";

export class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard">
        <img className="dashboard__camoes" src="/camoes.png" alt="camoes_logo" />
        <ReactionBar votes={this.props.votes} active={-1} editVote={this.props.editVote}/>
        <CurrentPlay skipSong={this.props.skipSong} song={this.props.currentSong} userName={this.props.userName}/> 
      </div>
    );
  }
}

export default Dashboard;

import React, { Component } from "react";
import Dashboard from "./Dashboard";
import PlayingQueue from "./PlayingQueue";
import "../stylesheets/Room.css";
import "../stylesheets/CurrentPlay.css";
import "../stylesheets/Dashboard.css";
import "../stylesheets/PlayingQueue.css";
import "../stylesheets/ReactionBar.css";
import "../stylesheets/AddSong.css";

import openSocket from "socket.io-client";

const BASE_URL = "https://camoes.herokuapp.com";

export class Room extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      newSong: "",
      queue: [],
      myPlaylist: [],
      votes: {
        upVotes: 0,
        downVotes: 0,
      },
    };

  }
  changeAddSong = (value) => {
    this.setState({newSong: value});
  }
  addSong = () => {
    fetch(BASE_URL + "/addSong?song="+this.state.newSong + "&username=" + this.props.userName).then(response => response.json()).then(
      responseJson => console.log("response",responseJson)
    ); 
  }

  skipSong = () => {
    fetch(BASE_URL + "/skip?username=" + this.props.userName).then(response => response.json()).then(
      responseJson => console.log("response",responseJson)
    ); 
  }
  reset = () => {
    fetch(BASE_URL + "/reset");

  }

  componentDidMount(){
    
    this.socket = openSocket(BASE_URL);
    this.socket.on("playlist",(queue) =>{console.log("qeueu",queue);this.setState({queue});});
  }

  render() {
    return (
      <div className="room">
        <Dashboard skipSong={this.skipSong} reset={this.reset} playing={this.state.queue.length > 0} currentSong={this.state.queue[0]} votes={this.state.votes} userName={this.props.userName}/>
        <PlayingQueue queue={this.state.queue} playlist={this.state.myPlaylist} newSong={this.state.newSong} addSong={this.addSong} changeAddSong={this.changeAddSong}/>
      </div>
    );
  }
}

export default Room;

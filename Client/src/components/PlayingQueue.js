import React, { Component } from "react";
import PlaylistItem from "./PlaylistItem";
import AddSong from "./AddSong";

export class PlayingQueue extends Component {

  constructor(props) {
    super(props);
    this.state = { generalPlaylist: true };
  }

  millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  changeToogle(selection) {
    this.setState(() => {
      return {
        generalPlaylist: selection,
      };
    });
  }

  render() {
    const list = this.state.generalPlaylist ? this.props.queue : this.props.queue;
    return (
      <div className="playing-queue">
        <div className="playing-queue__toggle">
          <button
            className={"playing-queue__toggle__button " + (this.state.generalPlaylist ? "playing-queue__toggle__button--active" : "")}
            onClick={() => { this.changeToogle(true); }}
          >
            General
          </button>
          <button
            className={"playing-queue__toggle__button " + (!this.state.generalPlaylist ? "playing-queue__toggle__button--active" : "")}
            onClick={() => { this.changeToogle(false); }}
          >
            Own
          </button>
        </div>
        <div className="playing-queue__header">
          <p className="item-header-artist">Artist</p>
          <p className="item-header-artist">Song</p>
          <p className="item-header-artist">Duration</p>
        </div>
        <div className="playing-queue__playlist">
          {list.map((song, index) => <PlaylistItem key={song.name + "-" + index} even={index % 2 ? "even" : "odd"} name={song.name} artist={song.artists && song.artists[0].name} duration={this.millisToMinutesAndSeconds(song.duration_ms)} />)}
        </div>
        <AddSong addSong={this.props.addSong} newSong={this.props.newSong} changeAddSong={this.props.changeAddSong} />
      </div>
    );
  }

}

export default PlayingQueue;

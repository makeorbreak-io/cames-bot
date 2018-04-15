import React, { Component } from "react";

export class AddSong extends Component {

  render() {
    return (
      <div className="add-song">
        <h5 className="helptext">Paste Spotify track URI: </h5>
        <input className="track-uri" value={this.props.newSong} onChange={(e) => this.props.changeAddSong(e.target.value)} type="text"/>
        <div onClick={() =>this.props.addSong()}><i  className="fas fa-plus-circle btn-add"></i></div>
      </div>
    );
  }
}

export default AddSong;

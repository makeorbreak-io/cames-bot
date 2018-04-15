import React, { Component } from "react";

export class PlaylistItem extends Component {
  render() {
    const { name, artist, duration } = this.props;
    return (
      <div className={`song__${this.props.even}`}>
        <p className="song-artist">{artist}</p>
        <p className="song-name">{name}</p>
        <p className="song-duration">{duration}</p>
      </div>
    );
  }
}

export default PlaylistItem;

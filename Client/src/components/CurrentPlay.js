import React, { Component } from "react";

export class CurrentPlay extends Component {

  millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  render() {
    const { name, artists, duration_ms } = this.props.song || {name: "no music playing",artist:"",duration:""};
    return (
      <div className="current-play">
        <p style={{margin: "0px 10px"}}>{this.props.userName}</p>
        <div className="current-play__info">
          {`${artists && artists[0].name} - ${this.millisToMinutesAndSeconds(duration_ms)}`}
        </div>
        <div onClick={() =>this.props.skipSong()} className="btn-skip">
          <p className="skip-text">Skip</p>
          <p className="skip-icn"><i className="fas fa-chevron-circle-right btn-skip"></i></p>
        </div>
      </div>
    );
  }
}

export default CurrentPlay;

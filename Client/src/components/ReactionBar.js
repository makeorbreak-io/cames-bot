import React, { Component } from "react";

export class ReactionBar extends Component {
  render() {
    const { votes, active} = this.props;
    return (
      <div className="reaction-bar">
        <div 
          className={"reaction-bar__up-votes" + (active === 0 ? "--active" :"")}
          onClick={() => this.props.editVote(1)}
        >
          <i className="fas fa-arrow-up"></i>
          <p>{votes.upVotes}</p>
        </div>
        <div 
          className={"reaction-bar__down-votes" + (active === 1 ? "--active" :"")}
          onClick={() => this.props.editVote(-1)}
        >
          <i className="fas fa-arrow-down"></i>
          <p>{votes.downVotes}</p>
        </div>
      </div>
    );
  }
}

export default ReactionBar;

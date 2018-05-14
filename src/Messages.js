import React from "react";

let styleL = {
  display: "flex",
  alignItems: "center",
  flexWrap : "wrap",
};

let styleM = {
  display : "felx",
  flexWrap : "wrap",
  flexDirection:'row'
};



export default class Messages extends React.Component {
  removeMessage(messageRef) {
    messageRef.remove();
  }

  render() {
    let allMessages = [];
    if (this.props.snap) {
      this.props.snap.forEach(snap => { allMessages.push(
          <li key={snap.key} className="m-3 row">
            <div className="d-flex">
              <img
                className="mb-1 mr-2"
                src={snap.val().author.photoURL}
                alt="current user pic"/>
              <h3 className="text-primary">{snap.val().author.displayName}:</h3>
            </div>
            <div style={styleL}>
              <p style={styleM} className="ml-2 mr-2 mt-2">{snap.val().body}</p>
              {this.props.userID === snap.val().author.uid ? (
                <div>
                  <button className="btn btn-primary mr-3"
                    onClick={() => {snap.ref.update({body : prompt("Update the message...", snap.val().body)});}}
                  >
                    Edit message
                  </button>
                  <button className="btn btn-primary mr-3"
                    onClick={() => this.removeMessage(snap.ref)}>
                    Remove
                  </button>
                </div>
              ) : ("")}
            </div>
          </li>
        );
      });
    }
    return <ul className="mt-3">{allMessages}</ul>;
  }
}

import React from "react";
import { ROUTES } from "./constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import Messages from "./Messages";
import SideNav from "./SideBar";

const style = {
  display: "flex"
};

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      userID: undefined,
      displayName: undefined,
      photoURL: undefined,
      snap: undefined,
      refToMessage: undefined,
      fbError: undefined,
      currentUser : undefined 
    };
  }

  componentDidMount() {
    this.authUnlisten = firebase.auth().onAuthStateChanged(user => {
      this.setState({ currentUser : user });
      if (user) {
        this.setState({
          photoURL: this.state.currentUser.photoURL,
          userID: this.state.currentUser.uid,
          displayName : this.state.currentUser.displayName
        });
        let refer = firebase.database().ref(`messages/${this.props.match.params.channelName}`);
        
        this.setState({ refToMessage : refer });

        this.valueListener = refer.limitToLast(500).on("value", snapshot => {
          this.setState({ snap : snapshot });
        });
      } else {
        this.props.history.push(ROUTES.signIn);
      }
    });
  }



  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.channelName !== this.props.match.params.channelName) {
      this.state.refToMessage.off("value", this.valueListener);
      let refer = firebase.database().ref(`messages/${nextProps.match.params.channelName}`);
        
      this.setState({ refToMessage : refer });

      this.valueListener = refer.limitToLast(500).on("value", snapshot => {
        this.setState({ snap : snapshot });
      });
    }
  }

  handleMessage(evt) {
    
    evt.preventDefault();
    if(this.state.message === "") {
      //do nothing if message is empty
      return;
    }
    let allMessages = {
      author: {
        uid : this.state.userID,
        displayName : this.state.displayName,
        photoURL : this.state.photoURL
      },
      body : this.state.message,
      createdAt : firebase.database.ServerValue.TIMESTAMP
    };

    this.state.refToMessage
      .push(allMessages)
      .then(() => this.setState({fberror : undefined, message: ""}))
      .catch(err => this.setState({fbError: err}));
  }

  componentWillUnmount() {
    this.authUnlisten();
    if (this.state.messagseRef) {
      this.state.refToMessage.off("value", this.valueListener);
    }
  }

  handleSignOut() {
    firebase.auth().signOut();
    this.props.history.push(ROUTES.signIn);
  }

  render() {
    return (
      <div>
        <header className="bg-success text-white">
          <div className="container d-flex p-3">
            <h1 className="col-md">user: {this.state.displayName}</h1>
            <h3 className="col-md">channel: {this.props.match.params.channelName}</h3>
            <button className="col-md btn btn-primary"
              onClick={() => this.handleSignOut()}>
              Sign Out!
            </button>
          </div>
        </header>
        <div style={style}>
          <SideNav currentChannel={this.props.match.params.chanName} />
          <main className="container mt-3">
          {this.state.fbError ? (
                <div className="alert alert-danger">
                  {this.state.fbError.message}
                </div>
              ) : null}
            <form onSubmit={evt => this.handleMessage(evt)}>
              <input onInput={evt => this.setState({ message: evt.target.value })}
                type="text"
                className="form-control"
                value={this.state.message}
                placeholder="what's on your mind?"
              />
            </form>{" "}
            <Messages
              snap={this.state.snap}
              userID={this.state.userID}
            />
          </main>
        </div>
      </div>
    );
  }
}

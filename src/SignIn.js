import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import React from 'react';
import {ROUTES} from "./constants";
import {Link} from "react-router-dom";

export default class SignInView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentUser : undefined, email : "", password : ""};
    }

    componentDidMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.props.history.push(ROUTES.generalChannel);
            }
        });
    }

    componentWillUnmount() {
        this.authUnlisten();
    }

    handleSignOut() {
        firebase.auth().signOut();
    }

    handleSignIn() {
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            
            .then(() => this.props.history.push(ROUTES.generalChannel))
            .catch(err => this.setState({fberror : err}));
            
    }

    updateInput(evt) {
        let inputType = evt.target.id;
        let inputVal = evt.target.value;
        if(inputType === 'email') {
            this.setState({email : inputVal});
        }else {
            this.setState({password : inputVal});
        }
    }

    render() {
        return (
            <div>
                <header className="jumbotron jumbotron-fluid bg-success text-white">
                    <div className="container">
                        <h1>SIGN IN PAGE</h1>
                    </div>
                </header>
                <main>
                    <div className="container">
                        {this.state.fberror ? (<div className="alert alert-danger">
                                {this.state.fberror.message}
                                </div>) :(undefined)}
                        <form onSubmit={evt => this.handleSignIn()}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input onChange={evt => this.updateInput(evt)}
                                    type="text"
                                    id="email"
                                    className="form-control"
                                    placeholder="your email address"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input onChange={evt => this.updateInput(evt)}
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    placeholder="your password"/>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">Sign In</button>
                            </div>
                        </form>
                            <p>Don't have an account yet? <Link to={ROUTES.signUp}>Sign Up!</Link></p>
                    </div>
                </main>
            </div>
        );
    }
}
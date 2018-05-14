import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import React from 'react';
import {ROUTES} from "./constants";
import md5 from "blueimp-md5";
import {Link} from "react-router-dom";

export default class SignUpView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email : "", password : "", name : "", confirmPass : "", working : false};
    }

    componentDidMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged(user=> {
            this.setState({currentUser : user});
        });
    }


    handleSignUp() {
        if(!this.state.working) {
            this.setState({working: true});
            if(this.state.email === "") {
                this.setState({error : "Email cannot be empty"});
                this.setState({working: false});
            }else if (this.state.password.length < 6) {
                this.setState({error : "The password must be at least 6 characters long"});
                this.setState({working: false});
            }else if(this.state.password !== this.state.confirmPass) {
                this.setState({error : "The passwords don't match"});
                this.setState({working: false});
            }else if(this.state.name === "") {
                this.setState({error : "Display Name cannot be empty"});
                this.setState({working: false});
            }else {
                this.setState({error : undefined});
                this.setState({working : false});
                let hashEmail = md5(this.state.email.trim().toLowerCase());
                firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                    .then(user => user.updateProfile({
                        displayName: this.state.name,
                        photoURL : "https://www.gravatar.com/avatar/" + hashEmail + "?s=40"
                    })
                )
                .then(() => this.props.history.push(ROUTES.generalChannel))
                .catch(err => this.setState({fberror: err}));         
            }
        }
    }

    updateInput(evt) {
        let inputType = evt.target.id;
        let inputVal = evt.target.value;
        if(inputType === "email") {
            this.setState({email : inputVal});
        }else if(inputType === "password") {
            this.setState({password : inputVal});
        }else if(inputType === "name") {
            this.setState({name : inputVal});
        }else {
            this.setState({confirmPass : inputVal});
        }
    }

    componentWillUnmount() {
        this.authUnlisten();
    }

    render() {
        return (
            <div>
                <header className="jumbotron jumbotron-fluid bg-primary text-white">
                    <div className="container">
                        <h1>SIGN UP PAGE</h1>
                    </div>
                </header>
                <main>
                    <div className="container">
                        {this.state.fberror ? (<div className="alert alert-danger">
                            {this.state.fberror.message}
                            </div>) :(undefined)}
                            {this.state.error ? (<div className="alert alert-danger">
                            {this.state.error}
                            </div>) :(undefined)}
                        <form onSubmit={evt => this.handleSignUp()}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input onChange={evt => this.updateInput(evt)}
                                    type="text"
                                    id="email"
                                    className="form-control"
                                    placeholder="your email address"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Display Name</label>
                                <input onChange={evt => this.updateInput(evt)}
                                    type="text"
                                    id="name"
                                    className="form-control"
                                    placeholder="your display name"/>
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
                                <label htmlFor="password">Confirm Password</label>
                                <input onChange={evt => this.updateInput(evt)}
                                    type="password"
                                    id="confirmPassword"
                                    className="form-control"
                                    placeholder="confirm your password"/>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">Sign Up</button>
                            </div>
                        </form>
                            <p>Have an account already? <Link to={ROUTES.signIn}>Sign In!</Link></p>
                    </div>
                </main>
            </div>
        );
    }

}
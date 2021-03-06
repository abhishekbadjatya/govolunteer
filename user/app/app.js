import React from 'react';
import ReactDOM from 'react-dom';
import {Route, hashHistory, Router, IndexRedirect} from 'react-router';
import {Provider} from 'react-redux';
import store  from './store/store.js';
import BaseContainer from './containers/BaseContainer/BaseContainer.js';
import LoginContainer from './containers/LoginContainer/LoginContainer.js';
import SignUpContainer from './containers/SignUpContainer/SignUpContainer.js';
import OrganizationContainer from './containers/OrganizationContainer/OrganizationContainer.js';
import UserContainer from './containers/UserContainer/UserContainer.js';
import {loginCheck, orgCheck, userCheck} from './checks/checks.js';
import ForgotPasswordContainer from './containers/ForgotPasswordContainer/ForgotPasswordContainer.js';
import ResetPasswordContainer from './containers/ResetPasswordContainer/ResetPasswordContainer.js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(

	<Provider store = {store}>
		<Router history = {hashHistory} >
			<Route path = '/' component = {BaseContainer}  >
				<IndexRedirect to = '/login' />
				<Route onEnter = {loginCheck} path = 'login' component = {LoginContainer} />
				<Route path = "signUp" component = {SignUpContainer} />
				<Route onEnter = {orgCheck} path = "org/:childRoute" component = {OrganizationContainer} />
				<Route onEnter = {userCheck} path = "user/:childRoute" component = {UserContainer} />
				<Route path = 'forgotPassword' component = {ForgotPasswordContainer} />
				<Route path = 'resetPassword' component = {ResetPasswordContainer} />
			</Route>
		</Router>

	</Provider>

,document.getElementById('app'));
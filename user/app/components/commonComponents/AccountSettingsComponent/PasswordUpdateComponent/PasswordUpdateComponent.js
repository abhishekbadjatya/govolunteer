import React from 'react';
import CSSModules from 'react-css-modules';
import PasswordUpdateComponentStyles from './assets/PasswordUpdateComponent.scss';
import _ from 'lodash';

class PasswordUpdateComponent extends React.Component {

	constructor (props) {

		super(props);
		this._handleKeyPress = this._handleKeyPress.bind(this);
		this.onClickOfUpdatePasswordButton = this.onClickOfUpdatePasswordButton.bind(this);

	}

	_handleKeyPress (e) {

		if (e.key === 'Enter') {
			this.onClickOfUpdatePasswordButton();
		}
	}
	
	onClickOfUpdatePasswordButton () {

		if (!this.oldpasswordRefSave.value || !this.newpasswordRefSave.value || !this.newpasswordCopyRefSave.value) {

			this.props.accountManagementActions.triggerNotification({

				"level" : "error",
				"message" : "Please, fill out all fields."


			});
			return

		}
		if (_.trim(this.oldpasswordRefSave.value) !=  this.oldpasswordRefSave.value) {

			this.props.accountManagementActions.triggerNotification({

				"level" : "error",
				"message" : "Username can't have leading or trailing spaces."


			});
			return

		}


		if (this.newpasswordCopyRefSave.value != this.newpasswordRefSave.value) {
			this.props.accountManagementActions.triggerNotification ({

				"level" : "error",
				"message" : "Passwords don't match."
			});
			return
		}
		if (this.newpasswordRefSave.value == this.oldpasswordRefSave.value)  {

			this.props.accountManagementActions.triggerNotification ({

				"level" : "error",
				"message" : "New password and old password can't match."
			});
			return

		}

		if (!_.trim(this.newpasswordRefSave.value)) {

			this.props.accountManagementActions.triggerNotification({

				"level" : "error",
				"message" : "Password can't be all spaces."


			});
			return

		}



		
		this.props.accountManagementActions.updatePassword({

			oldPassword : this.oldpasswordRefSave.value,
			newPassword : this.newpasswordRefSave.value


		});

		this.oldpasswordRefSave.value = '';
		this.newpasswordRefSave.value = '';
		this.newpasswordCopyRefSave.value = '';

		
	}
	render () {
			return (
			<div>
				<div styleName="form">
					<div id="login">   
			          <h1 styleName ='welcome-back-text'>Update Password</h1>
			          
			          <form>
			          
				        <div styleName="field-wrap">
				            <label styleName='labels-input'>
				              Old Password<span styleName="req" >*</span>
				            </label>
				            	<input styleName='text-fields' autoComplete={'off'}
				            	type='password' 
								ref = {(ref) => this.oldpasswordRefSave = ref} 
								onKeyPress = {this._handleKeyPress} />


				        </div>
				          
				        <div styleName="field-wrap">
				            <label styleName='labels-input'>
				              New Password<span styleName="req" >*</span>
				            </label>
				            	<input 
				            	styleName='text-fields' autoComplete={'off'}
				            	type ='password' 
								ref = {(ref) => this.newpasswordRefSave = ref}
							 	onKeyPress = {this._handleKeyPress} />

				        </div>
				        <div styleName="field-wrap">
				            <label styleName='labels-input'>
				              Re-enter New Password<span styleName="req" >*</span>
				            </label>
				            	<input 
				            	styleName='text-fields' autoComplete={'off'}
				            	type ='password' 
								ref = {(ref) => this.newpasswordCopyRefSave = ref}
							 	onKeyPress = {this._handleKeyPress} />

				        </div>
				        <div styleName='gap-up'>
				          <div styleName = 'gap'>
				          		<input type = 'button' onClick = {this.onClickOfUpdatePasswordButton}
				 				styleName="button button-block" value = 'Update Password' />
				          </div>
						</div>

			          </form>

			        </div>

				</div>
			</div>



			);

	}
}

export default CSSModules(PasswordUpdateComponent, PasswordUpdateComponentStyles, {allowMultiple:true});

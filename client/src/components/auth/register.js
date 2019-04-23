import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {registerUser} from '../../actions/authAction';
import TechFieldGroup from '../common/TechFieldGroup';
class Register extends Component {
  constructor(){
    super()

    this.state = {
      name: '',
      password: '',
      password2: '',
      email: '',
      errors: {}
    }
  }


  componentDidMount(){
    if(this.props.auth.isAuthenticated){
      this.props.history.push("/dashboard")
    }
  }



  componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({errors: nextProps.errors})
    }
  }


  onChange = (e) =>{
    //in brackets because it dynamically changes
    this.setState({ [e.target.name] : e.target.value})
  }


  onSubmit = (e)=>{
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      password: this.state.password,
      password2: this.state.password2,
      email: this.state.email,
      errors: this.state.errors
    }
    this.props.registerUser(newUser, this.props.history);
  }


  render() {
    const {errors} = this.state;


    return (
      <div>
        <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Sign Up</h1>
                <p className="lead text-center">Create your DevConnector account</p>
                <form  noValidate onSubmit={this.onSubmit}>
                  <TechFieldGroup 
                      placeholder='Name'
                      name='name'
                      onChange={this.onChange}  
                      value={this.state.name}
                      error={errors.name}
                    />
                  <TechFieldGroup noValidate
                      placeholder='Email'
                      name='email'
                      onChange={this.onChange}  
                      value={this.state.email}
                      error={errors.email}
                      info='This site uses Gravatar so if you want a profile image, use a Gravatar email'
                    />
                  <TechFieldGroup 
                      placeholder='Password'
                      name='password'
                      onChange={this.onChange}  
                      value={this.state.password}
                      error={errors.password}
                    />
                  <TechFieldGroup 
                      placeholder='Confirm password'
                      name='password2'
                      onChange={this.onChange}  
                      value={this.state.password2}
                      error={errors.password2}
                    />
                  <input type="submit" className="btn btn-info btn-block mt-4" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) =>({
   auth: state.auth, //<- state.auth comes from rootReducer from index.js file in reducers folder
   errors: state.errors 
})


Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}



export default connect(mapStateToProps, {registerUser})(withRouter(Register));

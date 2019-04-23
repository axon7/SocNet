import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {loginUser} from '../../actions/authAction';
import {connect} from 'react-redux';
import TechFieldGroup from '../common/TechFieldGroup';
class Login extends Component {
  constructor(){
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    }
  }

  onChange = (e) =>{
    //in brackets because it dynamically changes
    this.setState({ [e.target.name] : e.target.value})
  }

  onSubmit = (e)=>{
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    }

    this.props.loginUser(userData);
    
  }

  componentDidMount(){
    if(this.props.auth.isAuthenticated){
      this.props.history.push("/dashboard")
    }
  }   


  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.isAuthenticated){
      this.props.history.push("/dashboard");
    } 
     if(nextProps.errors){
      this.setState({errors: nextProps.errors}); 
    }
  }




  render() {
    const {errors} = this.state;
    return (
      <div>
        <div className="login">
            <div className="container">
              <div className="row">
                <div className="col-md-8 m-auto">
                  <h1 className="display-4 text-center">Log In</h1>
                  <p className="lead text-center">Sign in to your DevConnector account</p>
                  <form onSubmit={this.onSubmit}>

                    <TechFieldGroup 
                      type='email' 
                      placeholder='Email address'
                      name='email'
                      onChange={this.onChange}  
                      value={this.state.email}
                      error={errors.email}
                    />


                    <TechFieldGroup 
                      type='password' 
                      placeholder='Passsword'
                      name='password'
                      onChange={this.onChange}  
                      value={this.state.password}
                      error={errors.password}
                    />

                    {/* <div className="form-group">
                      <input 
                        type="password" 
                        className={classnames('form-control form-control-lg', {'is-invalid': errors.password})} 
                        placeholder="Password" 
                        name="password"
                        onChange={this.onChange}  
                        value={this.state.password} />
                        {errors.password && (<div className='invalid-feedback'>{errors.password}</div>)}

                    </div> */}
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  erorrs: PropTypes.object.isRequired

}

const mapStateToProps = (state) =>({
  auth: state.auth,
  errors: state.errors
})


export default connect(mapStateToProps, {loginUser})(Login);

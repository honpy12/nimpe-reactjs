import React, { Component } from "react";
import ConstantList from "../../appConfig";
import {
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
  Select,
  Input,
  InputLabel,
  FormControl,
  MenuItem,
  FormHelperText
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { getAllEQARound, getAllHealthOrgType, signUpAccount, checkuserName, checkEmail } from "./SessionService";
import { connect } from "react-redux";
import { Helmet } from 'react-helmet';
import { Redirect, Link } from 'react-router-dom';
import { toast } from "react-toastify";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: "",
      username: "",
      gender: "",
      email: "",
      password: "",
      phone: "",
      lastName: "",
      firstName: "",
    };
  }

  listGender = [
      { id: 'M', name: 'Nam' },
      { id: 'F', name: 'Nữ' },
      { id: 'U', name: 'Không rõ' },
    ]

  handleChange = (event, source) => {
    event.persist()
    if (source === 'switch') {
      this.setState({ isActive: event.target.checked })
      return
    }
    if (source === 'changePass') {
      this.setState({ changePass: event.target.checked })
      return
    }
    if (source === 'active') {
      this.setState({ active: event.target.checked })
      return
    }
    if (source === 'displayName') {
      let displayName = this.state;
      displayName = event.target.value;
      this.setState({ displayName: displayName })
      return
    }
    if (source === 'gender') {
      let gender = this.state;
      gender = event.target.value;
      this.setState({ gender: gender })
      return
    }
    if (source === 'phone') {
      let phone = this.state;
      phone = event.target.value;
      this.setState({ phone: phone })
      return
    }
    if (source === 'firstName') {
      let { lastName } = this.state;
      let displayName = event.target.value.trim() + " " + (lastName ? lastName : '');
      this.setState({ firstName: event.target.value, displayName: displayName });
      return
      // let firstName = this.state;
      // firstName = event.target.value;
      // this.setState({ firstName: firstName })
      // return
    }
    else if (source === 'lastName') {
      // let lastName = this.state;
      // lastName = event.target.value;
      // this.setState({ lastName: lastName })
      // return
      let { firstName } = this.state;
      let displayName = firstName.trim() + " " + (event.target.value.trim() ? event.target.value.trim() : '');
      this.setState({ lastName: event.target.value, displayName: displayName });
      return
    }
    
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  openSelectDepartmentPopup = () => {
    this.setState({
      shouldOpenSelectDepartmentPopup: true,
    })
  }

  handleFormSubmit = (item) => {
    let registerDto = {};
    registerDto.username = this.state.username;
    registerDto.lastName = this.state.lastName;
    registerDto.firstName = this.state.firstName;
    registerDto.email = this.state.email;
    registerDto.displayName = this.state.displayName;
    registerDto.password = this.state.password;
    registerDto.phone = this.state.phone;
    checkuserName(registerDto).then((result) => {
      if (result.data == false) {
        alert('Tên đăng nhập này đã được sử dụng.');
      }
      else {
        checkEmail(registerDto).then((result) => {
          if (result.data == false) {
            alert('Email này đã được sử dụng.');
          }
          else {
            signUpAccount(registerDto).then((result) => {
              if (result != null && result.data != null && result.data != '') {
                if (result.data.hasEmail) {
                  alert('Email này đã được sử dụng.');
                }
                else if (result.data.sendEmailFailed) {
                  alert('Có lỗi khi gửi email thông báo đến email của bạn. Vui lòng thử lại.');
                }
                else {
                  this.props.history.push('/session/otpAuth/' + this.state.email);
                }
              }
              else {
                alert('Có lỗi xảy ra khi đăng ký.');
              }
            });
          }
        }, (error) => {
          alert('Có lỗi xảy ra khi đăng ký.');
        });
      }
    }, (error) => {
      alert('Có lỗi xảy ra khi đăng ký.');
    });
  };

  componentDidMount() {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.password) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch');
  }

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props
    let {
      displayName,
      email,
      username,
      password,
      phone,
      lastName,
      firstName,
    } = this.state;
    return (
      <div className="signup flex flex-center w-100 h-100vh">
        <Helmet>
          <title>{t('Dashboard.register')} | {t('web_site')} </title>
        </Helmet>
        <div className="p-8">
          <Card className="signup-card position-relative y-center" style={{top: '40vh'}}>
            <Grid container>
              <Grid item lg={5} md={5} sm={5} xs={12}>
                <div className="p-32 flex flex-center flex-middle h-100 logo-login">
                  <img src={"/assets/images/logos/logo_nimpe.jpg"} alt="" />
                </div>
              </Grid>
              <Grid item lg={7} md={7} sm={7} xs={12}>
                <div className="p-36 h-100 bg-light-gray position-relative">
                  <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                    <TextValidator
                      className="w-100 mb-16"
                      size="small"
                      label={<span>{t('user.firstName')}</span>}
                      onChange={(value) =>
                        this.handleChange(value, 'firstName')
                      }
                      variant="outlined"
                      type="text"
                      name="name"
                      value={firstName}
                      // validators={['required']}
                      // errorMessages={['this field is required']}
                    />

                    <TextValidator
                      className="w-100 mb-16"
                      size="small"
                      label={<span>{t('user.lastName')}</span>}
                      onChange={(value) =>
                        this.handleChange(value, 'lastName')
                      }
                      variant="outlined"
                      type="text"
                      name="name"
                      value={lastName}
                      // validators={['required']}
                      // errorMessages={['this field is required']}
                    />

                    <TextValidator
                      disabled={true}
                      className="w-100 mb-16"
                      size="small"
                      label={<span><span style={{ color: "red" }}>*</span>{t('user.displayName')}</span>}
                      onChange={(displayName) =>
                        this.handleChange(displayName, 'displayName')
                      }
                      variant="outlined"
                      type="text"
                      name="name"
                      value={displayName}
                      validators={['required']}
                      errorMessages={['this field is required']}
                    />
                    
                    <TextValidator
                      className="w-100 mb-16"
                      label={<span>{t('user.phone')}</span>}
                      onChange={this.handleChange}
                      type="text"
                      size="small"
                      variant="outlined"
                      name="phone"
                      value={phone}
                      // validators={['required']}
                      // errorMessages={['this field is required']}
                    />
                    <TextValidator
                      className="w-100 mb-16"
                      label={<span><span style={{ color: "red" }}>*</span>{t('user.username')}</span>}
                      onChange={this.handleChange}
                      type="text"
                      size="small"
                      variant="outlined"
                      name="username"
                      value={username}
                      validators={['required']}
                      errorMessages={['this field is required']}
                    />

                    <TextValidator
                      className="w-100 mb-16"
                      label={<span><span style={{color:"red"}}>*</span>{t('user.email')}</span>}
                      size="small"
                      onChange={this.handleChange}
                      type="email"
                      name="email"
                      value={email}
                      variant="outlined"
                      validators={['required', 'isEmail']}
                      errorMessages={[
                        'This field is required',
                        'Email is not valid',
                      ]}
                    />

                    <TextValidator
                      className="mb-16 w-100"
                      label={<span><span style={{color:"red"}}>*</span>{t('user.pass')}</span>}
                      variant="outlined"
                      size="small"
                      onChange={this.handleChange}
                      name="password"
                      type="password"
                      value={password}
                      validators={['required']}
                      errorMessages={['This field is required']}
                    />
                    
                    <div className="flex flex-middle mb-8">
                      <Button
                        className="capitalize"
                        variant="contained"
                        color="primary"
                        type="submit"
                      >
                        {t("sign_up.title")}
                      </Button>
                    </div>
                    <p className="text-muted" style={{ position: "absolute", bottom: "0",  left: "45%", transform: "translateX(-45%)"}}>
                      Bạn đã có tài khoản?  
                      <Link to="/session/signin" className="text-primary font-weight-bold ml-10">
                        Đăng nhập
                      </Link>
                    </p>
                  </ValidatorForm>
                </div>
              </Grid>
            </Grid>
          </Card>     
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // setUser: PropTypes.func.isRequired
});

export default connect(
  mapStateToProps,
  {}
)(SignUp);

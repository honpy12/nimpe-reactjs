import React, { Component } from "react";
import {
  Card,
  Grid,
  Button,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {  checkOTP } from "./SessionService";
import { connect } from "react-redux";
import { Helmet } from 'react-helmet';
import { Redirect, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

class OTPAuthentication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
    };
  }

  handleChange = (event, source) => {
    event.persist()
    if (source === 'switch') {
      this.setState({ isActive: event.target.checked })
      return
    }
    if(source === 'token'){
        let token = this.state;
        token = event.target.value;
        this.setState({ token: token })
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

  handleFormSubmit = (event) => {
    let registerDto = {};
    let email = this.props.match.params.email;
    registerDto.token = this.state.token;
    registerDto.email = this.props.match.params.email;
    if(this.state.token.length == 5) {
      if(email){
        checkOTP(registerDto).then((result) => {
          if (result.data?.data == true && result.data?.code === 200) {
            toast.success('Đăng ký thành công.');
            this.props.history.push('/session/signin');
          }
          else {
            toast.error('Có lỗi xảy ra khi đăng ký.');
          }
        }, (error) => {
          toast.error('Có lỗi xảy ra khi đăng ký.');
        });
      } else {
        toast.error("Email không tồn tại");
      } 
    } else {
      toast.error("Mã OTP nhập vào không đúng quy định!")
    }
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
      token
    } = this.state;
    return (
      <div className="signup flex flex-center w-100 h-100vh">
        <Helmet>
          <title>{t('Dashboard.otpAuthentication')} | {t('web_site')} </title>
        </Helmet>
        <div className="p-8">
          <Card className="signup-card position-relative y-center" style={{top: '30vh'}}>
            <Grid container>
              <Grid item lg={5} md={5} sm={5} xs={12}>
                <div className="p-32 flex flex-center flex-middle h-100 logo-login">
                  <img src={"/assets/images/logos/logo_nimpe.jpg"} alt="" />
                </div>
              </Grid>
              <Grid item lg={7} md={7} sm={7} xs={12}>
                <div className="p-36 h-100 bg-light-gray position-relative">
                  <p style={{textAlign: 'center'}}>Mời bạn nhập mã xác thực OTP đã được gửi đến email của bạn:</p>
                  <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                    <TextValidator
                      className="w-100 mb-16"
                      size="small"
                      label={<span><span style={{ color: "red" }}>*</span>{t('user.otpCode')}</span>}
                      onChange={(token) =>
                        this.handleChange(token, 'token')
                      }
                      variant="outlined"
                      type="text"
                      name="token"
                      value={token}
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
                      <Link to="/session/signin" className="text-primary font-weight-bold ml-1">
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
)(OTPAuthentication);

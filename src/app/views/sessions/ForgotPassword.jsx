import React, { Component, Suspense } from "react";
import ConstantList from "../../appConfig";
import {
  Card,
  Grid,
  Button,
  withStyles,
  CircularProgress
} from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { withRouter } from "react-router-dom";
import { forgotPassword, resetPassword } from './SessionService';
// import { resetPassword } from "../../redux/actions/LoginActions";
import { toast, ToastContainer } from 'react-toastify';
import { Redirect, Link } from 'react-router-dom';

class ForgotPassword extends Component {
  state = {
    email: '',
    token: '',
    newPassword: '',
    confirmNewPassword: '',
    emailCorrect: false
  };

  componentDidMount() {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.newPassword) {
        return false;
      }
      return true;
    });
  }
  handleChange = event => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = (e) => {
    let { t } = this.props;
    if (!this.state.emailCorrect) {
      forgotPassword({ email: this.state.email }).then((data) => {
        console.log(data);
        toast.success('Kiểm tra OTP trong email đăng ký');
        this.setState({
          emailCorrect: true
        });
      }).catch((reason) => {
        if (reason.response?.status === 400) {
          toast.error('Email không tồn tại');
        } else {
          toast.error('Có lỗi xảy ra');
        }
        console.log(reason.message);
      })
    }
     else {
      resetPassword({...this.state}).then((data) => {
        console.log(data)
        if(data.data.code === 200){
        toast.success('Thay đổi mật khẩu thành công');
        setTimeout(()=>{
          this.props.history.push(ConstantList.ROOT_PATH + "session/signin")
        }, 1000)
        
        }else{
          toast.error(`Thông tin không chính xác`);
        }
      }).catch((err) => {
        toast.error(err.message);
      })
    }
  };
  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch');
  }
  render() {
    let { email, emailCorrect, newPassword, confirmNewPassword, token } = this.state;
    return (
      <div className="signup flex flex-center w-100 h-100vh">
        <div className="p-8">
          <Card className="signup-card position-relative y-center" style={{top:'25vh'}}>
            <Grid container>
              <Grid item lg={5} md={5} sm={5} xs={12}>
                <div className="p-32 flex flex-center flex-middle h-100">
                  <img src={"/assets/images/logos/logo_nimpe.jpg"} alt="" />
                </div>
              </Grid>
              <Grid item lg={7} md={7} sm={7} xs={12}>
                <div className="p-24 h-100 bg-light-gray position-relative">
                  <p style={{fontSize: '16px', paddingBottom: '20px'}}>Mời bạn nhập email để lấy lại mật khẩu: </p>
                  <ValidatorForm ref="form" onSubmit={(e) => this.handleFormSubmit(e)}>
                    <TextValidator
                      size="small"
                      className="mb-24 w-100"
                      variant="outlined"
                      label="Email"
                      onChange={this.handleChange}
                      type="email"
                      name="email"
                      value={email}
                      validators={["required", "isEmail"]}
                      errorMessages={[
                        "this field is required",
                        "email is not valid"
                      ]}
                    />
                    {
                      emailCorrect && <>
                        <TextValidator
                          size="small"
                          className="mb-24 w-100"
                          variant="outlined"
                          label="OTP"
                          onChange={this.handleChange}
                          type="text"
                          name="token"
                          value={token}
                          validators={["required"]}
                          errorMessages={[
                            "this field is required"
                          ]}
                        />
                        <TextValidator
                          size="small"
                          className="mb-24 w-100"
                          variant="outlined"
                          label="Mật khẩu"
                          onChange={this.handleChange}
                          type="password"
                          name="newPassword"
                          value={newPassword}
                          validators={["required", "matchRegexp:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"]}
                          errorMessages={[
                            "this field is required", 'Mật khẩu có 8 ký tự bao gồm: Chữ hoa, chữ thường, số và ký tự đặc biệt'
                          ]}
                        />

                        <TextValidator
                          size="small"
                          className="mb-24 w-100"
                          variant="outlined"
                          label="Nhập lại mật khẩu"
                          onChange={this.handleChange}
                          type="password"
                          name="confirmNewPassword"
                          value={confirmNewPassword}
                          validators={["isPasswordMatch", "required"]}
                          errorMessages={[
                            "Mật khẩu không khớp", "this field is required"
                          ]}
                        />
                      </>
                    }
                    <div className="flex flex-middle">
                      <Suspense fallback={<h1>loading</h1>}>
                        <Button variant="contained" color="primary" type="button" onClick={this.handleFormSubmit}>
                          Lấy lại mật khẩu
                        </Button>
                      </Suspense>
                    </div>
                    <p className="text-muted" style={{ position: "absolute", bottom: "0",  left: "40%", transform: "translateX(-40%)"}}>
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
        <ToastContainer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  resetPassword: PropTypes.func.isRequired,
  login: state.login
});
export default withRouter(
  connect(
    mapStateToProps,
    { resetPassword }
  )(ForgotPassword)
);

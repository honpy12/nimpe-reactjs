import React, { Component } from "react";
import ConstantList from "../../appConfig";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { withTranslation } from "react-i18next";
class Brand extends Component {
	state = {};
	render() {
		const { t } = this.props;
		return (
			<div className="flex flex-middle flex-space-between brand-area">
				{/* <div className="flex flex-middle brand">       
          <Link to={ConstantList.HOME_PAGE}>
            <img src= {ConstantList.ROOT_PATH+ "assets/images/Logo_Viettel.png"} alt="company-logo" />          
          </Link>
          <span className="brand__text">AMMIS</span>
        </div> */}
				<div className="flex flex-middle brand logo-menu">
					<Link to={ConstantList.HOME_PAGE}>
						<span className="brand__text">
							{t("dengueFeverManagement")}
						</span>
					</Link>
				</div>
				{this.props.children}
			</div>
		);
	}
}
export default withTranslation()(Brand);

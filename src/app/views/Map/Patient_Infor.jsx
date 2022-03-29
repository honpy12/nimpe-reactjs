import {getListPatient, getListVector} from "./MapServices";
import React, { PureComponent } from "react";

export default class Infor extends PureComponent {
    render() {
      const { infor, _type, onClick} = this.props;
  
      return (
        <div>
             {_type} tại{" "}{infor.address}
             
        </div>
      );
    }
  }
import React, { PureComponent } from "react";
import Pin_style from "./Pin_style.css"


export default class Pin_layer_patient extends PureComponent {
  render() {
      const {onClick} = this.props;
    return (
      <div class="layer_patient">
          <div className="tear_patient" onClick={onClick}>
              
          </div>
      </div>
    );
  }
}


  


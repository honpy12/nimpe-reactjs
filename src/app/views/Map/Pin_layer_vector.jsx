import React, { PureComponent } from "react";
import Pin_style from "./Pin_style.css"

export default class Pin_layer_vector extends PureComponent {
    render() {
        const {onClick} = this.props;
      return (
        <div class="layer_vector">
            <div className="tear_vector" onClick={onClick}>
                
            </div>
        </div>
      );
    }
  }
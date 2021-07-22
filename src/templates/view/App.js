import React, { Component } from "react";
import Title from '../../components/Title';
import { KitContextProvider } from "../../components/KitContext";

class App extends Component {
  render() {
    const { children: defaultView, ...rest } = this.props;
    return (
      <KitContextProvider {...rest} defaultView={defaultView}>
        <Title />
      </KitContextProvider>
    );
  }
};

export { App };
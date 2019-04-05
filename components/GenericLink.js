import React from "react";
import SamsungWtbLeadLink from "./SamsungWtbLeadLink";

export default class GenericLink extends React.Component {
  render() {
    const entity = this.props.entity;
    const store = this.props.apiResourceObjects[entity.store];
    const category = this.props.apiResourceObjects[entity.category];

    return <div className="product_link d-flex flex-row justify-content-between border-bottom ">
      <SamsungWtbLeadLink
        wtbEntity={this.props.wtbEntity}
        entity={entity}
        category={category}
        store={store}
        className="store_logo d-flex align-items-center">
        <img src={store.logo} className="img-fluid logo" alt={store.name}/>
      </SamsungWtbLeadLink>

      <div className="store_link d-flex justify-content-end align-items-center">
        <SamsungWtbLeadLink
          wtbEntity={this.props.wtbEntity}
          entity={entity}
          category={category}
          store={store}
          className="btn btn-primary"> IR
        </SamsungWtbLeadLink>
      </div>
    </div>
  }
}
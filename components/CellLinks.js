import React from "react";
import CellLink from './CellLink'
import settings from "../settings";

export default class CellLinks extends React.Component {
  render() {
    const entities = this.props.entityGroup.entities;
    const store = this.props.entityGroup.store;
    const storeType = this.props.apiResourceObjects[store.type];
    const category = this.props.apiResourceObjects[this.props.wtbEntity.category];
    let content = undefined;

    if (storeType.id === settings.mobileNetworkOperatorStoreType) {
      content = <CellLink
        entity={entities[0]}
        wtbEntity={this.props.wtbEntity}
        category={category}
        store={store}
        label='Con Plan' />
    } else {
      content = <React.Fragment>
        {entities.map(entity => {
          const label = entity.cell_plan? entity.cell_plan.name : 'Liberado';
          return <CellLink
            key={entity.id}
            wtbEntity={this.props.wtbEntity}
            entity={entity}
            category={category}
            store={store}
            label={label} />
        })}
      </React.Fragment>
    }

    return (
      <div className="cell_link d-flex flex-row justify-content-between border-bottom align-items-center">
        <div className="store_logo d-flex align-items-center">
          <img src={this.props.entityGroup.store.logo} className="img-fluid logo" alt={this.props.entityGroup.store.name}/>
        </div>
        <div className="store_links d-flex flex-column align-items-md">
          { content }
        </div>
      </div>
    )
  }
}

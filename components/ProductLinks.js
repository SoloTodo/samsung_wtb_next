import React from 'react'
import CellLinks from './CellLinks'
import GenericLink from './GenericLink'
import settings from '../settings'

class ProductLinks extends React.Component {
  render() {
    const category = this.props.apiResourceObjects[this.props.wtbEntity.category]

    if (category.id === settings.cellCategoryId) {
      const entityGroups = [];

      for (const entity of this.props.entities) {
        let matchingEntityGroup = entityGroups.filter(entityGroup => entityGroup.store.url === entity.store)[0];

        if (!matchingEntityGroup) {
          matchingEntityGroup = {store: this.props.apiResourceObjects[entity.store], entities: []};
          entityGroups.push(matchingEntityGroup)
        }
        matchingEntityGroup.entities.push(entity);
      }

      return <React.Fragment>
        {entityGroups.map(entityGroup =>
          <CellLinks key={entityGroup.store.id}
                     entityGroup={entityGroup}
                     wtbEntity={this.props.wtbEntity}
                     apiResourceObjects={this.props.apiResourceObjects}
                     clickHandler={this.analyticsClickHandler}/>
        )}
      </React.Fragment>
    } else {
      return <React.Fragment>
        {this.props.pricingEntry.entities.map(entity =>
          <GenericLink
            key={entity.id}
            entity={entity}
            wtbEntity={this.props.wtbEntity}
            apiResourceObjects={this.props.apiResourceObjects} />
        )}
      </React.Fragment>
    }
  }
}

export default ProductLinks
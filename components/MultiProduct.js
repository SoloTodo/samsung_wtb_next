import React from 'react'
import settings from '../settings'
import ProductLinks from './ProductLinks'
import AxisChoices from "./AxisChoices";

class MultiProduct extends React.Component{
  constructor(props){
    super(props);
    const wtbEntity = this.props.wtbEntity;
    const categoryId = this.props.apiResourceObjects[wtbEntity.category].id;

    const axes = settings.bucketCategories[categoryId].axes;

    let convertedAxes = axes.map(axis => {
      let choices = [];
      let value = undefined;

      for (const pricingEntry of this.props.pricingEntries) {
        const product = pricingEntry.product;
        if (product.id === wtbEntity.product.id) {
          value = product.specs[axis.field];
        }
        if (choices.indexOf(product.specs[axis.field]) === -1) {
          choices.push(product.specs[axis.field])
        }
      }
      axis['choices'] = choices;
      axis['value'] = value;
      return axis
    });

    convertedAxes = convertedAxes.filter(axis => {
      return axis.choices.length > 1
    });

    this.state = {
      axes: convertedAxes
    }
  }

  handleAxisChoiceCLick = (componentAxisLabel, newValue) => {
    const convertedAxes = this.state.axes;

    for (const axis of convertedAxes) {
      if (componentAxisLabel === axis.label) {
        axis['value'] = newValue;
        break;
      }
    }

    this.setState({
      axes: convertedAxes
    })
  };

  render() {
    const filteredEntities = [];
    const selectedPricingEntries = this.props.pricingEntries.filter(pricingEntry => {
      return this.state.axes.every(axis => pricingEntry.product.specs[axis.field] === axis.value)
    });

    for (const pricingEntry of selectedPricingEntries) {
      let localFilteredEntities = pricingEntry.entities;

      // TODO Delete this after S20 launch window
      if (pricingEntry.product.name.includes('G98')) {
        localFilteredEntities = pricingEntry.entities.map(entity => {
          const defaultBundle = pricingEntry.product.name.includes('G980') ? 'Incluye cargador inalámbrico' : 'Incluye audífonos Buds+';
          const bundle = pricingEntry.product.specs['bundle_unicode'] === 'Sin bundle' ? 'Sin bundle' : defaultBundle;

          if (!entity.cell_plan) {
            entity.cell_plan = {}
          }

          entity.cell_plan.name = bundle;
          return entity;
        });
      }

      filteredEntities.push(...localFilteredEntities)
    }

    filteredEntities.sort((a, b) => {
        const aStore = this.props.apiResourceObjects[a.store];
        const bStore = this.props.apiResourceObjects[b.store];

        const aPriority = settings.storePriorities[aStore.id] || 4;
        const bPriority = settings.storePriorities[bStore.id] || 4;

        if (aPriority === bPriority) {
          return aStore.name.toUpperCase().localeCompare(bStore.name.toUpperCase());
        } else {
          return aPriority - bPriority
        }
      });

    return <div>
      <div className="row">
        <div className="axes_container col-12" id="axis_options">
          {this.state.axes.map(axis => (
            <AxisChoices key={axis.label} axis={axis} onClickHandler={this.handleAxisChoiceCLick}/>
          ))}
        </div>
      </div>

      {filteredEntities.length ?
        <ProductLinks
          apiResourceObjects={this.props.apiResourceObjects}
          entities={filteredEntities}
          wtbEntity={this.props.wtbEntity}
          isUserAgentMobile={this.props.isUserAgentMobile}
        /> :
        <div className="row">
          <div className="col-12 mt-3">
            <h4>Esta combinación no está disponible actualmente, puedes usar los botones superiores para cotizar
              otras</h4>
          </div>
        </div>}
    </div>
  }
}

export default MultiProduct
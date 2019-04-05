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

      for (let pricingEntry of this.props.pricingEntries) {
        let product = pricingEntry.product;
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
    let filteredEntities = [];
    const selectedPricingEntry = this.props.pricingEntries.filter(pricingEntry => {
      return this.state.axes.every(axis => pricingEntry.product.specs[axis.field] === axis.value)
    })[0];

    if (selectedPricingEntry) {
      let storeUrls = [];
      filteredEntities = selectedPricingEntry.entities.filter(entity => {
        let storeUrl = entity.store;
        if (!storeUrls.includes(storeUrl)) {
          storeUrls.push(storeUrl);
          return true
        }
        return false
      });
    }

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
          <div className="col-12">
            <h1>Esta combinación no está disponible actualmente, puedes usar los botones superiores para cotizar
              otras</h1>
          </div>
        </div>}
    </div>
  }
}

export default MultiProduct
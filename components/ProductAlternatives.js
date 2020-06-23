import React from 'react'
import settings from "../settings";
import {fetchJson} from "../react-utils/utils";


class ProductAlternatives extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: true
        }
    }

    async componentDidMount() {
        const apiResourceObjects = this.props.apiResourceObjects;
        const wtbEntity = this.props.wtbEntity;
        let alternativeProducts;
        const categoryId = apiResourceObjects[wtbEntity.category].id
        if (!settings.noAlternativeCategories.includes(categoryId)) {
            alternativeProducts = await getAlternativeProducts(wtbEntity)
        }

        this.setState({
            alternativeProducts,
            searching: false
        })
    }

    render() {
        const categoryId = this.props.apiResourceObjects[this.props.wtbEntity.category].id;

        if (this.state.searching && !settings.noAlternativeCategories.includes(categoryId)) {
            return <h4 className="pt-2">Buscando Alternativas...</h4>
        }

        if (!this.state.alternativeProducts) {
            return <h4 className="pt-2">Este producto no esta disponible.</h4>
        }

        const firstThreeAlternatives = this.state.alternativeProducts.slice(0, 3);
        return <React.Fragment>
            <h4 className="pt-2">Este producto no esta disponible, te sugerimos las siguientes alternativas</h4>
            <div className="d-flex flex-wrap justify-content-between">
                {firstThreeAlternatives.map(entity => {
                    return <a href={entity.external_url} target="_top" className="d-flex alternative-container flex-column align-items-center">
                        <div className="alternative-image">
                            <img alt={entity.id} src={entity.picture_url}/>
                        </div>
                        <div className="d-flex alternative-text">
                            <span>{entity.name}</span>
                        </div>
                    </a>
                })}
            </div>
        </React.Fragment>
    }
}

const getAlternativeProducts = async (wtbEntity) => {
  let url =`wtb/entities/${wtbEntity.id}/available_alternatives/?`;
  for (const storeId of settings.stores) {
    url += `stores=${storeId}&`
  }
  return fetchJson(url)
};

export default ProductAlternatives
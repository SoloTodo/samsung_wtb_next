import React from 'react'


class ProductAlternatives extends React.Component {
    render() {
        if (!this.props.alternativeProducts) {
            return <h4 className="pt-2">Este producto no esta disponible.</h4>
        }

        const firstThreeAlternatives = this.props.alternativeProducts.slice(0, 3);
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

export default ProductAlternatives
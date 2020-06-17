import React from 'react'


class ProductAlternatives extends React.Component {
    render() {
        const firstThreeAlternatives = this.props.alternativeProducts.slice(0, 3);
        return <React.Fragment>
            <h3>Este producto no esta disponible actualmente, te sugerimos las siguientes alternativas:</h3>
            <div className="d-flex flex-wrap justify-content-between">
                {firstThreeAlternatives.map(entity => {
                    return <div className="d-flex alternative-container flex-column align-items-center">
                        <div className="alternative-image">
                            <img alt={entity.id} src={entity.picture_url}/>
                        </div>
                        <div className="d-flex alternative-text">
                            <span>{entity.name}</span>
                        </div>
                    </div>
                })}
            </div>
        </React.Fragment>
    }
}

export default ProductAlternatives
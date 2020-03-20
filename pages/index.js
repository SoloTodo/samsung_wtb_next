import React from 'react'

import {fetchJson} from '../react-utils/utils'

import settings from '../settings'
import ProductLinks from '../components/ProductLinks'
import MultiProduct from '../components/MultiProduct'


class Index extends React.Component{
  static getInitialProps = async ({query}) => {
    const promises = [];

    promises.push(getApiResourceObjects());
    promises.push(getWtbEntity(query.model_code));

    const [apiResourceObjects, wtbEntity] = await Promise.all(promises);

    if (!wtbEntity || !wtbEntity.product) {
      return {
        apiResourceObjects,
        wtbEntity
      }
    }

    // Pricing Entries
    const pricingEntries = await getPricingEntries(wtbEntity);

    // This is to filter out the samsung store when the product is a galaxy s20
    // TODO: Remove all this

    if (wtbEntity.name.includes('G98')) {
      for (const pricingEntry of pricingEntries) {
        pricingEntry.entities = pricingEntry.entities.filter(entity => apiResourceObjects[entity.store].id !== 223);
      }
    }

    // End of samsung s20 code. When removing stop here.

    for (const pricingEntry of pricingEntries) {
      pricingEntry.entities.sort((a, b) => {
        const aStore = apiResourceObjects[a.store];
        const bStore = apiResourceObjects[b.store];

        const aPriority = settings.storePriorities[aStore.id] || 4;
        const bPriority = settings.storePriorities[bStore.id] || 4;

        if (aPriority === bPriority) {
          return aStore.name.toUpperCase().localeCompare(bStore.name.toUpperCase());
        } else {
          return aPriority - bPriority
        }
      })
    }

    return {
      apiResourceObjects,
      wtbEntity,
      pricingEntries
    }
  };

  componentDidMount() {
    if (!this.props.wtbEntity || !this.props.wtbEntity.product) {
      return
    }

    const params = {};
    const productKey = this.props.wtbEntity.key;
    const productName = this.props.wtbEntity.product.name;
    const categoryName = this.props.apiResourceObjects[this.props.wtbEntity.category].name;
    const pricingEntry = this.props.pricingEntries.filter(entry => entry.product.id === this.props.wtbEntity.product.id)[0];
    const status = pricingEntry.entities.length ? "Disponible" : "No Disponible";

    params.dimension1 = productName;
    params.dimension2 = categoryName;
    params.dimension4 = `${productKey}|${productName}|${categoryName}|${status}`;
    params.dimension6 = productKey;
    params.dimension7 = status;

    window.gtag('config', settings.googleAnalyticsId, params);

    delete params['dimension7'];
    params.non_interaction = true;
    params.event_category = 'Store Display';
    params.event_label = 'Store Display';
    params.send_to = settings.googleAnalyticsId;
    const sent_stores = [];

    for (const entity of pricingEntry.entities) {
      const store = this.props.apiResourceObjects[entity.store];
      if (sent_stores.includes(store.id)) {
        continue;
      }

      params.dimension3 = store.name;
      params.dimension4 = `${productKey}|${productName}|${categoryName}|${store.name}`;
      sent_stores.push(store.id);
      window.gtag('event', 'Display', params)
    }
  }

  render() {
    const wtbEntity = this.props.wtbEntity;

    if (!wtbEntity || !wtbEntity.product) {
      return <div className="row">
        <div className="col-12">
          <h3>El producto aún no está disponible</h3>
        </div>
      </div>
    }

    const apiResourceObjects = this.props.apiResourceObjects;
    const pricingEntries = this.props.pricingEntries;

    return <div className="container-fluid">
      {pricingEntries.length > 1 ?
        <MultiProduct
          apiResourceObjects={apiResourceObjects}
          wtbEntity={wtbEntity}
          pricingEntries={pricingEntries}
        />
        :
        <ProductLinks
          apiResourceObjects={apiResourceObjects}
          wtbEntity={wtbEntity}
          entities={pricingEntries[0].entities}
        />
      }
    </div>
  }
}

const getApiResourceObjects = () => {
  return fetchJson('resources/?names=stores&names=categories&names=countries&names=store_types').then(resources => {
    const apiResourceObjects = {};

    for (const resource of resources) {
      apiResourceObjects[resource.url] = resource;
    }

    return apiResourceObjects;
  });
};

const getWtbEntity = key => {
  const wtbUrl = `wtb/entities/?keys=${key}&brands=${settings.wtbBrand}`;
  return fetchJson(wtbUrl).then(wtbEntity => {
    return wtbEntity.results[0] || null;
  });
};

const getPricingEntries = async wtbEntity => {
  const productId = wtbEntity.product.id;
  const categoryId = wtbEntity.category.split('/').filter(x => Boolean(x.length)).reverse()[0];
  let products;

  // Get the bucket only if the product is an S10 family (G97*) or S20 family (G98*)
  if (categoryId in settings.bucketCategories && wtbEntity.key.includes('G97')) {
    products = await fetchJson(`products/${productId}/bucket/?fields=${settings.bucketCategories[categoryId].bucketField}`);
  } else if (categoryId in settings.bucketCategories && wtbEntity.key.includes('G98')) {
    products = await fetchJson(`products/s20_bucket/`);
  } else {
    products = [wtbEntity.product]
  }

  let url = 'products/available_entities/?';
  for (const product of products) {
    url += `ids=${product.id}&`
  }
  for (const storeId of settings.stores) {
    url += `stores=${storeId}&`
  }

  const entityResults = await fetchJson(url);

  return entityResults.results.filter(pricingEntry =>
    pricingEntry.product.id === productId || pricingEntry.entities.length
  )
};

export default Index

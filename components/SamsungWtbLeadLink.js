import React from 'react';
import settings from "../settings";
import LeadLink from "../react-utils/components/LeadLink";

export default class SamsungWtbLeadLink extends React.Component {
  onClick = uuid => {
    const {wtbEntity, entity, store, category} = this.props;

    const params = {};
    const productKey = wtbEntity.key;
    const productName = entity.product.name;
    const categoryName = category.name;
    const storeName = store.name;
    const price = parseFloat(entity.active_registry.offer_price);

    params.event_category = 'Lead';
    params.event_label = uuid;
    params.value = price;
    params.send_to = settings.googleAnalyticsId;
    params.dimension1 = productName;
    params.dimension2 = categoryName;
    params.dimension3 = storeName;
    params.dimension5 = `${productKey}|${productName}|${categoryName}|${storeName}`;
    params.dimension6 = productKey;

    window.gtag('event', 'Follow', params)
  };

  render() {
    let targetUrl = null;

    if (this.props.store.id === settings.samsungShopId) {
      targetUrl = `${this.props.entity.external_url}?utm_source=samsung.com&utm_medium=referral&utm_campaign=wtb`
    }

    return <LeadLink
      entity={this.props.entity}
      store={this.props.store}
      soicosPrefix="SWTB_"
      websiteId={settings.websiteId}
      callback={this.onClick}
      className={this.props.className}
      targetUrl={targetUrl}
    >
      {this.props.children}
    </LeadLink>
  }
}
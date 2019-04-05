import React from 'react'
import SamsungWtbLeadLink from "./SamsungWtbLeadLink";

export default class CellLink extends React.Component {
    render() {
        const entity = this.props.entity;
        const store = this.props.store;
        return <div className="link d-flex align-items-center justify-content-between">
            <SamsungWtbLeadLink
              wtbEntity={this.props.wtbEntity}
              entity={entity}
              category={this.props.category}
              store={store}>
                {this.props.label}
            </SamsungWtbLeadLink>
            <SamsungWtbLeadLink
              wtbEntity={this.props.wtbEntity}
              entity={entity}
              category={this.props.category}
              store={store}
              className="btn btn-primary">
                IR
            </SamsungWtbLeadLink>
        </div>

    }
}

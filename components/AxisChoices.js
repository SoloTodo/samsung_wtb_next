import React from 'react'

class AxisChoices extends React.Component {
  render() {
    const axis = this.props.axis;
    return <div className="axis_container d-flex flex-row justify-content-center align-items-center mt-2">
      <div>{axis.label}</div>

      <select className="form-control ml-2" value={axis.value} onChange={evt => this.props.onClickHandler(axis.label, evt.target.value)}>
        {axis.choices.map(choice => <option key={choice} value={choice}>{choice}</option>)}
      </select>
    </div>
  }
}

export default AxisChoices
import React, { Component } from 'react';

class TableRow extends Component {
  render() {
    return (
      <tr>
        <td>
          {this.props.username}
        </td>
        <td>
          {this.props.description}
        </td>
        <td className="prof-pic">
          <img src={this.props.pictureUrl}></img>
        </td>
      </tr>
    )
  }
}

export default TableRow;

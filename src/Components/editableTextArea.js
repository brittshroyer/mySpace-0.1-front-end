import React, { Component } from 'react';

class editableTextArea extends Component {

  render() {
    return (
      <div>
        <form className="mb-3">
          <textarea className="form-control" rows="22" ref="userDescription" value={this.props.description} onChange={this.props.handleChange}></textarea>
        </form>
        <button className="btn btn-primary" onClick={this.props.handleSubmit}><i className="fa fa-check-circle fa-lg mr-2"></i>Save</button>
      </div>
    );
  }
}

export default editableTextArea;

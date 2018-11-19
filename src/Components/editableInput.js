import React, { Component } from 'react';

class EditableInput extends Component {

  render() {
    return (
      <form>
        <label>
          <input type="text" name="name" onChange={this.props.handleChange} />
        </label>
        <button className="btn btn-primary ml-3" onClick={this.props.handleSubmit}>Save</button>
      </form>
    );
  }
}

export default EditableInput;

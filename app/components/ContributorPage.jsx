import React from 'react';
import Container from './Container.jsx';
import services from './../services.jsx';

class AddContributor extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeContributorName = this.onChangeContributorName.bind(this);
    this.onAddContributor = this.onAddContributor.bind(this);
    this.state = {
      error: false,
      newContributorName: ''
    };
  }
  onChangeContributorName(e) {
    this.setState({
      newContributorName: e.target.value
    });
  }
  onAddContributor(e) {
    e.preventDefault();
    var that = this;
    var data = {
      'name': this.state.newContributorName,
      'active': true
    }
    if (this.state.newContributorName !== '')
      services.createContributor(data, function(data, res) {
        that.props.refresh();
        that.setState({
          error: false
        });
      });
    else
      this.setState({
        error: true
      });
  }
  render() {
    return (
      <div className="add-contributor-container">
        <h2 className="new-contributor-header">Add new Contributor</h2>
        <form className="form" onSubmit={this.onAddContributor} >
          <div className="form-group">
            <label>Contributor Name:</label>
            <input type="text" placeholder="Contributor Name..." onChange={this.onChangeContributorName} />
          </div>
          { this.state.error ? <div className="error right">Don't be this lazy!</div> : null }
          <button className="button right">Add</button>
        </form>
      </div>
    );
  }
}

class ManageContributor extends React.Component {
  render() {
    var that = this;
    var contributors = this.props.contributors.map(function(contributor) {
      return (
        <li className="contributor" key={contributor._id} >
          <label>{contributor.name}</label>
          <div>
            <a onClick={that.props.deleteContributor} data-id={contributor._id} >Delete</a>
          </div>
        </li>
      );
    });
    return (
      <div className="manage-contributor-container">
        <h2 className="box-header">Manage contributors</h2>
        <ul className="contributor-list">
          {contributors}
        </ul>
      </div>
    );
  }
}

export default class ContributorPage extends React.Component {
  constructor(props) {
    super(props);
    this.deleteContributor = this.deleteContributor.bind(this);
    this.getAllContributors = this.getAllContributors.bind(this);
    this.refresh = this.refresh.bind(this);
    this.state = {
      contributors: []
    };
  }
  componentDidMount() {
    this.getAllContributors();
  }
  getAllContributors() {
    var that = this;
    services.getAllContributors(function(contributors) {
      that.setState({
        contributors: contributors
      });
    });
  }
  deleteContributor(e) {
    var that = this;
    services.deleteContributor(e.target.dataset.id, function(res) {
      that.getAllContributors();
    });
  }
  refresh() {
    this.getAllContributors();
  }
  render() {
    return (
      <div className="add-container">
        <Container>
          <ManageContributor contributors={this.state.contributors} deleteTag={this.deleteContributor} />
          <AddContributor refresh={this.refresh} />
        </Container>
      </div>
    );
  }
}
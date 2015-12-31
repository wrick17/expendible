import React from 'react';
import Container from './Container.jsx';
import services from './../services.jsx';
import Loading from './Loading.jsx';
import NoRecords from './NoRecords.jsx';
import Modal from './Modal.jsx';
import DeleteModal from './DeleteModal.jsx';

class AddTag extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeTagName = this.onChangeTagName.bind(this);
    this.onAddTag = this.onAddTag.bind(this);
    this.state = {
      error: false,
      newTagName: '',
      submiting: false
    };
  }
  onChangeTagName(e) {
    this.setState({
      newTagName: e.target.value
    });
  }
  onAddTag(e) {
    e.preventDefault();
    var that = this;
    var data = {
      'name': this.state.newTagName
    }
    if (this.state.newTagName !== '') {
      this.setState({
        submiting: true
      });
      services.createTag(data, function(data, res) {
        that.props.refresh();
        that.refs.name.value = '';
        that.setState({
          error: false,
          submiting: false
        });
      });
    }
    else
      this.setState({
        error: true,
        submiting: false
      });
  }
  render() {
    return (
      <div className="add-tag-container">
        <h2 className="box-header">Add New Tag</h2>
        <form className="form" onSubmit={this.onAddTag} >
          <div className="form-group">
            <label>Tag Name:</label>
            <input type="text" placeholder="Tag Name..." ref="name" onChange={this.onChangeTagName} />
          </div>
          { this.state.error ? <div className="error right">Don't be this lazy!</div> : null }
          <button className="button right">{this.state.submiting ? 'Adding...' : 'Add'}</button>
        </form>
      </div>
    );
  }
}

class ManageTagList extends React.Component {
  render() {
    if (this.props.tags === 'loading') return <Loading />;
    if (this.props.tags.length < 1) return <NoRecords />;
    var that = this;
    var tags = this.props.tags.map(function(tag) {
      return (
        <li className="tag" key={tag._id} >
          <label>{tag.name}</label>
          <div>
            <a onClick={that.props.editTag} data-id={tag._id} data-name={tag.name} >Edit</a>
            <a onClick={that.props.deleteTag} data-id={tag._id} >Delete</a>
          </div>
        </li>
      );
    });
    return (
      <ul className="tag-list">
        {tags}
      </ul>
    );
  }
}

class ManageTag extends React.Component {
  render() {
    return (
      <div className="manage-tag-container">
        <h2 className="box-header">Manage Tags</h2>
        <ManageTagList tags={this.props.tags} editTag={this.props.editTag} deleteTag={this.props.deleteTag} />
      </div>
    );
  }
}

export default class TagPage extends React.Component {
  constructor(props) {
    super(props);
    this.deleteTag = this.deleteTag.bind(this);
    this.getAllTags = this.getAllTags.bind(this);
    this.refresh = this.refresh.bind(this);
    this.editTag = this.editTag.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSaveTag = this.onSaveTag.bind(this);
    this.onChangeTagName = this.onChangeTagName.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.state = {
      tags: 'loading',
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      tagName: '',
      tagId: '',
      tagError: false
    };
  }
  componentDidMount() {
    this.getAllTags();
  }
  getAllTags() {
    var that = this;
    that.setState({
      tags: 'loading'
    });
    services.getAllTags(function(tags) {
      that.setState({
        tags: tags
      });
    });
  }
  deleteTag() {
    var that = this;
    that.setState({
      tags: 'loading'
    });
    services.deleteTag(this.state.tagId, function(res) {
      that.getAllTags();
    });
  }
  refresh() {
    this.getAllTags();
  }
  editTag(e) {
    this.setState({
      isEditModalOpen: true,
      tagName: e.target.dataset.name,
      tagId: e.target.dataset.id
    });
  }
  onChangeTagName(e) {
    this.setState({
      tagName: e.target.value
    })
  }
  onSaveTag(e) {
    e.preventDefault();
    var data = {
      name: this.state.tagName
    }
    var that = this;
    services.updateTag(this.state.tagId, data, function(res) {
      console.log(res);
      that.refresh();
      that.closeModal();
    });
  }
  closeModal() {
    this.setState({
      isEditModalOpen: false
    });
  }
  showDeleteModal(e) {
    this.setState({
      isDeleteModalOpen: true,
      tagId: e.target.dataset.id
    });
  }
  confirmDelete() {
    this.deleteTag();
    this.closeDeleteModal();
  }
  closeDeleteModal(e) {
    this.setState({
      isDeleteModalOpen: false
    });
  }
  render() {
    return (
      <div className="add-container">
        <Container>
          <ManageTag tags={this.state.tags} editTag={this.editTag} deleteTag={this.showDeleteModal} />
          <AddTag refresh={this.refresh} />
        </Container>
        <Modal
          title="Edit Tag"
          open={this.state.isEditModalOpen}
          closeModal={this.closeModal} >
          <form className="form" onSubmit={this.onSaveTag} >
            <div className="form-group">
              <label>Tag Name:</label>
              <input type="text" placeholder="Tag Name..." value={this.state.tagName} data-id={this.state.tagId} onChange={this.onChangeTagName} />
            </div>
            { this.state.tagError ? <div className="error right">Don't be this lazy!</div> : null }
            <button className="button right">Save</button>
          </form>
        </Modal>
        <DeleteModal
          open={this.state.isDeleteModalOpen}
          closeModal={this.closeDeleteModal}
          confirmDelete={this.confirmDelete}
          closeDeleteModal={this.closeDeleteModal}
          item="tag" />
      </div>
    );
  }
}
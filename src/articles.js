// main.js
"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var bootstrap = require('bootstrap');

var Article = React.createClass({
  handleImageload: function(event) {
    if (this.props.path) {
      event.target.src = this.props.path;
    }
  },
  render: function() {
    return (
      <div className="col-xs-6 col-sm-4 col-md-4 col-lg-3 article">
        <div className="thumbnail">
          <a href={this.props.url} target="_blank">
            <img src="public/img/error.jpg" alt={this.props.title} onLoad={ this.handleImageload }/>
          </a>
          <div className="caption">
          <h4 className="text-ellipsis">{this.props.title}</h4>
          </div>
        </div>
      </div>
    );
  }
});

var ArticleList = React.createClass({
  render: function() {
    var articleNodes = this.props.data.map(function(article) {
      return (
        <Article path={article.randomThumbnailUrl} title={article.title} url={article.urlWithPrefix}>
        </Article>
      );
    });
    return (
      <div className="articleList">
        {articleNodes}
      </div>
    );
  }
});

var ArticleBox = React.createClass({
  loadArticles: function() {

    // for local json file testing
    // var url = this.props.url + this.state.page.nextPage + '.json'
    this.url = this.props.url + '?page=' + this.state.page.nextPage;

    $.ajax({
      url: this.url,
      dataType: 'json',
      // crossDomain: true,
      // dataType: 'jsonp',
      cache: false,
      success: function(data) {
        let articles = this.state.data.concat(data._embedded.articles);
        this.setState({
          data: articles,
          page: {
            number: data.page.number,
            totalPages: data.page.totalPages,
            nextPage: data.page.number + 1
          },
          isLoading: false
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      data: [],
      page: {
        number: 0,
        totalPages: 0,
        nextPage: 1
      },
      isLoading: false
    };
  },
  componentDidMount: function() {
    this.loadArticles();
    window.addEventListener('scroll', this.handleScroll);
  },
  componentWillUnMount: function() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  handleScroll: function(event) {
    let bodyHeight = document.body.offsetHeight,
        pageYOffset = window.pageYOffset,
        windowInnerHeight = window.innerHeight;

    let isScrollBottom = pageYOffset + windowInnerHeight > bodyHeight - 400,
        isNextPageExist = this.state.page.number < this.state.page.totalPages,
        isLoading = this.state.isLoading;

    if (isScrollBottom && isNextPageExist && !isLoading) {
      this.setState({isLoading: true});
      this.loadArticles();
    }
  },
  render: function() {
    return (
      <div className="articleBox">
        <ArticleList data={this.state.data} />
      </div>
    );
  }
});

ReactDOM.render(

  // json path for local testing
  // <ArticleBox url="data/articles/"/>,
  <ArticleBox url="//beauties-lab317.rhcloud.com/articles"/>,
  document.getElementById('content')
);
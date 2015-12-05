// main.js
"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var bootstrap = require('bootstrap');

var Article = React.createClass({
  render: function() {
    return (
      <div className="col-xs-6 col-sm-4 col-md-4 col-lg-3 article">
        <div className="thumbnail">
          <a href={this.props.url}>
            <img src={this.props.path} alt={this.props.title}/>
          </a>
          <div className="caption">
          <h4>{this.props.title}</h4>
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
        <Article path={article.randomThumbnailUrl} title={article.title} url={"https://www.ptt.cc" + article.url}>
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
    $.ajax({
      url: this.props.url + this.state.page.nextPage + '.json',
      dataType: 'json',
      // dataType: 'jsonp',
      // crossDomain: true,
      cache: false,
      success: function(data) {
        let articles = this.state.data.concat(data._embedded.articles);
        this.setState({
          data: articles,
          page: {
            number: data.page.number,
            totalPages: data.page.totalPages,
            nextPage: data.page.number + 1
          }
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
      }
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

    let isScrollBottom = pageYOffset + windowInnerHeight > bodyHeight - 10,
        isNextPageExist = this.state.page.number < this.state.page.totalPages;

    if (isScrollBottom && isNextPageExist) {
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
  <ArticleBox url="data/articles/"/>,
  document.getElementById('content')
);
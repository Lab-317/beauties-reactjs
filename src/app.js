"use strict";

import React from 'react'
import { render } from 'react-dom'
import { State, Router, Route, Link, Redirect, IndexRedirect } from 'react-router'

const Article = React.createClass({
    getInitialState: function() {
        return {isError: false};
    },
    handleImageload: function(event) {
        if (this.props.path && !this.state.isError) {
            event.target.src = this.props.path;
        }
    },
    handleImageError: function(event) {
        event.target.src = "public/img/error.jpg";
        this.setState({isError: true});
    },
    render: function() {
        return (
            <div className="col-xs-6 col-sm-4 col-md-4 col-lg-3 article">
                <div className="thumbnail">
                    <Link to={`/articles/${this.props.id}`}>
                        <img src="public/img/error.jpg" alt={this.props.title} onLoad={ this.handleImageload } onError={ this.handleImageError }/>
                    </Link>
                    <div className="caption">
                        <h4 className="text-ellipsis"><span className="label label-success">{this.props.pushNum}</span>{this.props.title}</h4>
                    </div>
                </div>
            </div>
        );
    }
});

const ArticleList = React.createClass({
    render: function() {
        var articleNodes = this.props.data.map(function(article) {
            return (
                <Article key={article.id} id={article.id} path={article.randomThumbnailUrl} title={article.title} url={article.urlWithPrefix} pushNum={article.pushNum}>
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

const ArticleBox = React.createClass({
    loadArticles: function() {

        this.url = '//beauties-lab317.rhcloud.com/articles?sort=url,desc&page=' + this.state.page.nextPage;

        $.ajax({
            url: this.url,
            dataType: 'json',
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
                number: 7, // waiting for image produce, so start from page 6
                totalPages: 0,
                nextPage: 8
            },
            isLoading: false
        };
    },
    componentDidMount: function() {
        this.loadArticles();
        window.addEventListener('scroll', this.handleScroll);
    },
    componentWillUnmount: function() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    handleScroll: function(event) {
        let bodyHeight = document.body.offsetHeight,
            pageYOffset = window.pageYOffset,
            windowInnerHeight = window.innerHeight;

        let isScrollBottom = pageYOffset + windowInnerHeight > bodyHeight / 4,
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

const Image = React.createClass({
    getInitialState: function() {
        return {isError: false};
    },
    handleImageLoad: function(event) {
        if (this.props.thumbnailUrl && !this.state.isError) {
            event.target.src = this.props.thumbnailUrl;
        }
    },
    handleImageError: function(event) {
        event.target.src = "public/img/error.jpg";
        this.setState({isError: true});
    },
    render: function() {
        return (
            <div className="col-xs-6 col-sm-4 col-md-4 col-lg-3">
                <a href={this.props.url} target="_blank" className="thumbnail">
                    <img src="public/img/error.jpg" alt={this.props.thumbnailUrl} onLoad={ this.handleImageLoad } onError={ this.handleImageError }/>
                </a>
            </div>
        );
    }
});

const ImageList = React.createClass({
    render: function() {
        var imageNodes = this.props.data.map(function(image, index) {
            return (
                <Image key={index} url={image.url} thumbnailUrl={image.thumbnailUrl}>
                </Image>
            );
        });
        return (
            <div className="ImageList">
                {imageNodes}
            </div>
        );
    }
});

const ImageBox = React.createClass({
    loadArticles: function() {

        this.url = '//beauties-lab317.rhcloud.com/articles/' + this.props.params.id;

        $.ajax({
            url: this.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                let images = data.articleImage;
                this.setState({
                    data: images
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {
            data: []
        };
    },
    componentDidMount: function() {
        this.loadArticles();
    },
    render: function() {
        return (
            <div className="ImageBox">
                <ImageList data={this.state.data} />
            </div>
        );
    }
});

const App = React.createClass({
    render: function() {
        return (
            <div>
                <nav className="navbar navbar-default navbar-inverse">
                    <div className="container-fluid">
                        {/* Brand and toggle get grouped for better mobile display */}
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">beauties</span>
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                            <Link to="/articles" className="navbar-brand">beauties</Link>
                    </div>
                        {/* Collect the nav links, forms, and other content for toggling */}
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <form className="navbar-form navbar-right" role="search">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Search" />
                                </div>
                                <button type="submit" className="btn btn-default">Submit</button>
                            </form>
                        </div>{/* /.navbar-collapse */}
                    </div>{/* /.container-fluid */}
                </nav>
                <div className="container-fluid">
                    <div className="row">
                        <section></section>
                        <div className="col-lg-12">
                            <div className="row">
                                <article>
                                    {this.props.children}
                                </article>
                            </div>
                        </div>
                        <aside></aside>
                    </div>
                </div>
            </div>
        );
    }
});


render((
    <Router>
        <Route path="/" component={App}>
            <IndexRedirect to="articles"/>
            <Route path="articles" component={ArticleBox}>
            </Route>
            <Route path="articles/:id" component={ImageBox}>
            </Route>
        </Route>
    </Router>
), document.getElementById('content'));

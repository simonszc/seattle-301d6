(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This method first DECLARES an articleData function that sets the articles property of our context object, and runs a callback. Then it CALLS Article.findWhere (a method to SQL query), using id as its field and whatever the context object's "id" is as the value. Once matches are found, it uses the articleData function to set those results equal to ctx.articles, and runs the next method. I'm not sure how we'd get routed here without entering a specific URL--"category" and "author" route to similar methods off of "change" events in their selectbox.
  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This method is very similar to the one above, with some key differences. We're routed here off of the handleFilters event, and it transforms the authorName parameter by replacing the + that exists in the route with a space. Ultimately, it takes $(this).val() and this.id off the selectbox change event, and runs a SQL query to match the author field to a specific value. Once a match is found it runs the authorData function which sets those articles that it matched equal to the articles property of the context object.
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);

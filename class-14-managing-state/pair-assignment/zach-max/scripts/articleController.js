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
  // Similar to the two methods above, the loadByCategory method declares a categoryData function which we'll call once our specific data is found. To find our data, we run the Article.findWhere method to match the ((this).val()) value which comes from our click event on the category filter. The value selected there, (ex: card, or protocol), is matched against the value we pass in as the field parameter (in this case, 'category'), and runs a SQL query to match the category field with the specific filter value. Once matches/data is found, we then run the previously declared categoryData function which assigns the grabbed data to the articles property on the ctx object. Next() is then called to run the next method in the callback chain.
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  // This method is called when the homepage is the route. It initally declares an articleData function which can be (but doesn't have to be) used to assign all data in our Article.all array to the articles property on the ctx object. The interesting thing about this method is that if Article.all has already been populated, we don't need to run a getJSON request from our database to grab the data because we already have it. In that case, we can just assign the data in our Article.all array to the articles property on the ctx object, and then run Next() to fire the next method in the callback chain. If we don't have the data, we must first run the Article.fetchAll method to grab all articles from our hackerIpsum.json file and insert them into our SQL database. Once all articles are in our SQL database, we can then run the Article.loadAll method which instantiates that data as readable objects in our Article.all array. Once the data is there, we run the articleData function as a callback to assign the data to the articles property on the ctx object. Next() is called to fire the next method in the callback chain. 
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

(function(module) {
  var articlesController = {};

  // dONE: Create the `articles` table when the controller first loads, with the code that used to be in index.html:
  Article.createTable();

  // DONE: Complete this function below that kicks off the fetching and rendering of articles, using the same
  // code that used to be in index.html.
  Article.fetchAll(articleView.initIndexPage);
  // TODO: Also be sure to hide all the main section elements, and reveal the #articles section:
  articlesController.index = function() {


  };

  module.articlesController = articlesController;
})(window);

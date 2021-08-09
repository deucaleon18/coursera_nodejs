const express = require("express");
const dishRouter = express.Router();
const Dishes = require("../models/dish");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");

dishRouter
  .route("/")

  .get((req, res, next) => {
    Dishes.find({})
      .populate("comments.author")
      .then(
        (dishes) => {
          if (dishes.length != 0) {
            console.log("These are all the dishes", dishes);
            (res.statusCode = 200),
              res.setHeader("Content-Type", "application/json");
            res.json(dishes);
          }
          console.log("There are no dishes currently");
          res.end("<h1>There are no dishes currently</h1>");
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
      await Dishes.create(req.body)
        .then(
          (dish) => {
            (res.statusCode = 200),
              res.setHeader("Content-Type", "application/json");
            console.log("You have created a new dish", dish);
            res.json(dish);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )

  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    (res.statusCode = 403),
      console.log("PUT operation is not supported on this route");
    res.end("<h1> PUT operation is not supported on this route</h1>");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
      await Dishes.deleteMany({})
        .then((dishes) => {
          console.log("All the dishes were successfully deleted", dishes);
          res.statusCode = 200;
          res.json(dishes);
        })
        .catch((err) => {
          next(err);
        });
    }
  );

dishRouter
  .route("/:dishId")
  .get(async (req, res, next) => {
    await Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then(
        (dish) => {
          if (dish != null) {
            console.log("This is the required dish", dish);
            (res.statusCode = 200),
              res.setHeader("Content-Type", "application/json");
            res.json(dish);
          } else {
            res.statusCode = 404;
            res.end("<h1>The current dish does not exist</h1>");
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    (res.statusCode = 403),
      res.end("<h1>POST operation is not supported on this route</h1>");
  })

  .put(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
      await Dishes.findByIdAndUpdate(
        req.params.leaderId,
        { $set: req.body },
        { new: true }
      )

        .then(
          (dish) => {
            console.log("This is the updated dish", dish);
            (res.statusCode = 200),
              res.setHeader("Content-Type", "application/json");
            res.json(dish);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )

  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
      await Dishes.findByIdAndDelete(req.params.dishId)
        .then(
          (dish) => {
            console.log("The dish has been successfully deleted", dish);
            (res.statusCode = 200),
              res.setHeader("Content-Type", "application/json");
            res.json(dish);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

dishRouter
  .route("/:dishId/comments")

  .get(async (req, res, next) => {
    await Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then(
        (dish) => {
          if (dish != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else {
            var err = new Error(
              "The dish with " + req.params.dishId + "does not exist"
            );
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )

      .catch((err) => next(err));
  })

  .post(authenticate.verifyUser, async (req, res, next) => {
    await Dishes.findById(req.params.dishId)
      .then(
        async (dish) => {
          if (dish != null) {
            req.body.author = req.user._id;
            await dish.comments.push(req.body);
            await dish
              .save()
              .then(
                (dish) => {
                  Dishes.findById(dish._id)
                    .populate("comments.author")
                    .then((dish) => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(dish);
                    });
                },
                (err) => next(err)
              )
              .catch((err) => {
                next(err);
              });
          } else {
            var err = new Error(
              "The dish with " + req.params.dishId + "does not exist"
            );
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("<h1>PUT operation not supported for this route</h1>");
  })

  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
      await Dishes.findById(req.params.dishId)
        .then(
          async (dish) => {
            if (dish != null) {
              for (var i = 0; i < dish.comments.length; i++) {
                await dish.comments.id(dish.comments[i]._id).remove();
              }
              await dish
                .save()
                .then(
                  (dish) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish);
                  },
                  (err) => next(err)
                )
                .catch((err) => {
                  next(err);
                });
            } else {
              var err = new Error(
                "The dish with " + req.params.dishId + "does not exist"
              );
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

dishRouter
  .route("/:dishId/comments/:commentId")

  .get(async (req, res, next) => {
    await Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
          } else if (dish == null) {
            var err = new Error(
              "The dish with " + req.params.dishId + "does not exist"
            );
            err.status = 404;
            return next(err);
          } else {
            var err = new Error(
              "The comment with " + req.params.commentId + "does not exist"
            );
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )

      .catch((err) => next(err));
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 404;
    res.end("<h1>The particular route is not supported</h1>");
  })

  
  .put(authenticate.verifyUser, async (req, res, next) => {
     
    await Dishes.findById(req.params.dishId)
      .then(
        (dish) => {

          if (dish != null && dish.comments.id(req.params.commentId) != null&&dish.comments.id(req.params.commentId).author._id.equals(req.user._id)) {
            if (req.body.rating) {
              dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
              dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish
              .save()
              .then((dish) => {
                  Dishes.findById(dish._id)
                  .populate('comments.author')
                  .then((dish)=>{ res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish.comments.id(req.params.commentId))
                })
               
               
              })
              .catch((err) => next(err));
          } else if (dish == null) {
            var err = new Error(
              "The dish with " + req.params.dishId + "does not exist"
            );
            err.status = 404;
            return next(err);
          }
           else if(dish.comments.id(req.params.commentId) == null){
            var err = new Error(
              "The comment with " + req.params.commentId + "does not exist"
            );
            err.status = 404;
            return next(err);
          }

          else {
            var err = new Error(
              "You are not authorized to perform this operation on comments' by other users"
            );
            err.status = 401;
            return next(err);
          }
        },
        (err) => next(err)
      )

      .catch((err) => next(err));
  })

  .delete(authenticate.verifyUser, async (req, res, next) => {
    await Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          
          if (dish != null && dish.comments.id(req.params.commentId) !== null&&dish.comments.id(req.params.commentId).author._id.equals(req.user._id)) {


            dish.comments.id(req.params.commentId).remove();
            dish
              .save()
              .then(
                (dish) => {
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{ res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(dish.comments.id(req.params.commentId))
                  })
                })
              .catch((err) => {
                next(err);
              });
          
          
            } else if (dish == null) {
            var err = new Error(
              "The dish with " + req.params.dishId + "does not exist"
            );
            err.status = 404;
            return next(err);
          } else if(dish.comments.id(req.params.commentId) == null){
            var err = new Error(
              "The comment with " + req.params.commentId + "does not exist"
            );
            err.status = 404;
            return next(err);
          }
          else {
            var err = new Error(
              "You are not authorized to perform this operation on comments' by other users"
            );
            err.status = 401;
            return next(err);
          }
       

        },
        (err) => next(err)
      )
      .catch((err) => next(err));


  });

module.exports = dishRouter;

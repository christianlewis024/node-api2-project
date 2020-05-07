const express = require("express");
const router = express.Router();
//  this class ^ creates modular, mountable route handlers.

const db = require("./data/db");

// get
router.route("/").get(async (req, res) => {
  try {
    const allPosts = await db.find();
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(400).json(err);
  }
});

// get comments
router
  .get("/:id/comments", (req, res) => {
    db.findPostComments(req.params.id)
      .then((item) => {
        if (item) {
          res.status(200).json(item);
        } else {
          res.status(404).json({
            errorMessage: "404 -The post with the specified ID does not exist.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          errorMessage: "500 -The comments information could not be retrieved.",
        });
      });
  })

  // post

  .post("/", (req, res) => {
    !req.body.title || !req.body.contents
      ? res.status(400).json("please provide title and contents for the post. ")
      : db
          .insert(req.body)
          .then((post) => {
            db.findById(post.id).then((updated) =>
              res.status(201).json(updated)
            );
          })
          .catch((err) =>
            res
              .status(500)
              .json("there was an error while saving the post to the database")
          );
  });

// delete

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then((deleted) => {
      if (deleted) {
        res.status(200).json({ message: `Deleted.` });
      } else {
        res
          .status(404)
          .json({ message: `The post with the specified ID does not exist.` });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: `the post could not be removed` });
    });
});
// put
router.put("/:id", (req, res) => {
  const post = req.body;
  const id = req.params.id;

  if (!post.title || !post.contents) {
    res.status(400).json({
      errorMessage: "400 - Please provide title and contents for the post.",
    });
  } else {
    db.update(id, post)
      .then((item) => {
        if (item) {
          res.status(200).json(post);
        } else {
          res.status(404).json({
            errorMessage: "404- The post with the specified ID does not exist.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          errorMessage: "500 The post information could not be modified.",
        });
      });
  }
});

// post comment

router.post("/:id/comments", (req, res) => {
  const comments = req.body;
  if (!comments.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comments." });
  } else {
    db.insertComment(comments)
      .then((item) => {
        if (item) {
          res.status(201).json(item);
        } else {
          res.status(404).json({
            errorMessage: "The post with the specified ID does not exist.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ errorMessage: "500 - server error" });
      });
  }
});

module.exports = router;
// // put

//     if (post) {
//       posts = posts.map((post) => {
//         return post.id === id ? { id, ...changePost } : post;
//       });
//       const updatedPost = posts.find((e) => {
//         return e.id === id;
//       });
//       updatedPost
//         ? res.status(200).json(updatedPost)
//         : res.status(500).json({
//             errorMessage: "the post could not be modified",
//           });
//     } else {
//       res.status(404).json({
//         errorMessage: "the post with the specified id does not exist",
//       });
//     }
//   }
// });

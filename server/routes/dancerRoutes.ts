import * as express from "express";
import Api from "../api";

export function dancerRouter(api: Api) {
  const router = express.Router();

  router.get(
    "/:id?",
    async (req, res, next) => {
      const {
        params: { id },
      } = req;

      if (!id) {
        next();
        return;
      }

      api.getDancer(id).then((returnVal) => {
        res.send(returnVal);
      });
    },
    (req, res) => {
      api.getDancers().then((returnVal) => {
        res.send(returnVal);
      });
    }
  );

  router.get("/:dancerId/dances", (req, res) => {
    const { dancerId } = req.params;

    api.getDancesForDancer(dancerId).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.post("/", (req, res) => {
    const { dancers }: { dancers: string[] } = req.body;

    api.addDancers(dancers).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.patch("/:dancerId", (req, res) => {
    const { dancerId } = req.params;
    const { options }: { options: { newDancerName: string } } = req.body;

    api.updateDancer(dancerId, options).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.delete("/:dancerId", (req, res) => {
    const { dancerId } = req.params;

    api.deleteDancer(dancerId).then((returnVal) => {
      res.send(returnVal);
    });
  });

  return router;
}

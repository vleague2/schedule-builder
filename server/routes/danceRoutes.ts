import * as express from "express";
import Api from "../api";

export function danceRouter(api: Api, authenticationCheck) {
  const router = express.Router();

  router.get(
    "/:id?",
    authenticationCheck,
    async (req, res, next) => {
      const {
        params: { id },
      } = req;

      if (!id) {
        next();
        return;
      }

      api.getDance(id).then((returnVal) => {
        res.send(returnVal);
      });
    },
    (req, res) => {
      const teacherId = req.query.teacherId?.toString();

      api.getDances(teacherId).then((returnVal) => {
        res.send(returnVal);
      });
    }
  );

  router.get("/:danceId/dancers", authenticationCheck, (req, res) => {
    const { danceId } = req.params;

    api.getDancersForDance(danceId).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.post("/", authenticationCheck, (req, res) => {
    const { dances }: { dances: { danceName: string; teacherId: string }[] } =
      req.body;

    api.addDances(dances).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.post("/:danceId/dancers", authenticationCheck, (req, res) => {
    const { danceId } = req.params;

    const { dancerIds }: { dancerIds: string[] } = req.body;

    api.addDancersToDance({ danceId, dancerIds }).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.patch("/:danceId", authenticationCheck, (req, res) => {
    const { danceId } = req.params;
    const {
      options,
    }: { options: { newDanceName?: string; newTeacherId?: string } } = req.body;

    api.updateDance(danceId, options).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.delete("/:danceId", authenticationCheck, (req, res) => {
    const { danceId } = req.params;

    api.deleteDance(danceId).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.delete("/:danceId/dancers", authenticationCheck, (req, res) => {
    const { danceId } = req.params;
    const { dancerIds }: { dancerIds: string[] } = req.body;

    api.removeDancersFromDance({ danceId, dancerIds }).then((returnVal) => {
      res.send(returnVal);
    });
  });

  return router;
}

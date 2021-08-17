import * as express from "express";
import Api from "../api";

export function scheduledDanceRouter(api: Api) {
  const router = express.Router();

  router.post("/", (req, res) => {
    const { startsAt, endsAt, danceId, studioId } = req.body;

    api
      .addScheduledDance({ startsAt, endsAt, danceId, studioId })
      .then((returnVal) => {
        res.send(returnVal);
      });
  });

  router.patch("/:scheduledDanceId", (req, res) => {
    const { scheduledDanceId } = req.params;
    const {
      options: { startAt, endAt, studioId },
    }: { options: { startAt?: string; endAt?: string; studioId?: string } } =
      req.body;

    api
      .updateScheduledDance(scheduledDanceId, { startAt, endAt, studioId })
      .then((returnVal) => {
        res.send(returnVal);
      });
  });

  router.delete("/:scheduledDanceId", (req, res) => {
    const { scheduledDanceId } = req.params;

    api.deleteScheduledDance(scheduledDanceId).then((returnVal) => {
      res.send(returnVal);
    });
  });

  return router;
}

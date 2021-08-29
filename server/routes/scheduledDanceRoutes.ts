import * as express from "express";
import Api from "../api";

export function scheduledDanceRouter(api: Api, authenticationCheck) {
  const router = express.Router();

  router.get("/", authenticationCheck, (req, res) => {
    api.getScheduledDances().then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.post("/", authenticationCheck, (req, res) => {
    const { startAt, endAt, danceId, studioId, scheduleId } = req.body;

    api
      .addScheduledDance({ startAt, endAt, danceId, studioId, scheduleId })
      .then((returnVal) => {
        res.send(returnVal);
      });
  });

  router.patch("/:scheduledDanceId", authenticationCheck, (req, res) => {
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

  router.delete("/:scheduledDanceId", authenticationCheck, (req, res) => {
    const { scheduledDanceId } = req.params;

    api.deleteScheduledDance(scheduledDanceId).then((returnVal) => {
      res.send(returnVal);
    });
  });

  return router;
}

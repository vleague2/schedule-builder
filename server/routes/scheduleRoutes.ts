import * as express from "express";
import Api from "../api";

export function scheduleRouter(api: Api) {
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

      api.getSchedule(id).then((returnVal) => {
        res.send(returnVal);
      });
    },
    (req, res) => {
      api.getSchedules().then((returnVal) => {
        res.send(returnVal);
      });
    }
  );

  router.post("/", (req, res) => {
    const { schedules }: { schedules: string[] } = req.body;

    api.addSchedules(schedules).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.patch("/:scheduleId", (req, res) => {
    const { scheduleId } = req.params;
    const { options }: { options: { newScheduleName: string } } = req.body;

    api.updateSchedule(scheduleId, options).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.delete("/:scheduleId", (req, res) => {
    const { scheduleId } = req.params;

    api.deleteStudio(scheduleId).then((returnVal) => {
      res.send(returnVal);
    });
  });

  return router;
}

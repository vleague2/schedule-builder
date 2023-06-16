import * as express from "express";
import Api from "../api";

export function scheduleWarningRouter(api: Api, authenticationCheck) {
  const router = express.Router();

  router.get("/:scheduleId", authenticationCheck, (req, res) => {
    const {
      params: { scheduleId },
    } = req;

    api.getWarningsForSchedule(scheduleId).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.post("/", authenticationCheck, (req, res) => {
    const { scheduleWarnings }: { scheduleWarnings: {
      conflictObjectId: string | number;
      warningType: string;
      errorMessage: string;
      scheduleId: string | number;
      conflictDanceIds: string[] | number[];
    }[] } = req.body;

    api.addScheduleWarnings(scheduleWarnings).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.delete("/:scheduleWarningId", authenticationCheck, (req, res) => {
    const { scheduleWarningId } = req.params;

    api.deleteScheduleWarning(scheduleWarningId).then((returnVal) => {
      res.send(returnVal);
    });
  });

  return router;
}

import * as express from "express";
import Api from "../api";

export function teacherRouter(api: Api, authenticationCheck) {
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

      api.getTeacher(id).then((returnVal) => {
        res.send(returnVal);
      });
    },
    (req, res) => {
      api.getTeachers().then((returnVal) => {
        res.send(returnVal);
      });
    }
  );

  router.post("/", authenticationCheck, (req, res) => {
    const { teachers }: { teachers: string[] } = req.body;

    api.addTeachers(teachers).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.patch("/:teacherId", authenticationCheck, (req, res) => {
    const { teacherId } = req.params;
    const { options }: { options: { newTeacherName: string } } = req.body;

    api.updateTeacher(teacherId, options).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.delete("/:teacherId", authenticationCheck, (req, res) => {
    const { teacherId } = req.params;

    api.deleteTeacher(teacherId).then((returnVal) => {
      res.send(returnVal);
    });
  });

  return router;
}

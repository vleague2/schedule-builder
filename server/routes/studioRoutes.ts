import * as express from "express";
import Api from "../api";

export function studioRouter(api: Api, authenticationCheck) {
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

      api.getStudio(id).then((returnVal) => {
        res.send(returnVal);
      });
    },
    (req, res) => {
      api.getStudios().then((returnVal) => {
        res.send(returnVal);
      });
    }
  );

  router.post("/", authenticationCheck, (req, res) => {
    const { studios }: { studios: string[] } = req.body;

    api.addStudios(studios).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.patch("/:studioId", authenticationCheck, (req, res) => {
    const { studioId } = req.params;
    const { options }: { options: { newStudioName: string } } = req.body;

    api.updateStudio(studioId, options).then((returnVal) => {
      res.send(returnVal);
    });
  });

  router.delete("/:studioId", authenticationCheck, (req, res) => {
    const { studioId } = req.params;

    api.deleteStudio(studioId).then((returnVal) => {
      res.send(returnVal);
    });
  });

  return router;
}

import { Popover, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { TDancer } from "../models/TDancer";
import { getDancersInDance } from "../resources/dancesResource";

type TCastPopoverProps = {
  danceId: number;
  open: boolean;
  anchorEl: HTMLButtonElement;
  handleClose: () => void;
};

export function CastPopover(props: TCastPopoverProps): JSX.Element {
  const { danceId, open, anchorEl, handleClose } = props;

  const [cast, setCast] = useState<TDancer[] | undefined>(undefined);

  useEffect(() => {
    getDancersInDance(danceId).then((dancers) => {
      setCast(dancers.data.sort((a, b) => a.name.localeCompare(b.name)));
    });
  }, [danceId]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <div style={{ padding: 15, maxWidth: 275 }}>
        <Typography variant="caption">
          Dancers:{" "}
          {cast?.map((castMember, index) => {
            const itemIsLastInArray = index === cast.length - 1;
            return (
              <span key={castMember.name}>
                {castMember.name}
                {!itemIsLastInArray && ","}{" "}
              </span>
            );
          })}
        </Typography>
      </div>
    </Popover>
  );
}

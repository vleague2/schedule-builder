import { TDance } from "./TDance";

export type TScheduleWarning = {
    scheduleWarning: {
        id: number;
        conflictObjectId: number;
        warningType: string;
        errorMessage: string;
        ScheduleId: number;
    },
    dancesWithConflict: TDance['id'][]
}
export type TAddScheduleWarningDto = {
    scheduleWarnings: {
        conflictObjectId: string | number;
        warningType: string;
        errorMessage: string;
        scheduleId: string | number;
        conflictDanceIds: string[] | number[];
    }[]
}
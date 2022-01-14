import { TAdminDialogType } from "../models/TAdminDialogType";
import { MessageBox } from "./presentational/MessageBox/MessageBox";

type TDialogErrorMessageProps = {
  errors: string[];
  successCount: number;
  dialogType: TAdminDialogType;
};

export function DialogErrorMessage(
  props: TDialogErrorMessageProps
): JSX.Element {
  const { errors, successCount, dialogType } = props;

  return (
    <>
      {errors.length > 0 && successCount > 0 && (
        <MessageBox
          style="success"
          messages={[`Successfully added ${successCount} ${dialogType}(s)`]}
        />
      )}
      {errors.length > 0 && (
        <div style={{ marginBottom: 30 }}>
          <MessageBox style="error" messages={errors} />
        </div>
      )}
    </>
  );
}

import { TextField } from "@material-ui/core";

type TDropdownProps = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  dropdownItems: { value: string; label: string }[];
};

export function Dropdown(props: TDropdownProps): JSX.Element {
  const { label, value, setValue, dropdownItems } = props;

  return (
    <TextField
      select
      fullWidth
      variant="outlined"
      label={label}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      }}
      style={{ marginBottom: 20 }}
      value={value}
    >
      {dropdownItems.map((item) => (
        <option value={item.value} key={item.value}>
          {item.label}
        </option>
      ))}
    </TextField>
  );
}

import { useState } from "react";

type CheckboxDefaultProps = {
  title: string;
  name: string;
  checked: boolean;
};

const CheckboxDefault = ({ title, name, checked }: CheckboxDefaultProps) => {
    const [isChecked, setIsChecked] = useState(!checked == false);

  return (
    <div>
      <label className="form-label">
      {title}
          <input
            type="checkbox"
            name={name}
            checked={isChecked}
            style={{ marginLeft: "5px", marginRight: "5px", width: "16px", height: "16px" }}
            value={isChecked ? "true" : "false"}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
        {isChecked ? "Yes" : "No"}
      </label>
    </div>
  );
};

export default CheckboxDefault;
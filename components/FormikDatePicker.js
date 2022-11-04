import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from "material-ui-pickers";

function FormikDatePicker() {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        keyboard
        clearable
        format="dd/MM/yyyy"
        value={selectedDate}
        onChange={handleDateChange} />
    </MuiPickersUtilsProvider>
  );
}

export default FormikDatePicker;
